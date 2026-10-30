import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicPageLayout } from './PublicStaticPages.jsx';

// ---------------- RESEARCH DATA ---------------- //

const researchCentresData = [
  {
    id: 'ai-robotics',
    name: 'Centre for Artificial Intelligence, Autonomous Systems & Robotics',
    dept: 'Computer Science & Engineering / AI & DS',
    code: 'CAI-ASR',
    lead: 'Dr. V. Ramanathan',
    designation: 'Professor & Chair (AI)',
    funding: '₹3.4 Crore',
    thrustAreas: [
      'Edge AI & Autonomous Robotic Navigation',
      'Large Multimodal Models for Indic Languages',
      'Computer Vision for Precision Healthcare & Agro-Tech',
      'Reinforcement Learning in Multi-Agent Swarms',
    ],
    infrastructure: [
      'Nvidia DGX A100 High-Performance Compute Cluster',
      '6-DOF Collaborative Industrial Robotic Arm Workstations',
      'Indoor Autonomous Drone Test Arena with Vicon Motion Capture',
      'Embedded Jetson AGX Orin Edge AI Development Suites',
    ],
    industryCollaborators: ['Intel AI Lab', 'NVIDIA Deep Learning Institute', 'Robert Bosch'],
    patentsFiled: 12,
  },
  {
    id: 'vlsi-semiconductor',
    name: 'Centre for Advanced VLSI & Semiconductor Nano-Electronics',
    dept: 'Electronics & Communication Engineering',
    code: 'CAV-SNE',
    lead: 'Dr. Meenakshi Sundaram',
    designation: 'Professor & Lead Investigator (VLSI)',
    funding: '₹2.8 Crore',
    thrustAreas: [
      'RISC-V Custom Core Accelerators for Cryptography',
      'Sub-28nm Ultra-Low Power CMOS Analog/Mixed Signal ICs',
      'Silicon Photonics & High-Speed Optical Interconnects',
      'MEMS Bio-Sensors for Wearable Diagnostics',
    ],
    infrastructure: [
      'Synopsys Full-Custom & Digital IC Design Tool Suite (100 User Licenses)',
      'Cadence Encounter, Virtuoso, and Spectre RF Platforms',
      'High-Speed Keysight 40GHz Vector Network Analyzer (VNA)',
      'Class-1000 Micro-Fabrication Testing Bay & Wire Bonder',
    ],
    industryCollaborators: ['Texas Instruments', 'Qualcomm', 'India Semiconductor Mission (ISM)'],
    patentsFiled: 9,
  },
  {
    id: 'smart-grid',
    name: 'Centre for Smart Microgrids & Renewable Energy Storage',
    dept: 'Electrical & Electronics Engineering',
    code: 'CSM-RES',
    lead: 'Dr. G. Sivakumar',
    designation: 'Professor (Power Systems & EV)',
    funding: '₹2.2 Crore',
    thrustAreas: [
      'Solid-State Battery Energy Storage & BMS Telemetry',
      'High-Power Bidirectional DC-DC Converters for Electric Vehicles',
      'AI-Based Islanding Detection & Distributed Microgrid Control',
      'Green Hydrogen Fuel Cell Hybrid Energy Integration',
    ],
    infrastructure: [
      'OPAL-RT Real-Time Hardware-in-the-Loop (HIL) Simulator (OP5700)',
      'Chroma Programmable Grid Simulator & Regenerative AC Load (30kVA)',
      'Multi-Channel Lithium-Ion Battery Cycler & Environmental Chamber',
      'Rooftop 50kW Grid-Tied Solar Microgrid Testbed with IoT Metering',
    ],
    industryCollaborators: ['ABB Global Research', 'Schneider Electric', 'Tata Power'],
    patentsFiled: 8,
  },
  {
    id: 'precision-manufacturing',
    name: 'Centre for Precision Manufacturing, Composites & Additive Systems',
    dept: 'Mechanical Engineering',
    code: 'CPM-CAS',
    lead: 'Dr. H. N. Prabhakar',
    designation: 'Professor & Dean (Mechanical Sciences)',
    funding: '₹2.6 Crore',
    thrustAreas: [
      'Direct Metal Laser Sintering (DMLS) for Aerospace Components',
      'Carbon Fiber & Bio-Polymer Advanced Composite Structures',
      'Cryogenic Machining of Superalloys & Titanium Aerospace Grades',
      'Topology Optimization & Generative Mechanical Design',
    ],
    infrastructure: [
      'DMG MORI 5-Axis Simultaneous CNC Machining Centre',
      'Industrial Metal 3D Printing System (Additive Manufacturing)',
      'Instron 100kN Servo-Hydraulic Universal Testing Machine (UTM)',
      'Olympus Optical Emission Spectrometer & Micro-Hardness Tester',
    ],
    industryCollaborators: ['Boeing India', 'Hindustan Aeronautics Limited (HAL)', 'L&T Defense'],
    patentsFiled: 6,
  },
  {
    id: 'biomedical-iot',
    name: 'Centre for Biomedical Devices & Healthcare IoT',
    dept: 'Bio-Medical Engineering & Medical Electronics',
    code: 'CBD-HIoT',
    lead: 'Dr. Saradha Chandran',
    designation: 'Professor (Biomedical Instrumentation)',
    funding: '₹1.9 Crore',
    thrustAreas: [
      'Non-Invasive Point-of-Care Blood Biomarker Analyzers',
      'AI-Enabled Mobile Ultrasound and Digital Pathology Systems',
      'Neuro-Rehabilitation Wearables with EMG Biofeedback',
      'Telemetry-Enabled Neonatal Incubator Monitoring Platforms',
    ],
    infrastructure: [
      'Class-II Type A2 Biosafety Containment Testing Suite',
      'High-Resolution Bio-Signal Acquisition Amplifiers (Biopac MP160)',
      'Fluke Biomedical Patient Simulator & Electrical Safety Analyzers',
      'Microfluidic Rapid Prototyping Clean Bench',
    ],
    industryCollaborators: ['GE Healthcare', 'Philips Health Systems', 'Narayana Health'],
    patentsFiled: 7,
  },
  {
    id: 'sustainable-civil',
    name: 'Centre for Sustainable Infrastructure & Geotechnical Engineering',
    dept: 'Civil Engineering',
    code: 'CSI-GE',
    lead: 'Dr. M. S. Venkatesh',
    designation: 'Professor (Structural Engineering)',
    funding: '₹1.5 Crore',
    thrustAreas: [
      'Low-Carbon Geopolymer Concrete Utilizing Industrial Byproducts',
      'Seismic Retrofitting & Vibration Attenuation in Tall Structures',
      'GIS-Coupled Urban Flood Prediction & Groundwater Aquifer Recharge',
      'Smart Fiber-Optic Sensor Arrays for Structural Health Monitoring',
    ],
    infrastructure: [
      'MTS 250kN Dynamic Actuator & Shake Table Seismic Simulator',
      'Automated Triaxial Shear Testing System (GDS Instruments)',
      'Non-Destructive Testing (NDT) Ultrasonic & Rebound Equipment',
      'Trimble Total Station with Differential GPS & LiDAR Scanner',
    ],
    industryCollaborators: ['Larsen & Toubro Construction', 'AFCONS Infrastructure', 'NHAI'],
    patentsFiled: 4,
  },
];

