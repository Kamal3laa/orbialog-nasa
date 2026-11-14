"""
Merges the exported Earth Engine CSV latitude bands, runs the Mahalanobis detector
against the 6 Moon & Mars planetary targets, and formats the results for MongoDB Atlas.
"""

import os
import glob
import json
import numpy as np
import pandas as pd
from detect import rank_tiles, FEATURES

TARGETS_DIR = os.path.join(os.path.dirname(__file__), "targets")
OUTPUT_MATCHES = os.path.join(os.path.dirname(__file__), "computed_matches.json")

# Known analog sites to exclude when searching for NOVEL sites
KNOWN_ANALOGS = (
    (27.2883, 28.1633),    # White Desert, Egypt
    (-24.0667, -70.0167),  # Atacama Yungay, Chile
    (75.3667, -89.6833),   # Devon Island, Canada
    (-77.4667, 162.5333),  # McMurdo Dry Valleys, Antarctica
    (19.5362, -155.5763),  # HI-SEAS Mauna Loa, Hawaii
    (78.2232, 15.6267),    # Svalbard, Norway
)

# Mission profile weight presets
WEIGHT_PRESETS = {
    "mars_rover_mobility": {
        "slope": 1.5,
        "rough": 1.5,
        "p90": 1.2,
        "lst_amp": 1.2,
        "ndvi": 1.5,
        "precip_mm_yr": 1.5,
        "albedo": 1.0,
        "mafic_idx": 1.2,
        "carbonate_idx": 1.0,
        "quartz_idx": 1.0,
    },
    "lunar_isru_basalt": {
        "slope": 1.2,
        "rough": 1.2,
        "p90": 1.0,
        "lst_amp": 1.8,
        "albedo": 1.5,
        "mafic_idx": 1.8,
        "carbonate_idx": 0.8,
        "quartz_idx": 0.8,
        "ndvi": 1.5,
        "precip_mm_yr": 1.2,
    },
}

def load_earth_tiles() -> pd.DataFrame:
    """Finds and combines all exported 1deg band CSVs."""
    csv_files = glob.glob(os.path.join(os.path.dirname(__file__), "*earth_tiles*.csv"))
    if not csv_files:
        raise FileNotFoundError(
            "No Earth tile CSVs found yet in pipeline/. "
            "Download the completed CSVs from Google Drive into pipeline/ to run detection."
        )

    print(f"Loading {len(csv_files)} CSV band file(s): {[os.path.basename(f) for f in csv_files]}")
    dfs = [pd.read_csv(f) for f in csv_files]
    merged = pd.concat(dfs, ignore_index=True).drop_duplicates(subset=["lat", "lon"])
    print(f"Total terrestrial tiles loaded: {len(merged)}")
    return merged

def run_pipeline():
    earth_df = load_earth_tiles()

    # Load targets
    target_files = glob.glob(os.path.join(TARGETS_DIR, "*.features.json"))
    print(f"Found {len(target_files)} planetary targets to evaluate.")

    computed_results = []

    for tpath in target_files:
        with open(tpath) as f:
            target = json.load(f)

        target_id = target["target_id"]
        planet = target["planet"]
        weights = WEIGHT_PRESETS["lunar_isru_basalt"] if planet == "moon" else WEIGHT_PRESETS["mars_rover_mobility"]

        print(f"\n--- Ranking for {target['name']} ({target_id}) ---")

        # 1. Positive controls test (without exclusion)
        unfiltered = rank_tiles(earth_df, target, weights=weights, known_sites=(), top_n=5)
        print("Top 5 global matches (positive control):")
        for _, row in unfiltered.iterrows():
            print(f"  [{row['lat']:.2f}, {row['lon']:.2f}] Sim: {row['similarity']:.1f}% (Worst gap: {row['worst_feature']})")

        # 2. Discovery mode (excluding known sites within 150 km)
        novel_matches = rank_tiles(earth_df, target, weights=weights, known_sites=KNOWN_ANALOGS, exclude_km=150.0, top_n=10)
        print("Top novel analog candidates:")
        for idx, row in novel_matches.head(3).iterrows():
            print(f"  ★ Candidate: [{row['lat']:.2f}, {row['lon']:.2f}] Sim: {row['similarity']:.1f}%")

            # Build database import record
            computed_results.append({
                "targetId": target_id,
                "analogId": f"candidate-{int(row['lat'])}-{int(row['lon'])}",
                "locationName": f"Terrestrial Analog Tile [{row['lat']:.1f}°, {row['lon']:.1f}°]",
                "country": "Global Coordinate Grid",
                "coordinates": {"lat": float(row["lat"]), "lng": float(row["lon"])},
                "similarity": round(float(row["similarity"]), 1),
                "mahalanobisD2": round(float(row["d2"]), 2),
                "worstFeature": str(row["worst_feature"]),
                "breakdown": {
                    "geologyMatch": f"High (Emissivity Mafic Index: {row.get('mafic_idx', 1.0):.2f})",
                    "thermalMatch": f"Moderate (Diurnal LST Amp: {row.get('lst_amp', 0.0):.1f} K)",
                    "limits": f"Earth 1G; Atmospheric pressure ~1013 mbar; {row['worst_feature']} divergence",
                },
                "matches": [
                    f"Aridity match (precip: {row.get('precip_mm_yr', 0):.1f} mm/yr)",
                    f"Slope variance agreement (slope: {row.get('slope', 0):.1f}°)",
                    f"Mineral spectrum correspondence (albedo: {row.get('albedo', 0):.2f})",
                ],
                "suggestedTesting": "Testing autonomous rover navigation & optical sensors in dusty conditions",
                "provenance": {
                    "dataset": "Google Earth Engine (SRTM, MODIS, GPM, ASTER GED)",
                    "version": "1deg-global-v1",
                },
            })

    # Save to computed_matches.json
    with open(OUTPUT_MATCHES, "w") as f:
        json.dump(computed_results, f, indent=2)

    print(f"\n[DONE] Saved {len(computed_results)} computed match records to {OUTPUT_MATCHES}")
    print("Run `npm run import:computed` in backend/ to load them into MongoDB Atlas.")

if __name__ == "__main__":
    run_pipeline()
