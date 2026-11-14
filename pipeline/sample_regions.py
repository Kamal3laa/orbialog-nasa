"""
Online feature extraction for validation regions (Atacama & Egypt)
Runs directly via Earth Engine compute service to verify the 11 feature calculations
before running the global 1° grid export.
"""

import ee
import json
import pandas as pd

PROJECT_ID = "regal-eon-514517-k8"

# Test sites: Atacama Desert core & Egypt Western Desert
VALIDATION_SITES = [
    {"id": "atacama-yungay", "name": "Atacama Yungay Core", "lat": -24.0667, "lon": -70.0167, "type": "hyper-arid-mars"},
    {"id": "egypt-white-desert", "name": "White Desert Egypt", "lat": 27.2883, "lon": 28.1633, "type": "aeolian-mars"},
    {"id": "mcmurdo-dry-valleys", "name": "McMurdo Dry Valleys", "lat": -77.4667, "lon": 162.5333, "type": "polar-lunar"},
]

def build_feature_stack():
    # 1. Elevation, slope, roughness
    dem = ee.Image("USGS/SRTMGL1_003")
    slope = ee.Terrain.slope(dem).rename("slope")
    rough = dem.reduceNeighborhood(ee.Reducer.stdDev(), ee.Kernel.square(3)).rename("rough")

    # 2. Thermal extremes (MODIS 2015-2024)
    lst = ee.ImageCollection("MODIS/061/MOD11A2").filterDate("2015-01-01", "2024-12-31")
    day = lst.select("LST_Day_1km").mean().multiply(0.02)
    night = lst.select("LST_Night_1km").mean().multiply(0.02)
    lst_amp = day.subtract(night).rename("lst_amp")
    lst_max = lst.select("LST_Day_1km").max().multiply(0.02).rename("lst_max")

    # 3. Aridity / vegetation / albedo
    ndvi = (
        ee.ImageCollection("MODIS/061/MOD13A1")
        .filterDate("2015-01-01", "2024-12-31")
        .select("NDVI")
        .mean()
        .multiply(0.0001)
        .rename("ndvi")
    )
    precip = (
        ee.ImageCollection("NASA/GPM_L3/IMERG_MONTHLY_V06")
        .select("precipitation")
        .mean()
        .multiply(24.0 * 365.0)
        .rename("precip_mm_yr")
    )
    albedo = (
        ee.ImageCollection("MODIS/061/MCD43A3")
        .select("Albedo_WSA_shortwave")
        .mean()
        .multiply(0.001)
        .rename("albedo")
    )

    # 4. Mineralogy indices from ASTER GED
    ged = ee.Image("NASA/ASTER_GED/AG100_003").multiply(0.001)
    b = lambda n: ged.select(f"emissivity_band{n}")
    mafic = b(12).divide(b(13)).rename("mafic_idx")
    carbonate = b(13).divide(b(14)).rename("carbonate_idx")
    quartz = b(11).multiply(b(11)).divide(b(10).multiply(b(12))).rename("quartz_idx")

    return ee.Image.cat([
        slope,
        rough,
        lst_amp,
        lst_max,
        ndvi,
        precip,
        albedo,
        mafic,
        carbonate,
        quartz,
    ])

def sample_site(stack, site, buffer_m=5000):
    point = ee.Geometry.Point([site["lon"], site["lat"]])
    region = point.buffer(buffer_m)
    
    # Calculate mean over region
    mean_stats = stack.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=100,
        maxPixels=1e7
    )
    # Calculate 90th percentile slope
    slope_p90 = ee.Terrain.slope(ee.Image("USGS/SRTMGL1_003")).reduceRegion(
        reducer=ee.Reducer.percentile([90]),
        geometry=region,
        scale=100,
        maxPixels=1e7
    )
    
    vals = mean_stats.getInfo()
    p90_val = slope_p90.getInfo().get("slope", None)
    vals["p90"] = p90_val
    vals["site_id"] = site["id"]
    vals["site_name"] = site["name"]
    vals["lat"] = site["lat"]
    vals["lon"] = site["lon"]
    return vals

if __name__ == "__main__":
    ee.Initialize(project=PROJECT_ID)
    stack = build_feature_stack()
    print("Testing Earth Engine extraction over validation sites...")
    results = []
    for site in VALIDATION_SITES:
        print(f"Sampling {site['name']} ({site['lat']}, {site['lon']})...")
        try:
            res = sample_site(stack, site)
            results.append(res)
            print("OK:", {k: round(v, 4) if isinstance(v, float) else v for k, v in res.items()})
        except Exception as e:
            print(f"Error sampling {site['name']}: {e}")

    df = pd.DataFrame(results)
    print("\nValidation Summary Table:")
    print(df[["site_id", "slope", "rough", "lst_amp", "lst_max", "ndvi", "precip_mm_yr", "albedo", "mafic_idx", "carbonate_idx", "quartz_idx"]])
