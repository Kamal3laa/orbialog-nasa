"""
Earth Engine Batch Export using Latitude Bands.
As recommended in the plan, splitting into latitude bands prevents
large client-side payload timeouts and ensures fast Google Cloud scheduling:
- band_arid_north: 0° to 35° N (Sahara, Sinai, Arabia, Dasht-e Lut, India)
- band_arid_south: -35° to 0° S (Atacama, Namibia, Kalahari, Australia)
- band_temp_north: 35° to 60° N (Gobi, Mojave, Great Basin, Iceland, Svalbard)
- band_temp_south: -60° to -35° S (Patagonia)
"""

import sys
import ee
from ee_features import build_feature_stack

PROJECT_ID = "regal-eon-514517-k8"

LAT_BANDS = [
    {"name": "arid_north", "lat_min": 0, "lat_max": 35, "desc": "Sahara, Sinai, Arabia, Iran, Mojave"},
    {"name": "arid_south", "lat_min": -35, "lat_max": 0, "desc": "Atacama, Australia, Namibia"},
    {"name": "temp_north", "lat_min": 35, "lat_max": 60, "desc": "Gobi, Iceland, Central Asia"},
    {"name": "temp_south", "lat_min": -60, "lat_max": -35, "desc": "Patagonia, Southern Andes"},
]

def make_band_grid(lat_min: int, lat_max: int, step: float = 1.0):
    features = []
    lat = lat_min
    while lat < lat_max:
        lon = -180.0
        while lon < 180.0:
            rect = ee.Geometry.Rectangle([lon, lat, lon + step, lat + step], None, False)
            features.append(ee.Feature(rect, {"lat": lat + step / 2.0, "lon": lon + step / 2.0}))
            lon += step
        lat += step
    return ee.FeatureCollection(features)

def export_band(band_name: str = "arid_north", project_id: str = PROJECT_ID, step: float = 1.0):
    ee.Initialize(project=project_id)
    band_info = next((b for b in LAT_BANDS if b["name"] == band_name), None)
    if not band_info:
        print(f"Unknown band: {band_name}. Available: {[b['name'] for b in LAT_BANDS]}")
        sys.exit(1)

    print(f"--- Exporting Band: {band_info['name']} ({band_info['lat_min']}° to {band_info['lat_max']}°) ---")
    print(f"Coverage: {band_info['desc']}")
    
    stack = build_feature_stack()
    tiles = make_band_grid(band_info["lat_min"], band_info["lat_max"], step=step)
    
    out = stack.reduceRegions(collection=tiles, reducer=ee.Reducer.mean(), scale=1000, tileScale=4)
    
    task_desc = f"earth_tiles_1deg_{band_info['name']}"
    task = ee.batch.Export.table.toDrive(
        collection=out,
        description=task_desc,
        fileNamePrefix=task_desc,
        fileFormat="CSV",
    )
    task.start()
    print("=" * 60)
    print(f"Task '{task_desc}' STARTED!")
    print(f"Task ID: {task.id}")
    print("Monitor progress at: https://code.earthengine.google.com/tasks")
    print("=" * 60)
    return task.id

if __name__ == "__main__":
    band = sys.argv[1] if len(sys.argv) > 1 else "arid_north"
    pid = sys.argv[2] if len(sys.argv) > 2 else PROJECT_ID
    export_band(band, pid)
