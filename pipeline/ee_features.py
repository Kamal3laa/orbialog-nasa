"""
Extracts the 11 global Earth feature dimensions using Google Earth Engine.
Features:
- Slope, slope_p90, roughness (USGS/SRTMGL1_003)
- LST diurnal amplitude and maximum (MODIS/061/MOD11A2)
- NDVI (MODIS/061/MOD13A1)
- Precipitation (NASA/GPM_L3/IMERG_MONTHLY_V06)
- Shortwave Albedo (MODIS/061/MCD43A3)
- Mineral composition proxies: mafic, carbonate, quartz (NASA/ASTER_GED/AG100_003)
"""

import sys
from typing import Optional
import ee

FEATURES_EXPORT = [
    "lat",
    "lon",
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


def init_earth_engine(project_id: Optional[str] = None):
    """Initializes Earth Engine client."""
    try:
        if project_id:
            ee.Initialize(project=project_id)
        else:
            ee.Initialize()
        print("Google Earth Engine initialized successfully.")
    except Exception as e:
        print(f"Error initializing Earth Engine: {e}")
        print("Please ensure you have run `earthengine authenticate` or provided a valid GCP project ID.")
        sys.exit(1)


def build_feature_stack() -> ee.Image:
    """Builds the 11-band terrestrial feature image stack."""
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

    stack = ee.Image.cat([
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

    # Mask ocean (keep areas with elevation > -500 to preserve depressions like Qattara/Dead Sea)
    land = dem.gt(-500)
    return stack.updateMask(land)


def grid_collection(step: float = 1.0, lat_min: float = -60, lat_max: float = 60) -> ee.FeatureCollection:
    """Generates a grid of bounding boxes with center lat/lon metadata."""
    features = []
    lat = lat_min
    while lat < lat_max:
        lon = -180.0
        while lon < 180.0:
            rect = ee.Geometry.Rectangle([lon, lat, lon + step, lat + step])
            features.append(ee.Feature(rect, {"lat": lat + step / 2.0, "lon": lon + step / 2.0}))
            lon += step
        lat += step
    return ee.FeatureCollection(features)


def start_export(
    project_id: str,
    description: str = "earth_tiles_1deg",
    step: float = 1.0,
    lat_min: float = -60,
    lat_max: float = 60,
):
    """Executes the export to Google Drive or Cloud Storage."""
    init_earth_engine(project_id)
    stack = build_feature_stack()
    tiles = grid_collection(step=step, lat_min=lat_min, lat_max=lat_max)

    out = stack.reduceRegions(collection=tiles, reducer=ee.Reducer.mean(), scale=1000, tileScale=4)

    task = ee.batch.Export.table.toDrive(
        collection=out,
        description=description,
        fileFormat="CSV",
    )
    task.start()
    print(f"Task '{description}' started. Monitor progress at: https://code.earthengine.google.com/tasks")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        start_export(project_id=sys.argv[1])
    else:
        print("Usage: python ee_features.py <GCP_PROJECT_ID>")
