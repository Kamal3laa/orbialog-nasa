"""
Memory-efficient Earth Engine batch export.
Uses point grid sampling at 5km scale with tileScale=16.
Prevents Earth Engine Out of Memory (Error code: 8).
"""

import sys
import ee
from ee_features import build_feature_stack

PROJECT_ID = "regal-eon-514517-k8"

LAT_BANDS = [
    {"name": "arid_north_1", "lat_min": 0, "lat_max": 18, "desc": "Sahel, Southern Arabia, Central America, India"},
    {"name": "arid_north_2", "lat_min": 18, "lat_max": 35, "desc": "Sahara, Sinai, Northern Arabia, Dasht-e Lut, Mojave"},
    {"name": "arid_south_1", "lat_min": -18, "lat_max": 0, "desc": "Central Africa, Amazon Basin, Northern Australia"},
    {"name": "arid_south_2", "lat_min": -35, "lat_max": -18, "desc": "Atacama, Kalahari, Namib, Central/Western Australia"},
]

def make_point_grid(lat_min: int, lat_max: int, step: float = 1.0):
    features = []
    lat = lat_min
    while lat < lat_max:
        lon = -180.0
        while lon < 180.0:
            center_lat = lat + step / 2.0
            center_lon = lon + step / 2.0
            pt = ee.Geometry.Point([center_lon, center_lat])
            features.append(ee.Feature(pt, {"lat": center_lat, "lon": center_lon}))
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
    pts = make_point_grid(band_info["lat_min"], band_info["lat_max"], step=step)
    
    # Use sampleRegions with 5000m scale and tileScale=16 (prevents Out of Memory)
    sampled = stack.sampleRegions(
        collection=pts,
        scale=5000,
        tileScale=16,
        geometries=False
    )
    
    task_desc = f"earth_tiles_1deg_{band_info['name']}"
    task = ee.batch.Export.table.toDrive(
        collection=sampled,
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
