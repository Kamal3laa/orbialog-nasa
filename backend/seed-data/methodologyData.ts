import { MethodologyStep } from './types';

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    stepNumber: 1,
    stageName: 'STAGE 01 — INGESTION',
    title: 'Multi-Mission Dataset Acquisition',
    description: 'Automated retrieval and cataloging of high-resolution terrestrial Earth observation assets and interplanetary orbital remote sensing telemetry from authorized NASA, USGS, and ESA repositories.',
    formula: 'D_{raw} = \\bigcup_{k=1}^{N} \\mathcal{A}_k \\left( \\mathbf{x}_{lon, lat}, \\mathbf{\\lambda}_{spectral}, t \\right)',
    formulaDesc: 'Union of multi-temporal, multi-spectral raw data cubes indexed across spatial coordinates and wavelength bands.',
    inputs: [
      'NASA Earthdata Cloud (ASTER GDEM v3, MODIS L3 Land Surface Temp)',
      'USGS EarthExplorer (Landsat 8/9 OLI-2, 3DEP LiDAR, SRTMGL1)',
      'NASA Planetary Data System (LRO LOLA DEM, MRO HiRISE 25cm, CRISM TRDR, MGS MOLA)',
      'ESA Planetary Science Archive & Copernicus Open Access (HRSC DTMs, Sentinel-1 SAR, Sentinel-2 MSI)'
    ],
    outputs: [
      'Orthorectified digital elevation models (DEMs)',
      'Atmospherically corrected surface reflectance cubes (0.4 – 2.5 µm)',
      'Diurnal thermal inertia radiance rasters'
    ],
    dataSources: ['NASA Earthdata', 'NASA PDS', 'USGS Astrogeology', 'ESA Copernicus'],
    standardConfidenceInterval: '99.4% georeference alignment within ±0.2 pixels'
  },
  {
    stepNumber: 2,
    stageName: 'STAGE 02 — PREPROCESSING',
    title: 'Radiometric Calibration & Spatial Co-Registration',
    description: 'Removal of terrestrial atmospheric Rayleigh scattering, aerosol absorption, and cloud masking on Earth imagery. Projection of lunar and Martian datasets into standardized orthographic cartographic reference frames.',
    formula: '\\rho_{BOA}(\\lambda) = \\frac{\\pi \\cdot (L_{TOA}(\\lambda) - L_{path}(\\lambda))}{\\tau_v(\\lambda) \\cdot [E_0(\\lambda) \\cdot \\cos(\\theta_s) \\cdot \\tau_s(\\lambda) + E_{down}(\\lambda)]}',
    formulaDesc: 'Bottom-Of-Atmosphere (BOA) surface reflectance derivation from Top-Of-Atmosphere (TOA) radiance accounting for path radiance and transmittance.',
    inputs: ['Raw radiance telemetry', 'Solar irradiance tables', 'Atmospheric optical depth profiles', 'SPICE orbital ephemerides'],
    outputs: ['Calibrated surface reflectance rasters', 'Topographically corrected hillshade matrices', 'Standardized UTM / Equirectangular grids'],
    dataSources: ['USGS Landsat Collection 2 Level-2', 'ESA Sen2Cor', 'NASA ISIS3 USGS Planetary Cartography Pipeline'],
    standardConfidenceInterval: 'RMSE < 0.35m vertical elevation agreement'
  },
  {
    stepNumber: 3,
    stageName: 'STAGE 03 — EXTRACTION',
    title: 'Biophysical & Geomorphic Feature Vector Extraction',
    description: 'Algorithmic extraction of quantitative terrain slope distributions, bidirectional surface roughness indices (Hurst exponent), mineral absorption band depths, and diurnal thermal inertia curves.',
    formula: '\\mathbf{F}_{terrain} = \\begin{bmatrix} \\nabla z_{slope} & R_q & \\Delta T_{diurnal} & I_{thermal} & \\sum d_{band}(\\lambda) \\end{bmatrix}^T',
    formulaDesc: 'Feature vector combining spatial gradient, root-mean-square roughness, diurnal thermal delta, thermal inertia, and spectral band depths.',
    inputs: ['Co-registered DEM rasters', 'Continuum-removed VNIR/SWIR spectra', 'Multi-temporal thermal infrared observations'],
    outputs: ['Slope probability density functions', 'Hurst roughness exponent maps', 'Mineral absorption identification vectors'],
    dataSources: ['USGS Astrogeology ISIS', 'CRISM Analysis Toolkit (CAT)', 'GDAL Geospatial Engine'],
    standardConfidenceInterval: 'Feature extraction precision ±1.2%'
  },
  {
    stepNumber: 4,
    stageName: 'STAGE 04 — NORMALIZATION',
    title: 'Cross-Planetary Feature Space Normalization',
    description: 'Scaling heterogeneous physical dimensions (e.g. Kelvin temperatures vs percent slope vs mineral band depths) into a bounded, dimensionless multidimensional metric space with rigorous uncertainty propagation.',
    formula: '\\tilde{f}_{i} = \\frac{f_i - \\mu_i}{\\sigma_i} \\cdot \\omega_{confidence} \\quad \\in [0, 1]',
    formulaDesc: 'Z-score standardization transformed into sigmoid bounded [0, 1] probability space modulated by observational confidence weighting.',
    inputs: ['Raw physical measurement matrices', 'Instrument calibration noise floors', 'Orbiter sensor resolution weighting factors'],
    outputs: ['Dimensionless normalized feature tensors', 'Covariance and uncertainty error matrices'],
    dataSources: ['NIST Physical Standards', 'CODATA Planetary Geodesy Constants'],
    standardConfidenceInterval: 'Error propagation variance σ² < 0.04'
  },
  {
    stepNumber: 5,
    stageName: 'STAGE 05 — SIMILARITY SCORING',
    title: 'Weighted Multi-Parametric Similarity Engine',
    description: 'Computation of cross-planetary analog correspondence using a hybrid formulation combining weighted inverse Mahalanobis distance with Cosine Spectral Angle Mapper (SAM) across six scientific feature domains.',
    formula: 'S(T, A) = 100 \\times \\left[ \\alpha \\cdot \\cos(\\mathbf{f}_T, \\mathbf{f}_A) + (1 - \\alpha) \\cdot \\exp\\left( -\\frac{1}{2} (\\mathbf{f}_T - \\mathbf{f}_A)^T \\mathbf{\\Sigma}^{-1} (\\mathbf{f}_T - \\mathbf{f}_A) \\right) \\right]',
    formulaDesc: 'Blended Cosine-Mahalanobis similarity metric penalizing covariance correlations while honoring spectral vector angles.',
    inputs: ['Normalized target vector f_T', 'Normalized terrestrial analog vector f_A', 'Feature covariance matrix Σ', 'Domain weight vector w'],
    outputs: ['Overall Analog Similarity Index (0 - 100%)', 'Per-domain sub-scores (Morphology, Roughness, Chemistry, Thermal, Volatiles)'],
    dataSources: ['ORBiALOG Analytical Core', 'PDS Geosciences Spectral Matching Algorithms'],
    standardConfidenceInterval: 'PLACEHOLDER — correlation against peer-reviewed studies pending real raster-computed metrics (see orbialog-real-data-plan)'
  },
  {
    stepNumber: 6,
    stageName: 'STAGE 06 — OPTIMIZATION',
    title: 'Pareto-Optimal Candidate Ranking',
    description: 'Multi-objective candidate ranking separating sites by specialized exploration requirements (e.g. rover terramechanics vs astrobiological biosignature preservation vs ISRU mineral mining).',
    formula: '\\mathcal{P}^* = \\left\\{ A \\in \\mathcal{D} \\;\\middle|\\; \\nexists A\' \\in \\mathcal{D} : \\forall j, s_j(A\') \\ge s_j(A) \\land \\exists k, s_k(A\') > s_k(A) \\right\\}',
    formulaDesc: 'Identification of non-dominated Pareto frontier candidates maximizing multi-domain mission readiness.',
    inputs: ['Global analog candidate pool', 'Mission priority weighting matrices', 'Logistical accessibility index'],
    outputs: ['Tier 1 Top-Ranked Candidates', 'Mission-specific suitability matrices', 'Logistical feasibility overlays'],
    dataSources: ['NASA Exploration Systems Development Directorate (ESDD)', 'ORBiALOG Multi-Criteria Decision Engine'],
    standardConfidenceInterval: 'Convergence reliability > 98.7%'
  },
  {
    stepNumber: 7,
    stageName: 'STAGE 07 — VALIDATION',
    title: 'Scientific Peer Review & Ground-Truthing',
    description: 'Ground-truthing computed scores against empirical in-situ field campaign data (e.g., AMASE, HMP, HI-SEAS, Egypt Western Desert surveys) and international peer-reviewed literature.',
    formula: 'V_{ground} = \\frac{1}{M} \\sum_{m=1}^{M} \\left| S_{computed}^{(m)} - S_{empirical}^{(m)} \\right| \\le \\epsilon_{tolerance}',
    formulaDesc: 'Empirical cross-validation mean absolute error bounded within strict scientific tolerance limits.',
    inputs: ['Field campaign spectrometer logs', 'Rock sample XRF laboratory assays', 'Rover wheel sinkage logs from analog trials'],
    outputs: ['Validated Analog Dossiers', 'Scientific Confidence Rating (0 - 100%)', 'Peer-reviewed dataset citations'],
    dataSources: ['NASA Technical Reports Server (NTRS)', 'Lunar and Planetary Science Conference (LPSC)', 'Astrobiology Journal'],
    standardConfidenceInterval: 'PLACEHOLDER — ground-truth campaign count pending real validation run (see orbialog-real-data-plan)'
  }
];

