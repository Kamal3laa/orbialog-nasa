import { TestingDiscipline } from '../types';

export const TESTING_DISCIPLINES: TestingDiscipline[] = [
  {
    id: 'rover-mobility',
    title: 'Rover Mobility & Wheel Traction Mechanics',
    code: 'TEST-DISC-01',
    description:
      'Verification of ground robotic mobility, passive rocker-bogie suspensions, wheel-grousers interaction with loose regolith, slip-ratio monitoring, and obstacle negotiation.',
    earthReplicableScope: [
      'Slope climbing angles and sinkage depth in loose fine-grained sand/chalk dust',
      'Wheel tread abrasive wear and gouging against sharp basalt ventifacts',
      'Torque management and autonomous recovery from high-slip conditions (>60% slip)',
      'Tipping angles and center-of-gravity dynamics on 30° boulder fields',
    ],
    planetaryLimitations: [
      'Gravity difference: 1.0 g on Earth vs 0.166 g (Moon) and 0.38 g (Mars). On Earth, normal force is 2.6x to 6x higher, which alters tire contact patch pressure and shearing resistance.',
      'Electrostatic cling of micro-abrasive dust in hard vacuum cannot be reproduced under atmospheric humidity without specialized vacuum chambers.',
    ],
    suggestedSites: ['white-desert-egypt', 'sinai-peninsula-egypt', 'qattara-depression-egypt', 'atacama-desert'],
    keyInstruments: ['Six-Wheel Rocker-Bogie Test Rig', 'Torque/Load Telemetry Hub', 'Dynamic Inclinometer Array'],
    primaryRiskFactors: ['Wheel entrapment in soft duricrust', 'Actuator stall on steep scree', 'Rim puncture on volcanic ventifacts'],
  },

  {
    id: 'autonomous-navigation',
    title: 'Autonomous Navigation & Visual Odometry',
    code: 'TEST-DISC-02',
    description:
      'Benchmarking onboard stereo-vision, flash LiDAR SLAM, terrain relative navigation (TRN), and hazard detection algorithms without satellite GPS.',
    earthReplicableScope: [
      'Visual odometry feature tracking over low-contrast, feature-poor white yardangs or dark basalts',
      'Autonomous path planning around hazardous drop-offs, crevices, and non-traversable boulders',
      'Shadow-slip avoidance under changing low-angle solar illumination',
      'Lost-in-space relocalization using horizon landmark recognition',
    ],
    planetaryLimitations: [
      'Earth has atmospheric diffuse sky scattering (blue skylight), whereas on the Moon shadows are jet-black and optical contrast is harsh and extreme.',
      'GPS and cellular RF must be deliberately blocked or ignored in testing software.',
    ],
    suggestedSites: ['white-desert-egypt', 'devon-island', 'lanzarote-geopark', 'atacama-desert'],
    keyInstruments: ['Dual Stereo Navcams', 'Solid-State LiDAR SLAM Scanner', 'Visual Odometry GPU Compute Node'],
    primaryRiskFactors: ['Optical blinding from high-albedo chalk', 'Shadow ambiguity falsely tagged as cliff drop', 'LiDAR point-cloud saturation in dust devils'],
  },

  {
    id: 'geological-training',
    title: 'Planetary Field Geology & Sample Caching',
    code: 'TEST-DISC-03',
    description:
      'Training astronaut crews and remote robotic science teams to identify high-priority geological contacts, collect hermetically sealed cores, and interpret multi-spectral signatures.',
    earthReplicableScope: [
      'Identification of hydrothermal deposits, basaltic lava stratigraphy, and cross-bedded paleolake sediments',
      'Protocol validation for contamination-free sample coring, sealing, and caching for sample return',
      'Handheld spectroscopic analysis (Raman, LIBS, XRF) in harsh field conditions with limited time envelopes',
      'Science-backroom operational cadence between field crews and remote Earth mission control',
    ],
    planetaryLimitations: [
      'Earth rocks are extensively altered by billions of years of biological weathering, vegetation roots, and rainwater acid leaching.',
      'True lunar impact regolith agglutinates and shock-melted micro-spherules require synthetic Apollo-derived lunar simulant (JSC-1A / NU-LHT).',
    ],
    suggestedSites: ['lanzarote-geopark', 'rio-tinto-spain', 'devon-island', 'sinai-peninsula-egypt'],
    keyInstruments: ['Handheld Raman / LIBS Spectrometer', 'Hermetic Sample Corer Rig', 'Microscopic Context Imager'],
    primaryRiskFactors: ['Biological contamination of pristine samples', 'Misidentification of altered sedimentary facies', 'Tool wear on unweathered crystalline granite'],
  },

  {
    id: 'isru-resource',
    title: 'In-Situ Resource Utilization (ISRU) Harvesting',
    code: 'TEST-DISC-04',
    description:
      'Validating extraction of volatile water from hydrated sulfate minerals, smelting oxygen from iron-titanium oxides (ilmenite), and regolith sintering for lunar civil engineering.',
    earthReplicableScope: [
      'Mechanical excavation and conveying of abrasive, compacting volcanic regolith and gypsum crusts',
      'Thermal desorption efficiency of crystalline water from hydrated minerals (gypsum, polyhydrated sulfates)',
      'Solar concentrator melting of basaltic regolith for 3D construction print blocks',
    ],
    planetaryLimitations: [
      'Vacuum thermodynamic sublimation: on Mars and Moon, ice sublimates instantly into vapor without liquid phase.',
      'Low thermal conductivity of vacuum regolith cannot be modeled without environmental pressure chambers.',
    ],
    suggestedSites: ['qattara-depression-egypt', 'mauna-loa-hiseas', 'mcmurdo-dry-valleys', 'atacama-desert'],
    keyInstruments: ['Regolith Thermal Reactor', 'Rotary Excavator Bucket Drum', 'Water Condenser Cold Trap'],
    primaryRiskFactors: ['Abrasive seal failure on moving auger parts', 'High energetic cost of sulfate dehydroxylation', 'Sintering thermal crack formation'],
  },

  {
    id: 'habitat-engineering',
    title: 'Extreme Habitat & Life Support Architecture',
    code: 'TEST-DISC-05',
    description:
      'Long-duration human isolation, closed-loop environmental control and life support systems (ECLSS), and structural deployment in volcanic lava tubes.',
    earthReplicableScope: [
      'Structural anchoring and inflatable habitat deployment in natural underground lava tubes',
      'Subsurface communications mesh networks and acoustic monitoring inside basalt caverns',
      'Crew psychological isolation dynamics, sleep cycle disruption, and autonomous team governance',
      'Dust mitigation airlock protocols and electrostatic garment de-dusting',
    ],
    planetaryLimitations: [
      'No natural protection against Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) can be tested on Earth without simulated radiation beams.',
      'Atmospheric breach risk on Earth is mitigated by breathable ambient air, whereas on Moon/Mars it causes explosive decompression or fatal hypoxia.',
    ],
    suggestedSites: ['mauna-loa-hiseas', 'lanzarote-geopark', 'devon-island'],
    keyInstruments: ['Inflatable Pressurized Module', 'Airlock Multi-Stage Vacuum Interlock', 'Environmental Sensor Array'],
    primaryRiskFactors: ['Structural micro-punctures from sharp volcanic ceiling falls', 'Crew fatigue from delayed communications', 'Dust airlock filter clogging'],
  },

  {
    id: 'eva-biomechanics',
    title: 'Extravehicular Activity (EVA) Suit Biomechanics',
    code: 'TEST-DISC-06',
    description:
      'Evaluating pressurized suit mobility, metabolic cost, tactile glove dexterity, and helmet field-of-view over rugged, hostile planetary terrain.',
    earthReplicableScope: [
      'Suit joint flexibility and human metabolic expenditure while traversing 25° rocky slopes',
      'Tool tethering and single-handed geological sample hammer and scoop manipulation',
      'Heads-up display (HUD) symbology and biometric warning telemetry readability under intense sunlight',
    ],
    planetaryLimitations: [
      'On Earth, suit weight is 100% (typically 80-140 kg), heavily fatiguing astronauts. On the Moon it weighs only 16.6% of its mass, though inertial momentum remains identical.',
      'Suits cannot be run at true internal positive pressure differentials (29.6 kPa / 4.3 psi against vacuum) without risk in ambient 1-bar air.',
    ],
    suggestedSites: ['devon-island', 'lanzarote-geopark', 'white-desert-egypt', 'sinai-peninsula-egypt'],
    keyInstruments: ['Pressurized EVA Analog Suit', 'Metabolic Gas Analyzer Backpack', 'Biometric ECG / Core Temp Telemetry'],
    primaryRiskFactors: ['Joint fatigue and abrasion blisters', 'Visor scratching from blown sand', 'Hyperthermia during intense daytime traverses'],
  },
];

