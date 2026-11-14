"""
ORBiALOG Planetary Analog Detection Engine
Uses Mahalanobis distance against Earth's feature covariance distribution (Ledoit-Wolf)
to identify terrestrial candidate sites statistically closest to Moon/Mars target profiles.
"""

from typing import Dict, List, Tuple, Optional
import json
import numpy as np
import pandas as pd
from sklearn.covariance import LedoitWolf
from sklearn.preprocessing import RobustScaler

FEATURES = [
    "slope",
    "p90",
    "rough",
    "lst_amp",
    "lst_max",
    "ndvi",
    "precip_mm_yr",
    "albedo",
    "mafic_idx",
    "carbonate_idx",
    "quartz_idx",
]


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two coordinates in kilometers."""
    p = np.pi / 180.0
    a = (
        np.sin((lat2 - lat1) * p / 2.0) ** 2
        + np.cos(lat1 * p) * np.cos(lat2 * p) * np.sin((lon2 - lon1) * p / 2.0) ** 2
    )
    return 12742.0 * np.arcsin(np.sqrt(a))


def rank_tiles(
    earth_df: pd.DataFrame,
    target_vec: Dict[str, float],
    weights: Optional[Dict[str, float]] = None,
    known_sites: Tuple[Tuple[float, float], ...] = (),
    exclude_km: float = 150.0,
    top_n: int = 50,
) -> pd.DataFrame:
    """
    Ranks global terrestrial grid tiles by Mahalanobis similarity to target space site.
    
    Parameters:
    -----------
    earth_df : DataFrame of terrestrial tiles containing FEATURES + lat, lon
    target_vec : dict mapping feature names to target measurement values
    weights : optional dict of feature weights (e.g. for rover vs astrobiology profiles)
    known_sites : list of (lat, lon) coordinates of well-known analog sites to exclude
    exclude_km : radius around known sites to exclude (to discover NEW analogs)
    top_n : number of top candidates to return
    """
    df = earth_df.dropna(subset=FEATURES).copy()
    if df.empty:
        raise ValueError("No valid Earth tiles available for feature calculation.")

    # 1. Standardize features against Earth's own distribution using RobustScaler
    scaler = RobustScaler().fit(df[FEATURES])
    X = scaler.transform(df[FEATURES])
    t = scaler.transform(pd.DataFrame([target_vec])[FEATURES])[0]

    # 2. Apply mission profile weights
    w = np.array([(weights or {}).get(f, 1.0) for f in FEATURES])
    X_w = X * w
    t_w = t * w

    # 3. Fit stable covariance matrix (Ledoit-Wolf shrinkage)
    cov = LedoitWolf().fit(X_w)

    # 4. Compute Mahalanobis squared distance d²
    diff = X_w - t_w + cov.location_
    d2 = cov.mahalanobis(diff)
    df["d2"] = d2

    # 5. Continuous bounded similarity score: 100 * exp(-0.5 * d² / n_features)
    df["similarity"] = 100.0 * np.exp(-0.5 * d2 / len(FEATURES))

    # 6. Explainability: identify worst-matching feature z-gap
    gap = pd.DataFrame(np.abs(X_w - t_w), columns=FEATURES, index=df.index)
    df["worst_feature"] = gap.idxmax(axis=1)

    # 7. Exclude already well-known analog sites (to look beyond famous sites)
    for k_lat, k_lon in known_sites:
        dist = haversine_km(df["lat"], df["lon"], k_lat, k_lon)
        df = df[dist > exclude_km]

    return df.sort_values("d2").head(top_n)


if __name__ == "__main__":
    print("ORBiALOG detection engine initialized.")