const supervisorsData = [
  {
    name: 'Dr. M. K. Narayanan',
    dept: 'Computer Science & Engineering',
    designation: 'Dean (R&D) & Senior Professor',
    qualification: 'Ph.D. (IISc Bengaluru)',
    thrust: 'Distributed Systems, High Performance Computing, Cloud Security',
    scholarsGraduated: 14,
    scholarsGuiding: 6,
    citations: '3,840+',
    hIndex: 28,
  },
  {
    name: 'Dr. Anitha Ramaswamy',
    dept: 'Electronics & Communication Engineering',
    designation: 'Associate Dean (Sponsored Research) & Professor',
    qualification: 'Ph.D. (IIT Madras)',
    thrust: 'VLSI Architectures, Cryptographic Hardware, Low-Power Systems',
    scholarsGraduated: 11,
    scholarsGuiding: 5,
    citations: '2,920+',
    hIndex: 24,
  },
  {
    name: 'Dr. V. Ramanathan',
    dept: 'Artificial Intelligence and Data Science',
    designation: 'Professor & Head (AI Research)',
    qualification: 'Ph.D. (IIT Bombay)',
    thrust: 'Deep Reinforcement Learning, Autonomous Robotics, Edge AI',
    scholarsGraduated: 9,
    scholarsGuiding: 7,
    citations: '3,150+',
    hIndex: 26,
  },
  {
    name: 'Dr. H. N. Prabhakar',
    dept: 'Mechanical Engineering',
    designation: 'Professor & Dean (Mechanical Sciences)',
    qualification: 'Ph.D. (NIT Karnataka)',
    thrust: 'Additive Manufacturing, Metal Matrix Composites, Cryo-Machining',
    scholarsGraduated: 13,
    scholarsGuiding: 4,
    citations: '2,480+',
    hIndex: 22,
  },
  {
    name: 'Dr. G. Sivakumar',
    dept: 'Electrical & Electronics Engineering',
    designation: 'Professor & Head (Power Systems)',
    qualification: 'Ph.D. (Anna University)',
    thrust: 'Smart Microgrids, Solid State Transformers, EV Fast Charging',
    scholarsGraduated: 10,
    scholarsGuiding: 5,
    citations: '2,140+',
    hIndex: 21,
  },
  {
    name: 'Dr. Saradha Chandran',
    dept: 'Bio-Medical Engineering',
    designation: 'Professor & Coordinator (Biomedical Lab)',
    qualification: 'Ph.D. (IIT Delhi)',
    thrust: 'Point-of-Care Biosensors, Bio-Signal Processing, Neural Prosthetics',
    scholarsGraduated: 8,
    scholarsGuiding: 6,
    citations: '1,890+',
    hIndex: 19,
  },
  {
    name: 'Dr. M. S. Venkatesh',
    dept: 'Civil Engineering',
    designation: 'Professor & Structural Consultant',
    qualification: 'Ph.D. (IISc Bengaluru)',
    thrust: 'Structural Health Monitoring, Green Geopolymers, Earthquake Engineering',
    scholarsGraduated: 7,
    scholarsGuiding: 4,
    citations: '1,640+',
    hIndex: 18,
  },
  {
    name: 'Dr. S. Balasubramanian',
    dept: 'Information Technology',
    designation: 'Associate Dean (IPR) & Professor',
    qualification: 'Ph.D. (BITS Pilani)',
    thrust: 'Zero-Trust Networks, Blockchain, Post-Quantum Cryptography',
    scholarsGraduated: 6,
    scholarsGuiding: 5,
    citations: '1,720+',
    hIndex: 17,
  },
];