export const PLANETARY_GAP_LIMITATIONS = [
  {
    parameter: 'Gravitational Acceleration',
    earthValue: '9.81 m/s² (1.0 g)',
    moonValue: '1.62 m/s² (0.166 g)',
    marsValue: '3.72 m/s² (0.38 g)',
    impactOnTesting: 'Rover traction, suspension oscillation, regolith shear strength, and dust settling velocity are profoundly altered. On Mars, dust remains airborne 3x longer; on the Moon, ballistic trajectories are 6x higher.',
    mitigationStrategy: 'Parabolic flight microgravity campaigns, counterweight crane offloading systems, or numerical dynamic scaling in multibody physics engines.',
  },
  {
    parameter: 'Atmospheric Pressure',
    earthValue: '101.3 kPa (1013 mbar)',
    moonValue: '< 10⁻¹² Pa (Ultra-High Hard Vacuum)',
    marsValue: '0.636 kPa (~6.36 mbar)',
    impactOnTesting: 'Pure vacuum alters thermal heat rejection (no convection, only radiation) and causes cold-welding between bare metal contacts. On Mars, low pressure lowers the boiling point of water to 0.01°C, making stable liquid water impossible.',
    mitigationStrategy: 'Testing in large thermal-vacuum chambers (e.g. NASA Plum Brook / JSC Chamber A) before and after field analog trials.',
  },
  {
    parameter: 'Radiation Environment',
    earthValue: '~2.4 mSv/year (Atmospheric & Magnetosphere Shielded)',
    moonValue: '~60 mSv/year unshielded (GCR + Solar Flare Events)',
    marsValue: '~250 - 300 mSv/year (Thin CO₂ gives marginal shielding)',
    impactOnTesting: 'Terrestrial analogs cannot test radiation hardening of commercial robotics, memory single-event upsets (SEU), or biological DNA double-strand breaks.',
    mitigationStrategy: 'Proton and heavy ion beam irradiation at Brookhaven National Laboratory (NASA Space Radiation Laboratory - NSRL).',
  },
  {
    parameter: 'Atmosphere Chemistry & Dust Electrostatics',
    earthValue: '78% N₂, 21% O₂, High Water Vapor',
    moonValue: 'Exosphere Trace (Noble gases)',
    marsValue: '95.3% CO₂, Toxic Perchlorates, Superoxides',
    impactOnTesting: 'Earth air dampens dust tribocharging due to atmospheric moisture. On the Moon, solar UV charges dust particles positively, causing them to levitate and adhere tenaciously to visors, suits, and solar panels.',
    mitigationStrategy: 'Tribocharge simulation in dry nitrogen gloveboxes and active electrostatic dust removal shield testing.',
  },
];

