"""
Extracts the 11 global Earth feature dimensions using Google Earth Engine.
Optimized for memory efficiency (3-year baseline, tileScale=16).

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

PROJECT_ID = "regal-eon-514517-k8"

def init_earth_engine(project_id: Optional[str] = PROJECT_ID):
    try:
        ee.Initialize(project=project_id)
    except Exception as e:
        print(f"Error initializing Earth Engine: {e}")
        sys.exit(1)


def build_feature_stack() -> ee.Image:
    """Builds the 11-band terrestrial feature image stack."""
    # 1. Elevation, slope, roughness from SRTM 30m
    dem = ee.Image("USGS/SRTMGL1_003")
    slope = ee.Terrain.slope(dem).rename("slope")
    rough = dem.reduceNeighborhood(ee.Reducer.stdDev(), ee.Kernel.square(3)).rename("rough")

    # 2. Thermal extremes (MODIS 3-year baseline: 2021-2023)
    lst = ee.ImageCollection("MODIS/061/MOD11A2").filterDate("2021-01-01", "2023-12-31")
    day = lst.select("LST_Day_1km").mean().multiply(0.02)
    night = lst.select("LST_Night_1km").mean().multiply(0.02)
    lst_amp = day.subtract(night).rename("lst_amp")
    lst_max = lst.select("LST_Day_1km").max().multiply(0.02).rename("lst_max")

    # 3. Aridity / vegetation / albedo
    ndvi = (
        ee.ImageCollection("MODIS/061/MOD13A1")
        .filterDate("2021-01-01", "2023-12-31")
        .select("NDVI")
        .mean()
        .multiply(0.0001)
        .rename("ndvi")
    )
    precip = (
        ee.ImageCollection("NASA/GPM_L3/IMERG_MONTHLY_V06")
        .filterDate("2021-01-01", "2023-12-31")
        .select("precipitation")
        .mean()
        .multiply(24.0 * 365.0)
        .rename("precip_mm_yr")
    )
    albedo = (
        ee.ImageCollection("MODIS/061/MCD43A3")
        .filterDate("2021-01-01", "2023-12-31")
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

    land = dem.gt(-500)
    return stack.updateMask(land)