const grantsData = [
  {
    id: 'G-2025-01',
    title: 'Development of Indigenous RISC-V Heterogeneous Multi-Core SoC for Edge Artificial Intelligence',
    pi: 'Dr. Anitha Ramaswamy (PI) · Dr. V. Ramanathan (Co-PI)',
    agency: 'Ministry of Electronics & Information Technology (MeitY)',
    scheme: 'Chips to Startup (C2S) Programme',
    amount: '₹94.50 Lakhs',
    duration: '2024 – 2027',
    status: 'Ongoing',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'G-2024-02',
    title: 'Design & Qualification of Cryogenic Thrust Chamber Regenerative Cooling Channels using DMLS Metal Additive Manufacturing',
    pi: 'Dr. H. N. Prabhakar (PI)',
    agency: 'ISRO (RESPOND Research Scheme)',
    scheme: 'Space Technology Cell (STC)',
    amount: '₹68.20 Lakhs',
    duration: '2023 – 2026',
    status: 'Ongoing',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'G-2024-03',
    title: 'Smart Decentralized DC Microgrid Architecture with Solid-State Battery Energy Storage for Electric Vehicle Fleet Depots',
    pi: 'Dr. G. Sivakumar (PI)',
    agency: 'Department of Science & Technology (DST)',
    scheme: 'Clean Energy Research Initiative (CERI)',
    amount: '₹76.80 Lakhs',
    duration: '2024 – 2027',
    status: 'Ongoing',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'G-2023-04',
    title: 'Wearable Multi-Modal Optical & Electrical Biosensor Array for Early Sepsis Detection in Intensive Care Units',
    pi: 'Dr. Saradha Chandran (PI)',
    agency: 'Department of Biotechnology (DBT)',
    scheme: 'Biotechnology Industry Research Assistance (BIRAC)',
    amount: '₹58.40 Lakhs',
    duration: '2023 – 2025',
    status: 'Ongoing',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'G-2023-05',
    title: 'Zero-Carbon Geopolymer Structural Concrete Derived from Ground Granulated Blast-Furnace Slag for Coastal Protection Works',
    pi: 'Dr. M. S. Venkatesh (PI)',
    agency: 'AICTE',
    scheme: 'Research Promotion Scheme (RPS)',
    amount: '₹22.50 Lakhs',
    duration: '2023 – 2025',
    status: 'Ongoing',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'G-2022-06',
    title: 'Autonomous Swarm Drone Coordination System for Precision Agricultural Health Mapping and Spot Spraying',
    pi: 'Dr. V. Ramanathan (PI)',
    agency: 'Boeing India Higher Education Research Consortium',
    scheme: 'Industry Sponsored Grant',
    amount: '₹48.00 Lakhs',
    duration: '2022 – 2024',
    status: 'Completed',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
];

const patentsData = [
  {
    appNo: 'IN 202441058291',
    title: 'A High-Speed Energy-Efficient Hardware Accelerator for Lattice-Based Post-Quantum Cryptography',
    inventors: 'Dr. Anitha Ramaswamy, Arvind K. (Ph.D. Scholar), Dr. S. Balasubramanian',
    filingDate: '14 May 2024',
    status: 'Granted (Patent No. 492104)',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black',
    jurisdiction: 'Indian Patent Office',
    field: 'VLSI & Cryptography',
  },
  {
    appNo: 'IN 202341031980',
    title: 'Non-Invasive Continuous Blood Pressure Monitoring System Using Dual Photoplethysmography Sensor Fusion',
    inventors: 'Dr. Saradha Chandran, Priya Natarajan (Student Co-Inventor), Dr. M. K. Narayanan',
    filingDate: '28 August 2023',
    status: 'Granted (Patent No. 468921)',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black',
    jurisdiction: 'Indian Patent Office',
    field: 'Biomedical Engineering',
  },
  {
    appNo: 'IN 202441019284',
    title: 'Adaptive Multi-Level Bidirectional Inverter with Active Zero-Sequence Voltage Elimination for Electric Vehicle Drives',
    inventors: 'Dr. G. Sivakumar, Karthik Balaji (Scholar)',
    filingDate: '12 February 2024',
    status: 'Published (Awaiting Examination)',
    statusBadge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    jurisdiction: 'Indian Patent Office',
    field: 'Power Electronics & EV',
  },
  {
    appNo: 'US 18/692,410',
    title: 'Autonomous Distributed Swarm Collision Avoidance Mechanism in GPS-Denied Confined Environments',
    inventors: 'Dr. V. Ramanathan, Rohan K. Deshmukh',
    filingDate: '19 November 2023',
    status: 'Published (USPTO International)',
    statusBadge: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    jurisdiction: 'United States Patent Office (USPTO)',
    field: 'Robotics & AI',
  },
  {
    appNo: 'IN 202341076522',
    title: 'Cryogenic Mist Delivery Nozzle Assembly for High-Speed Machining of Titanium Aerospace Alloys',
    inventors: 'Dr. H. N. Prabhakar, Ramesh Babu (Scholar)',
    filingDate: '09 November 2023',
    status: 'Granted (Patent No. 453189)',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black',
    jurisdiction: 'Indian Patent Office',
    field: 'Mechanical & Aerospace',
  },
  {
    appNo: 'IN 202441088412',
    title: 'Self-Healing Geopolymer Concrete Composition Utilizing Microencapsulated Bacterial Spores',
    inventors: 'Dr. M. S. Venkatesh, Sujata Sen',
    filingDate: '22 October 2024',
    status: 'Published (Official Gazette)',
    statusBadge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    jurisdiction: 'Indian Patent Office',
    field: 'Civil Engineering',
  },
];

// ---------------- MAIN COMPONENT ---------------- //

export default function ResearchPage() {
  const { sub } = useParams();

  const subNav = [
    { label: 'Research Objectives & Council', to: '/research/council' },
    { label: 'Recognized Research Centres', to: '/research/centres' },
    { label: 'Recognized Supervisors & Scholars', to: '/research/supervisors' },
    { label: 'Grants & Sponsored Projects', to: '/research/grants' },
    { label: 'Patents & Copyrights', to: '/research/patents' },
  ];

  // Map sub route parameter to active section
  const currentTab = useMemo(() => {
    const raw = (sub || '').toLowerCase().trim();
    if (raw === 'centres' || raw === 'centers') return 'centres';
    if (raw === 'supervisors' || raw === 'scholars') return 'supervisors';
    if (raw === 'grants' || raw === 'projects' || raw === 'sponsored') return 'grants';
    if (raw === 'patents' || raw === 'ipr' || raw === 'copyrights') return 'patents';
    return 'council';
  }, [sub]);

  const meta = {
    council: {
      title: 'Research & Development (R&D)',
      subtitle: 'Driving frontier innovation, interdisciplinary discovery, sponsored investigations, and technology commercialization.',
      crumb: 'Objectives & Council',
    },
    centres: {
      title: 'Recognized Research Centres',
      subtitle: 'Eight state-of-the-art doctoral research laboratories certified for Ph.D. and M.S. investigations.',
      crumb: 'Research Centres',
    },
    supervisors: {
      title: 'Recognized Supervisors & Scholars',
      subtitle: 'Eminent faculty guides, doctoral research mentors, and high-impact scholar publications.',
      crumb: 'Supervisors & Scholars',
    },
    grants: {
      title: 'Grants & Sponsored Projects',
      subtitle: 'Extramural research funding exceeding ₹14.8 Crore from ISRO, DRDO, MeitY, DST, AICTE, and Global Industry.',
      crumb: 'Grants & Projects',
    },
    patents: {
      title: 'Patents & Intellectual Property (IPR)',
      subtitle: 'Commercializing laboratory breakthroughs with 42 patents filed/published and 14 granted innovations.',
      crumb: 'Patents & Copyrights',
    },
  }[currentTab];

  return (
    <PublicPageLayout
      title={meta.title}
      subtitle={meta.subtitle}
      breadcrumbs={[{ label: 'R&D', to: '/research/council' }, { label: meta.crumb }]}
      subNav={subNav}
    >
      {currentTab === 'council' && <ResearchCouncilSection />}
      {currentTab === 'centres' && <ResearchCentresSection />}
      {currentTab === 'supervisors' && <SupervisorsSection />}
      {currentTab === 'grants' && <GrantsSection />}
      {currentTab === 'patents' && <PatentsSection />}
    </PublicPageLayout>
  );
}

// -------------------------------------------------------------
// SECTION 1: RESEARCH OBJECTIVES & COUNCIL
// -------------------------------------------------------------
function ResearchCouncilSection() {
  return (
    <div className="space-y-10">
      {/* Hero Impact Stats Banner */}
      <div className="rounded-2xl border border-blue-900/10 bg-gradient-to-br from-[#0b3d91] via-[#09357a] to-[#041e42] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Excellence in Discovery & Innovation
            </span>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Pioneering Translational Research for National Impact
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              At Hogwarts Institute of Technology, research is the core catalyst of academic excellence. We empower over 78 recognized research supervisors and 120+ doctoral scholars with cutting-edge compute infrastructure, seed funding, and seamless technology transfer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/research/grants"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-900 shadow hover:bg-amber-300 transition"
            >
              View Sponsored Grants &rarr;
            </Link>
            <Link
              to="/research/centres"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              Explore Research Centres
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">₹14.8 Cr+</p>
            <p className="text-[11px] font-medium text-blue-100">Sponsored Funding</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">160+</p>
            <p className="text-[11px] font-medium text-blue-100">Scopus/SCI Pubs / Yr</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">42</p>
            <p className="text-[11px] font-medium text-blue-100">Patents Published</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">14</p>
            <p className="text-[11px] font-medium text-blue-100">Granted Patents</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">8</p>
            <p className="text-[11px] font-medium text-blue-100">Doctoral Centres</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">120+</p>
            <p className="text-[11px] font-medium text-blue-100">Doctoral Scholars</p>
          </div>
        </div>
      </div>

      {/* Strategic Objectives */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="badge bg-blue-100 text-[#0b3d91] font-bold text-[10px] uppercase">
            Charter & Mission
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">R&D Strategic Objectives</h3>
          <p className="text-xs text-slate-600">The guiding tenets governing scientific investigations at HIT</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Translational Discovery',
              desc: 'Convert fundamental bench-level discoveries in AI, semiconductors, and green energy into patentable and manufacturable prototypes.',
              icon: '🔬',
            },
            {
              title: 'National Mission Alignment',
              desc: 'Align departmental research roadmaps directly with national missions including the India Semiconductor Mission, National Green Hydrogen Mission, and ISRO Space Tech.',
              icon: '🇮🇳',
            },
            {
              title: 'Interdisciplinary Collaboration',
              desc: 'Bridge computer science, mechanical design, biotechnology, and materials science to address complex societal health and environmental challenges.',
              icon: '🌐',
            },
            {
              title: 'Industry-Sponsored Investigation',
              desc: 'Establish sustained collaborative testbeds and joint technology incubation consortia with global corporate leaders (Intel, Bosch, Boeing, GE Healthcare).',
              icon: '🏭',
            },
            {
              title: 'Faculty Seed Capital Scheme',
              desc: 'Provide early-stage financial seed grants up to ₹5.0 Lakhs per faculty member to generate preliminary proofs-of-concept for major DST/MeitY extramural grant bids.',
              icon: '💡',
            },
            {
              title: 'Academic Integrity & Open Science',
              desc: 'Enforce strict Turnitin plagiarism screening, institutional ethical review boards for biomedical protocols, and open reproducibility of scientific datasets.',
              icon: '🛡️',
            },
          ].map((obj, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:bg-white hover:shadow-sm transition">
              <span className="text-2xl">{obj.icon}</span>
              <h4 className="mt-2 text-sm font-bold text-slate-900">{obj.title}</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Advisory Council */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="badge bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
            Executive Leadership
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Research Advisory Council & Leadership</h3>
          <p className="text-xs text-slate-600">Distinguished leadership steering institution-wide research policy and grant allocations</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Dr. M. K. Narayanan',
              role: 'Dean (Research & Development)',
              qual: 'Ph.D. (IISc Bengaluru) · Former Scientist, DRDO',
              email: 'dean.rnd@hit.edu.in',
              responsibility: 'Overall R&D governance, doctoral programmes, university linkages.',
            },
            {
              name: 'Dr. Anitha Ramaswamy',
              role: 'Associate Dean (Sponsored Research)',
              qual: 'Ph.D. (IIT Madras)',
              email: 'rnd.sponsored@hit.edu.in',
              responsibility: 'Extramural project proposals, DST/MeitY grants administration.',
            },
            {
              name: 'Dr. S. Balasubramanian',
              role: 'Associate Dean (IPR & Tech Transfer)',
              qual: 'Ph.D. (BITS Pilani)',
              email: 'rnd.ipr@hit.edu.in',
              responsibility: 'Patent disclosures, prior-art searches, industry licensing agreements.',
            },
            {
              name: 'Dr. H. N. Prabhakar',
              role: 'Associate Dean (Innovation Labs)',
              qual: 'Ph.D. (NIT Karnataka)',
              email: 'rnd.labs@hit.edu.in',
              responsibility: 'Centralized advanced instrumentation procurement & maintenance.',
            },
            {
              name: 'Dr. Saradha Chandran',
              role: 'Member Secretary (Ethical Committee)',
              qual: 'Ph.D. (IIT Delhi)',
              email: 'rnd.ethics@hit.edu.in',
              responsibility: 'Institutional ethics clearances and human subject protocols.',
            },
            {
              name: 'Dr. V. Ramanathan',
              role: 'Coordinator (Doctoral Research)',
              qual: 'Ph.D. (IIT Bombay)',
              email: 'phd.cell@hit.edu.in',
              responsibility: 'Doctoral scholar admissions, coursework, and thesis submissions.',
            },
          ].map((leader, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0b3d91] font-black text-sm mb-3">
                  {leader.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{leader.name}</h4>
                <p className="text-xs font-bold text-[#0b3d91] mt-0.5">{leader.role}</p>
                <p className="text-[11px] text-slate-500 mt-1">{leader.qual}</p>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded">
                  {leader.responsibility}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100">
                <a
                  href={`mailto:${leader.email}`}
                  className="text-[11px] font-bold text-[#0b3d91] hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {leader.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Research Incentive Policy */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
        <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <span>🏆</span> Faculty & Student Research Incentive Policy
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs text-amber-900">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 shadow-sm">
            <p className="font-black text-sm text-amber-800">₹50,000</p>
            <p className="font-semibold text-slate-900 mt-0.5">Q1 Journal Publication</p>
            <p className="text-[11px] text-slate-600 mt-1">Cash award for top quartile Web of Science / Nature / IEEE journal papers.</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 shadow-sm">
            <p className="font-black text-sm text-amber-800">₹1,00,000</p>
            <p className="font-semibold text-slate-900 mt-0.5">Granted Indian / US Patent</p>
            <p className="text-[11px] text-slate-600 mt-1">Direct reward on commercial patent grant along with 100% filing fee coverage.</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 shadow-sm">
            <p className="font-black text-sm text-amber-800">100% Travel Grant</p>
            <p className="font-semibold text-slate-900 mt-0.5">International Conferences</p>
            <p className="text-[11px] text-slate-600 mt-1">Airfare and registration funding to present peer-reviewed papers overseas.</p>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 shadow-sm">
            <p className="font-black text-sm text-amber-800">Up to ₹5.0 Lakhs</p>
            <p className="font-semibold text-slate-900 mt-0.5">Young Faculty Seed Fund</p>
            <p className="text-[11px] text-slate-600 mt-1">Prototype initiation capital awarded within first two years of joining HIT.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 2: RECOGNIZED RESEARCH CENTRES
// -------------------------------------------------------------
function ResearchCentresSection() {
  const [selectedCentre, setSelectedCentre] = useState(researchCentresData[0]);

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-white to-amber-50/50 border border-blue-100">
        <div className="max-w-3xl space-y-2">
          <span className="badge bg-[#0b3d91] text-white font-bold text-[10px]">
            Doctoral Infrastructure
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Recognized Doctoral Research Centres
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            HIT hosts 8 specialized interdisciplinary research centres recognized by VTU / Anna University and national funding agencies. Each centre is equipped with advanced computational clusters, hardware testbenches, and licensed EDA/CAD suites.
          </p>
        </div>
      </div>

      {/* Main Layout: List on Left, Active Centre Detail on Right */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Centres Sidebar List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select a Research Centre
          </h3>
          {researchCentresData.map((centre) => {
            const isSelected = selectedCentre.id === centre.id;
            return (
              <button
                key={centre.id}
                type="button"
                onClick={() => setSelectedCentre(centre)}
                className={`w-full text-left rounded-xl p-4 transition border ${
                  isSelected
                    ? 'bg-[#0b3d91] text-white border-[#0b3d91] shadow-md ring-2 ring-blue-900/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`badge text-[10px] font-bold ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-blue-100 text-[#0b3d91]'
                    }`}
                  >
                    {centre.code}
                  </span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                    Grant: {centre.funding}
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold leading-snug">{centre.name}</h4>
                <p className={`mt-1 text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {centre.dept}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Centre Full Details */}
        <div className="lg:col-span-7">
          <div className="card p-6 sm:p-7 space-y-6 sticky top-20 border-2 border-blue-100">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="badge bg-[#0b3d91] text-white text-[11px] font-bold">
                  {selectedCentre.code}
                </span>
                <span className="badge bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                  Total Sponsored Capital: {selectedCentre.funding}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-black text-slate-900 leading-snug">
                {selectedCentre.name}
              </h3>
              <p className="mt-0.5 text-xs text-[#0b3d91] font-semibold">{selectedCentre.dept}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Lead Coordinator</span>
                  <span className="font-bold text-slate-900">{selectedCentre.lead}</span>
                  <span className="text-slate-500 block text-[11px]">{selectedCentre.designation}</span>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">IPR Generated</span>
                  <span className="font-bold text-emerald-700">{selectedCentre.patentsFiled} Patents Filed / Granted</span>
                </div>
              </div>
            </div>

            {/* Thrust Areas */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0b3d91]" />
                Primary Research Thrust Areas
              </h4>
              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                {selectedCentre.thrustAreas.map((area, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-blue-50/60 p-2.5 border border-blue-100/80">
                    <span className="text-blue-700 font-bold">▶</span>
                    <span className="text-slate-700 leading-snug">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Major Infrastructure & Facilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Advanced Facilities & Major Equipment
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedCentre.infrastructure.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industry Partners */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Active Industry & Statutory Collaborators:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCentre.industryCollaborators.map((partner, i) => (
                  <span
                    key={i}
                    className="badge bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-1 px-3"
                  >
                    🤝 {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 3: RECOGNIZED SUPERVISORS & SCHOLARS
// -------------------------------------------------------------
function SupervisorsSection() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const departments = ['All', 'Computer Science & Engineering', 'Electronics & Communication Engineering', 'Artificial Intelligence and Data Science', 'Mechanical Engineering', 'Electrical & Electronics Engineering', 'Bio-Medical Engineering', 'Civil Engineering', 'Information Technology'];

  const filtered = useMemo(() => {
    return supervisorsData.filter((s) => {
      const matchDept = filterDept === 'All' || s.dept.toLowerCase().includes(filterDept.toLowerCase());
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.thrust.toLowerCase().includes(q) ||
        s.qualification.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [search, filterDept]);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/50 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="badge bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Faculty Mentorship
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Approved Ph.D. Supervisors & Research Mentors
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our supervisors are nationally recognized investigators holding doctorates from premier institutes (IISc, IITs, NITs) with active sponsored research grants and high citation records.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-200 text-center shadow-sm">
            <p className="text-2xl font-black text-[#0b3d91]">78</p>
            <p className="text-[11px] font-bold text-slate-600">Approved Guides</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supervisors by name or thrust area..."
            className="input text-xs py-2"
          />
        </div>

        <div className="w-full sm:w-72">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="input text-xs py-2"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Supervisors Table / Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filtered.map((sup, idx) => (
          <div
            key={idx}
            className="card p-5 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sup.name}</h3>
                  <p className="text-xs font-semibold text-[#0b3d91]">{sup.designation}</p>
                  <p className="text-[11px] text-slate-500">{sup.dept}</p>
                </div>
                <span className="badge bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  {sup.qualification}
                </span>
              </div>

              <div className="mt-3 rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thrust Areas</p>
                <p className="mt-0.5 text-slate-700 font-medium leading-relaxed">{sup.thrust}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded bg-blue-50/70 p-1.5 border border-blue-100">
                <span className="font-black text-[#0b3d91] block">{sup.scholarsGraduated}</span>
                <span className="text-[10px] text-slate-500 leading-none">Ph.D. Awarded</span>
              </div>
              <div className="rounded bg-emerald-50/70 p-1.5 border border-emerald-100">
                <span className="font-black text-emerald-800 block">{sup.scholarsGuiding}</span>
                <span className="text-[10px] text-slate-500 leading-none">Ongoing</span>
              </div>
              <div className="rounded bg-amber-50/70 p-1.5 border border-amber-100">
                <span className="font-black text-amber-900 block">{sup.citations}</span>
                <span className="text-[10px] text-slate-500 leading-none">Citations</span>
              </div>
              <div className="rounded bg-purple-50/70 p-1.5 border border-purple-100">
                <span className="font-black text-purple-900 block">{sup.hIndex}</span>
                <span className="text-[10px] text-slate-500 leading-none">h-Index</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ph.D. Admission Guidelines Card */}
      <div className="card p-6 border border-blue-200 bg-blue-50/40 space-y-3">
        <h3 className="text-sm font-bold text-[#0b3d91]">Doctoral Admissions & Scholar Fellowships</h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          Admissions to Ph.D. / M.S. (By Research) are conducted twice a year (January & July cycles). Full-time scholars are eligible for the <strong>HIT Institutional Doctoral Fellowship (₹25,000/month)</strong>, Visvesvaraya Ph.D. Fellowships, and direct industry research stipends.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="badge bg-white text-slate-800 border border-slate-200">
            Eligibility: Master's with ≥ 65% (or equivalent CGPA)
          </span>
          <span className="badge bg-white text-slate-800 border border-slate-200">
            Exemption from Entrance: GATE / NET / JRF Qualified
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 4: GRANTS & SPONSORED PROJECTS
// -------------------------------------------------------------
function GrantsSection() {
  const [filterAgency, setFilterAgency] = useState('All');

  const filteredGrants = useMemo(() => {
    if (filterAgency === 'All') return grantsData;
    return grantsData.filter((g) => g.agency.toLowerCase().includes(filterAgency.toLowerCase()));
  }, [filterAgency]);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0b3d91] to-[#041e42] text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <span className="badge bg-amber-400 text-slate-950 font-black text-[10px]">
              Extramural Research Funding
            </span>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Sponsored Research Projects & Grants
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Faculty members at HIT actively compete for and secure research grants from prestigious Indian and international agencies. Our portfolio spans deep-tech defense innovations, clean energy storage, space research, and healthcare instrumentation.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur text-center border border-white/20">
            <p className="text-3xl font-black text-amber-300">₹14.8 Cr+</p>
            <p className="text-xs font-bold text-blue-100">Cumulative Extramural Grants</p>
          </div>
        </div>
      </div>

      {/* Grants Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Major Sponsored Projects Portfolio</h3>
          <p className="text-xs text-slate-500">Filter by sponsoring government body or industry</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'MeitY', 'ISRO', 'DST', 'DBT', 'AICTE', 'Boeing'].map((ag) => (
            <button
              key={ag}
              type="button"
              onClick={() => setFilterAgency(ag)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                filterAgency === ag
                  ? 'bg-[#0b3d91] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ag === 'All' ? 'All Agencies' : ag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards */}
      <div className="space-y-4">
        {filteredGrants.map((proj) => (
          <div
            key={proj.id}
            className="card p-5 sm:p-6 hover:border-blue-400 hover:shadow-md transition bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-blue-100 text-[#0b3d91] font-mono text-[10px] font-bold">
                    {proj.id}
                  </span>
                  <span className={`badge text-[10px] font-bold border ${proj.badgeClass}`}>
                    ● {proj.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">{proj.duration}</span>
                </div>
                <h4 className="mt-1.5 text-base font-bold text-slate-900 leading-snug">
                  {proj.title}
                </h4>
              </div>
              <div className="text-right sm:shrink-0 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Grant Amount</span>
                <span className="text-base font-black text-amber-900">{proj.amount}</span>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Principal Investigator (PI)</span>
                <p className="font-semibold text-slate-800 mt-0.5">{proj.pi}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sponsoring Body & Scheme</span>
                <p className="font-semibold text-[#0b3d91] mt-0.5">
                  {proj.agency} — <span className="text-slate-600 font-normal">{proj.scheme}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HIT Seed Money Call for Proposals */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#0b3d91]">
            HIT Internal Faculty Seed Money Scheme (Cycle 2026-27)
          </h4>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Proposals are invited from early-career faculty members for internal seed funding up to ₹5.0 Lakhs. Focus areas: Generative AI in education, energy harvesting, and low-cost assistive healthcare robotics.
          </p>
        </div>
        <a
          href="mailto:rnd.sponsored@hit.edu.in?subject=HIT%20Seed%20Money%20Proposal"
          className="rounded-lg bg-[#0b3d91] px-4 py-2 text-xs font-bold text-white hover:bg-[#082e6e] transition shrink-0 shadow text-center"
        >
          Submit Seed Proposal &rarr;
        </a>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 5: PATENTS & COPYRIGHTS
// -------------------------------------------------------------
function PatentsSection() {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPatents = useMemo(() => {
    if (filterStatus === 'All') return patentsData;
    if (filterStatus === 'Granted') return patentsData.filter(p => p.status.includes('Granted'));
    if (filterStatus === 'Published') return patentsData.filter(p => p.status.includes('Published'));
    return patentsData;
  }, [filterStatus]);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-amber-50/70 via-white to-blue-50/60 border border-amber-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="badge bg-amber-400 text-slate-950 font-black text-[10px]">
              Intellectual Property Rights Cell (IPR)
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Patents, Copyrights & Technology Transfer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The IPR Cell at HIT provides end-to-end patenting facilitation: prior-art search, drafting patent specifications, financial sponsorship of official fees, and commercialization licensing. Over 42 patents have been filed and 14 granted to faculty and student innovators.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:shrink-0">
            <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">
              <p className="text-2xl font-black text-amber-800">14</p>
              <p className="text-[11px] font-bold text-slate-600">Granted Patents</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">
              <p className="text-2xl font-black text-[#0b3d91]">42</p>
              <p className="text-[11px] font-bold text-slate-600">Filed / Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Official Patent Register</h3>
          <p className="text-xs text-slate-500">Curated list of granted and published patents across technological domains</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Granted', 'Published'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-[#0b3d91] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'All' ? 'All Patents' : `${st} Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Patents Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredPatents.map((pat, idx) => (
          <div
            key={idx}
            className="card p-5 sm:p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition bg-white"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-extrabold text-[#0b3d91] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {pat.appNo}
                </span>
                <span className="badge bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                  {pat.field}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {pat.title}
              </h4>

              <div className="mt-3 space-y-1 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Inventors</span>
                  <p className="font-semibold text-slate-700">{pat.inventors}</p>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Jurisdiction: <strong>{pat.jurisdiction}</strong></span>
                  <span>Filing Date: {pat.filingDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className={`badge text-[10px] w-full justify-center py-1 border ${pat.statusBadge}`}>
                {pat.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* IPR Cell Process / Support Banner */}
      <div className="card p-6 bg-slate-900 text-white space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span>💡</span> HIT Technology Transfer & IP Commercialization
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Interested corporate partners and startup licensees can contact the IPR cell for commercial licensing terms, joint clinical validation, or cooperative patent commercialization rights.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="mailto:rnd.ipr@hit.edu.in?subject=IPR%20Licensing%20Inquiry"
            className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
          >
            Contact IPR Cell (rnd.ipr@hit.edu.in) &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