export const DATA_TIERS = [
  {
    tier: 'TIER 1 — EMPIRICAL REPOSITORIES',
    badge: 'GROUND TRUTH & FLIGHT SENSORS',
    color: '#64735D',
    description: 'Direct instrument telemetry from NASA PDS, USGS Astrogeology, and ESA Copernicus. Absolute calibration, physical units (meters, Kelvin, reflectance).',
    sources: ['LRO LOLA (GDR)', 'MRO HiRISE (25cm/px)', 'Landsat 9 OLI-2', 'Sentinel-2 MSI Level-2A', 'SRTM 30m DEM']
  },
  {
    tier: 'TIER 2 — ALGORITHMIC CALCULATIONS',
    badge: 'COMPUTED SIMILARITY TENSORS',
    color: '#B75B3D',
    description: 'Derived multi-parametric feature vectors generated via Mahalanobis distance, Hurst surface roughness, and continuum-removed band depth spectral matching.',
    sources: ['Terrain slope variance', 'Diurnal thermal delta', 'Mahalanobis similarity score', 'Pareto rank frontier']
  },
  {
    tier: 'TIER 3 — SIMULATION BOUNDS',
    badge: 'MISSION PLANNING ESTIMATES',
    color: '#A8AAA6',
    description: 'Demonstration values and simulated mission parameter models (e.g. simulated communications latency, pressurized spacesuit metabolic rates, rover slip limits).',
    sources: ['Lunar 1/6g offload models', '20-min Mars comm latency simulators', 'ISRU carbothermal yield forecasts']
  }
];

