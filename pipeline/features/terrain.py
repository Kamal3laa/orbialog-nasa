"""
Shared terrain feature calculation for Earth, Moon, and Mars.
Scale matching: DEM is assumed to be resampled to ~100m resolution
so slopes and roughness RMS can be compared apples-to-apples.
"""

from typing import Dict, Any
from datetime import datetime, timezone
import numpy as np
from scipy.ndimage import uniform_filter


def slope_roughness(
    dem: np.ndarray,
    pixel_m: float = 100.0,
    dataset_name: str = "SRTMGL1_003",
    version: str = "v003",
) -> Dict[str, Any]:
    """
    Computes slope and roughness metrics on a digital elevation model (meters).
    
    Parameters:
    -----------
    dem : 2D numpy array of elevation values in meters (no-data converted to NaN)
    pixel_m : grid pixel spacing in meters (standardized to ~100.0 m)
    dataset_name : provenance dataset identifier (e.g. SRTMGL1_003, LOLA, MOLA)
    version : dataset version
    
    Returns:
    --------
    dict with slope_mean, slope_p90, roughness_rms, relief_m and provenance metadata.
    """
    # 1. Gradient and slope in degrees
    gy, gx = np.gradient(dem, pixel_m)
    slope = np.degrees(np.arctan(np.hypot(gx, gy)))

    # 2. Roughness: RMS of height residuals after removing 3x3 local mean
    resid = dem - uniform_filter(dem, size=3)

    return {
        "slope_mean": float(np.nanmean(slope)),
        "slope_p90": float(np.nanpercentile(slope, 90)),
        "roughness_rms": float(np.sqrt(np.nanmean(resid ** 2))),
        "relief_m": float(np.nanmax(dem) - np.nanmin(dem)),
        "scale_m": pixel_m,
        "source": "computed",
        "provenance": {
            "dataset": dataset_name,
            "version": version,
            "computedAt": datetime.now(timezone.utc).isoformat(),
        },
    }
