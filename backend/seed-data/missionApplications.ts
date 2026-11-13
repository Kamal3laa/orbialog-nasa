import { MissionApplicationDomain } from './types';

export const MISSION_APPLICATION_DOMAINS: MissionApplicationDomain[] = [
  {
    id: 'rover-mobility',
    title: 'Rover Mobility & Terramechanics',
    subtitle: 'Wheel-Soil Interaction, Sinkage, & Slope Traverse',
    code: 'OPS-TERRA-01',
    iconName: 'Navigation',
    description: 'Empirical qualification of rover locomotion systems, rocker-bogie kinematics, wheel grousers, and torque-slip dynamics across realistic planetary regolith physical simulants.',
    analogRequirements: [
      'Loose fine particulate regolith (< 50 µm grain size) with high internal friction angle',
      'Variable terrain slopes between 15° and 35° with loose scree and gravel',
      'Deflation corridors and wind-packed yardangs testing obstacle clearance'
    ],
    feasibleTests: [
      'Gimbal angle and rocker-bogie pitch/roll deflection over boulder fields',
      'Wheel sinkage depth vs rotational slip ratio measurements (Bekan-Wong terramechanics models)',
      'High-centering avoidance over perched rocks and duricrust shelf edges',
      'Motor current draw and power budget profiling on steep incline ascents'
    ],
    unfeasibleFactors: [
      'Terrestrial 1.0 g gravity alters normal contact force; requires active gravity-offload crane gantry to simulate 0.166 g (Moon) or 0.379 g (Mars)',
      'Atmospheric moisture induces grain cohesion absent in lunar ultra-high vacuum',
      'Aerodynamic drag from ambient air dampens wheel particulate ejecta'
    ],
    recommendedLocations: ['egypt-white-desert', 'egypt-qattara-depression', 'atacama-yungay', 'hawaii-maunakea'],
    fieldInstrumentation: [
      'Six-axis wheel force/torque load cells',
      'Real-time kinematic (RTK) differential GPS rover tracking (< 2 cm accuracy)',
      'High-speed tracking cameras for wheel-soil soil displacement kinematics',
      'Dynamic penetrometer soil shear-strength profiler'
    ],
    validationMetrics: [
      'Drawbar pull to weight ratio (DP/W)',
      'Specific slippage index: s = (rω - v) / rω',
      'Mean free path without operator intervention (m/sol)',
      'Wheel rim structural deformation and grouser abrasion rate'
    ]
  },
  {
    id: 'autonomous-navigation',
    title: 'Autonomous Robotic Navigation & Hazard Avoidance',
    subtitle: 'Stereo Vision, LiDAR SLAM, & Optical Path Planning',
    code: 'OPS-NAV-02',
    iconName: 'Compass',
    description: 'Benchmarking autonomous onboard perception algorithms, dense 3D visual odometry, LiDAR Simultaneous Localization and Mapping (SLAM), and real-time hazard detection in feature-sparse and high-glare environments.',
    analogRequirements: [
      'Extreme albedo surfaces (blinding white chalk or dark basalt) challenging camera dynamic range',
      'Repetitive, self-similar terrain patterns stressing feature matching algorithms',
      'Sharp shadows mimicking low-sun-angle lunar polar lighting'
    ],
    feasibleTests: [
      'Real-time stereo disparity mapping under harsh direct sunlight and cast shadows',
      'Visual odometry slip detection by cross-referencing wheel ticks with feature drift',
      'Geometric hazard classification (identifying negative obstacles like sinkholes, drop-offs, and soft dust pits)',
      'End-to-end autonomous navigation throughput (metres traversed per compute cycle)'
    ],
    unfeasibleFactors: [
      'Absence of cosmic ray single-event upsets (SEU) on FPGA/GPU avionics in Earth magnetosphere',
      'Atmospheric light scattering (blue Rayleigh glow) reduces optical contrast compared to harsh black-sky lunar contrast',
      'Earth magnetic field allows compass usage; planetary navigation must rely strictly on celestial sun-sensors and inertial IMUs'
    ],
    recommendedLocations: ['egypt-white-desert', 'egypt-sinai-granite', 'tabernas-spain', 'devon-island'],
    fieldInstrumentation: [
      'Multi-baseline stereo camera test rigs (emulating Mastcam-Z & Navcam)',
      'Pulsed 3D LiDAR scanners (1550 nm eye-safe)',
      'Space-grade RAD750 / Snapdragon Flight FPGA development boards',
      'Ground-truth optical total stations for absolute pose verification'
    ],
    validationMetrics: [
      'Localization drift rate (% of distance traversed)',
      'False-positive hazard classification rate (< 1.5%)',
      'Autonomous path re-planning latency (< 450 ms)',
      'Stereo disparity completeness in shadowed craters (> 88%)'
    ]
  },
  {
    id: 'landing-systems',
    title: 'Landing System Testing & Terrain-Relative Navigation',
    subtitle: 'Lander Descent Imaging, Hazard Detection, & Retro-Plume Soil Blast',
    code: 'OPS-LAND-03',
    iconName: 'Target',
    description: 'Flight testing autonomous Terrain-Relative Navigation (TRN) algorithms, landing radar altimetry, and descent rocket plume impingement on loose regolith.',
    analogRequirements: [
      'Extensive cratered and faulted topography mapped to sub-meter orbiter DEMs',
      'Wide-open airspace suitable for tethered rocket or helicopter drop tests',
      'Cohesive surface crusts over loose sand beds testing blast cratering'
    ],
    feasibleTests: [
      'Real-time optical TRN matching descent camera imagery against pre-stored orbital basemaps',
      'Lander footpad impact attenuation and soil penetration depth measurements',
      'Supersonic retro-propulsion gas plume scouring and cratering mechanics',
      'Lander autonomous re-targeting to divert away from detected boulder hazards'
    ],
    unfeasibleFactors: [
      'Atmospheric backpressure modifies rocket plume expansion compared to Mars 6 mbar and Lunar vacuum',
      'Aerodynamic parachute deceleration physics scale differently with Earth atmospheric density',
      'Higher gravitational acceleration requires scaled thrust-to-weight engine throttle profiles'
    ],
    recommendedLocations: ['egypt-qattara-depression', 'egypt-white-desert', 'devon-island', 'hawaii-maunakea'],
    fieldInstrumentation: [
      'Helicopter and heavy-lift hexacopter descent simulator gantry rigs',
      'Doppler LiDAR velocimeters & high-frequency radar altimeters',
      'Ground-mounted high-speed schlieren cameras for plume gas dynamics',
      'Soil pressure sensors arrayed beneath touchdown zones'
    ],
    validationMetrics: [
      'TRN position fix error at 2,000 m altitude (< 10 m 3-sigma)',
      'Time-to-divert computation window (< 1.8 s)',
      'Footpad maximum deceleration shock (< 12 g)',
      'Plume-ejected regolith kinetic velocity and sensor abrasion risk'
    ]
  },
  {
    id: 'geological-research',
    title: 'Geological Field Sampling & Deep Core Drilling',
    subtitle: 'Astrobiology Protocols, Core Retention, & Spectral Mapping',
    code: 'OPS-GEO-04',
    iconName: 'Layers',
    description: 'Field qualification of automated coring drills, pristine sample tube hermetic sealing, Raman and X-ray fluorescence (XRF) contact spectrometer science operations.',
    analogRequirements: [
      'Extremely well-documented rock lithologies with certified petrographic thin-sections',
      'Preserved ancient biosignatures, stromatolites, or endolithic micro-communities',
      'High-hardness igneous rocks (> 150 MPa) and friable sedimentary mudstones'
    ],
    feasibleTests: [
      'Percussive rotary drill bit wear and diamond teeth chipping rates',
      'Sample core breakage, retention percentage, and intact stratigraphy preservation',
      'In-situ contact spectrometer scanning (emulating PIXL, SHERLOC, and SuperCam)',
      'Anti-cross-contamination protocols during sample tube hermetic swaging'
    ],
    unfeasibleFactors: [
      'Terrestrial ambient organic contamination (dust, pollen, human skin scales) mandates ultra-clean room barriers absent in raw field air',
      'Drilling fluids or ambient air cooling artificially prolongs bit life unless strictly run dry',
      'Earth atmospheric moisture prevents observing vacuum-induced volatile flash-boiling from cores'
    ],
    recommendedLocations: ['western-australia-pilbara', 'svalbard-spitsbergen', 'egypt-sinai-granite', 'atacama-yungay'],
    fieldInstrumentation: [
      'Dry rotary-percussive core drill prototypes (2.5 cm diameter, 10 cm length)',
      'Handheld Raman and NIR spectrometers (532 nm / 785 nm laser excitation)',
      'Field portable X-ray diffraction (XRD) mineralogy analyzer (CheMin equivalent)',
      'Ultrasonically cleaned hermetic sample caching tubes'
    ],
    validationMetrics: [
      'Intact core sample recovery length ratio (> 90%)',
      'Particulate cross-contamination between successive drill holes (< 0.1 wt%)',
      'Mineralogical phase identification accuracy vs laboratory XRD standards (> 98%)',
      'Drill bit thermal heat generation (< 65 °C to protect delicate volatile organics)'
    ]
  },
  {
    id: 'astronaut-training',
    title: 'Astronaut EVA Operations & Biometrics Telemetry',
    subtitle: 'Pressurized Suit Ergonomics, Habitat Ingress, & Field Geology',
    code: 'OPS-EVA-05',
    iconName: 'UserCheck',
    description: 'Simulation of human extravehicular activities (EVA), suit mobility constraints, fatigue monitoring, geological exploration workflows, and communications latency protocols with simulated Mission Control.',
    analogRequirements: [
      'Rugged, expansive terrain isolated from modern human infrastructure',
      'Extreme thermal stress replicating lunar daylight and cold shadow transitions',
      'Complex topography requiring tactical traverse route selection and navigation'
    ],
    feasibleTests: [
      'Metabolic rate, CO₂ scrub rate, and hydration consumption during 6-hour simulated EVAs',
      'Glove dexterity, rock tool manipulation, and field specimen cataloging workflows',
      'Communication protocols with simulated 5 to 20-minute Mars time-delay relays',
      'Emergency astronaut carry and medical rescue egress procedures across boulder fields'
    ],
    unfeasibleFactors: [
      'Suit weight: full pressurized spacesuits on Earth impose full 1.0 g fatigue, unlike 1/6 g lunar suit weight',
      'Absolute vacuum pressure seal cannot be tested safely in open field environments',
      'Cosmic ray shielding and space solar radiation cannot be replicated on Earth surface'
    ],
    recommendedLocations: ['hawaii-maunakea', 'devon-island', 'egypt-white-desert', 'egypt-sinai-granite'],
    fieldInstrumentation: [
      'Pressurized analog spacesuit simulators (e.g. NDX-1, AATC, or Aouda.X class)',
      'Continuous biometric monitoring vests (ECG, core body temperature, SpO₂)',
      'Head-up display (HUD) digital geological checklists and nav telemetry',
      'Time-delayed audio/video communications relay node'
    ],
    validationMetrics: [
      'Average metabolic expenditure rate (< 320 kcal/hour during standard traverse)',
      'Geological sample collection efficiency (samples cataloged per EVA hour)',
      'Navigation error rate under simulated suit visor glare and helmet restrictions',
      'Airlock egress/ingress cycle duration and seal verification integrity'
    ]
  },
  {
    id: 'isru-resource-exploration',
    title: 'In-Situ Resource Utilization (ISRU) & Volatiles Extraction',
    subtitle: 'Regolith Sintering, Water Ice Extraction, & Oxygen Production',
    code: 'OPS-ISRU-06',
    iconName: 'Cpu',
    description: 'Experimental testing of field reactors designed to extract life-support consumables, rocket propellants, and structural building elements directly from native terrestrial analog soils.',
    analogRequirements: [
      'High-titanium basalt deposits with native ilmenite (FeTiO₃) for carbothermal reduction',
      'Subsurface permafrost or hydrated sulfate salts (gypsum, kieserite) for thermal dehydratization',
      'Calcareous/siliceous powders suitable for microwave or solar concentrator sintering'
    ],
    feasibleTests: [
      'Microwave and concentrated solar thermal sintering of native regolith for dust-free landing pads',
      'Thermal extraction of structural crystal water from native sulfate minerals (T > 250 °C)',
      'Hydrogen reduction of ilmenite-rich basalt sands to produce water and metallic iron',
      'Dust filtration and particulate separation in fluid fluidized beds'
    ],
    unfeasibleFactors: [
      'Earth ambient air contains 21% O₂ and 78% N₂; requires closed chamber purged with CO₂ or vacuum to replicate planetary atmospheres',
      'Atmospheric humidity pre-saturates soils, requiring high pre-drying energy invalidating raw ISRU energy models',
      'Reduced gravity impacts particulate fluidization and heat convection in reactor beds'
    ],
    recommendedLocations: ['hawaii-maunakea', 'egypt-qattara-depression', 'devon-island', 'svalbard-spitsbergen'],
    fieldInstrumentation: [
      'Mobile concentrated solar Fresnel concentrator furnace (> 1,100 °C)',
      'Microwave sintering horn (2.45 GHz, 3 kW RF generator)',
      'Closed-loop gas chromatograph and mass spectrometer (GC-MS)',
      'Continuous mass loss balance for volatilization kinetics'
    ],
    validationMetrics: [
      'Yield efficiency: grams of O₂ or H₂O extracted per kilogram of processed ore',
      'Specific energy requirement (kWh per kg product)',
      'Sintered regolith compressive strength (> 25 MPa for landing pad tiles)',
      'Filter clogging lifespan under continuous sub-micron dust loading'
    ]
  },
  {
    id: 'habitat-technology',
    title: 'Habitat Technology & Subterranean Shielding',
    subtitle: 'Lava Tube Utilization, Inflatable Structures, & Dust Exclusion',
    code: 'OPS-HAB-07',
    iconName: 'Shield',
    description: 'Deployment validation of semi-autonomous inflatable habitat modules, environmental control and life support systems (ECLSS), airlock dust mitigation seals, and subterranean cavern structural integrity.',
    analogRequirements: [
      'Spacious intact lava tubes or deep natural canyon caves isolated from ambient weather',
      'Fine airborne mineral dust testing exterior filtration and airlock cascade pumps',
      'Extreme diurnal temperature swings testing building envelope insulation'
    ],
    feasibleTests: [
      'Rapid deployment and pressurization sequence of flexible Kevlar/vectran inflatable shells',
      'Multi-stage airlock dust removal protocols (electrostatic showers and sticky mats)',
      'Environmental sensor networks (CO₂, particulate, acoustics, thermal profiling)',
      'Subterranean structural cave stability monitoring with ultrasonic crack sensors'
    ],
    unfeasibleFactors: [
      'External atmospheric pressure supports inflatable structure walls without needing 101 kPa differential pressure resistance',
      'Galactic cosmic radiation (GCR) and solar particle events (SPE) cannot be tested in terrestrial caves due to Earth magnetosphere',
      'Micro-meteorite bombardment protection cannot be physically qualified on surface'
    ],
    recommendedLocations: ['hawaii-maunakea', 'egypt-white-desert', 'egypt-sinai-granite'],
    fieldInstrumentation: [
      'Scalable inflatable habitat dome modules (6m to 12m diameter)',
      'Optical particle counters (0.3 to 10 µm dust concentration logging)',
      'Thermal imaging infrared cameras for insulation leak detection',
      'Acoustic emission structural health monitoring transducers'
    ],
    validationMetrics: [
      'Deployment time from packed transport container to habitable status (< 4 hours)',
      'Dust penetration into living quarters (< 0.05 mg/m³ particulate count)',
      'Thermal transfer U-value of multi-layer insulation envelope (< 0.15 W/m²K)',
      'Acoustic reverberation and human habitability index rating'
    ]
  }
];

