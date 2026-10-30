import { siteConfig } from '../config/siteConfig.js';

export const DRAFT_NOTICE =
  'Draft content — this section is awaiting official approval from the department.';

export const COMMON_POS = [
  { id: 'PO1', text: 'Apply knowledge of mathematics, science, engineering fundamentals and an engineering specialization to solve complex engineering problems.' },
  { id: 'PO2', text: 'Identify, formulate, review research literature and analyze complex engineering problems using first principles of mathematics and engineering sciences.' },
  { id: 'PO3', text: 'Design solutions for complex engineering problems and design system components or processes that meet specified needs with appropriate consideration for public health and safety.' },
  { id: 'PO4', text: 'Use research-based knowledge and research methods to conduct investigations of complex problems, including analysis and interpretation of data.' },
  { id: 'PO5', text: 'Create, select and apply appropriate techniques, resources and modern engineering and IT tools to complex engineering activities with an understanding of their limitations.' },
  { id: 'PO6', text: 'Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues relevant to professional engineering practice.' },
  { id: 'PO7', text: 'Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of sustainable development.' },
  { id: 'PO8', text: 'Apply ethical principles and commit to professional ethics, responsibilities and norms of engineering practice.' },
  { id: 'PO9', text: 'Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.' },
  { id: 'PO10', text: 'Communicate effectively on complex engineering activities with the engineering community and with society at large.' },
  { id: 'PO11', text: 'Demonstrate knowledge and understanding of engineering and management principles and apply these to manage projects in multidisciplinary environments.' },
  { id: 'PO12', text: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.' },
];

export const CORE_VALUES = [
  { title: 'Integrity', text: 'Uphold honesty, transparency and academic ethics in every activity.' },
  { title: 'Teamwork', text: 'Collaborate across disciplines and support shared academic goals.' },
  { title: 'Innovation', text: 'Encourage curiosity, experimentation and creative problem solving.' },
  { title: 'Responsibility', text: 'Act with accountability towards students, society and the environment.' },
  { title: 'Lifelong Learning', text: 'Stay current with emerging technologies and evolving professional practice.' },
  { title: 'Excellence', text: 'Pursue continuous improvement in teaching, research and service.' },
];

export const COMMON_GOALS = [
  { title: 'Academic Excellence', text: 'Maintain a rigorous, outcome-based curriculum and strong student mentoring.' },
  { title: 'Innovation & Research', text: 'Promote applied research, publications and innovation-driven projects.' },
  { title: 'Employability', text: 'Strengthen industry readiness through internships, training and placement support.' },
  { title: 'Professional Development', text: 'Encourage faculty development, certifications and collaborative learning.' },
  { title: 'Societal Impact', text: 'Apply engineering knowledge to community needs and sustainable development.' },
];

const DEFAULT_FACILITIES = [
  { name: 'Department Library & Reading Room', description: 'Reference books, journals and digital resources for students and faculty.' },
  { name: 'Seminar Hall', description: 'Space for guest lectures, technical talks and student presentations.' },
  { name: 'Project & Research Space', description: 'Dedicated workspace for final-year projects and research activities.' },
  { name: 'Smart Classrooms', description: 'ICT-enabled classrooms supporting blended and interactive learning.' },
  { name: 'Campus Network Access', description: 'High-speed campus network and computing facilities for academic work.' },
];

const PREPARATION_RESOURCES = [
  { title: 'Aptitude Preparation', description: 'Quantitative aptitude, logical reasoning and verbal ability practice.', to: '/career-development/training' },
  { title: 'Technical Interview Preparation', description: 'Core subject revision and technical interview guidance.', to: '/career-development/training' },
  { title: 'Resume Guidance', description: 'Resume building, profile review and professional documentation.', to: '/career-development' },
  { title: 'Mock Interviews', description: 'Simulated technical and HR interview sessions.', to: '/career-development' },
  { title: 'Training Schedules', description: 'Department and Career Development Cell training calendar.', to: '/career-development/training' },
  { title: 'Career Development Cell', description: 'Institutional placement and career guidance support.', to: '/career-development' },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function lab(name, category, description, extra = {}) {
  return {
    id: slugify(name),
    name,
    category,
    description,
    image: extra.image ?? '',
    equipment: extra.equipment ?? [],
    experiments: extra.experiments ?? [],
    courses: extra.courses ?? [],
    incharge: extra.incharge ?? '',
    safety: extra.safety ?? 'Standard laboratory safety guidelines and supervisor instructions apply.',
    resources: extra.resources ?? [],
  };
}

function semester(number, credits, subjectNames) {
  return {
    number,
    title: `Semester ${number}`,
    credits,
    subjects: subjectNames.map((name) => ({
      name,
      code: '',
      category: /lab|practical|workshop/i.test(name) ? 'Laboratory' : 'Core',
      credits: null,
    })),
  };
}

function programme(id, name, degree, duration, intake, description, accreditation) {
  return { id, name, degree, duration, intake, description, accreditation };
}

const RAW_DEPARTMENTS = {
  cse: {
    contentStatus: 'published',
    established: 2001,
    intakeUG: 180,
    intakePG: 18,
    tagline: 'Building competent computing professionals and researchers.',
    overview:
      'The Department of Computer Science and Engineering was established in 2001 and received professional accreditation in 2015. The department offers B.E. (CSE), M.E. (CSE) and Ph.D. research programmes, supported by experienced faculty across academics, research and industry. Alumni work at leading global technology firms including Google, Microsoft, Amazon, Meta and Adobe.',
    objectives: [
      'Deliver a strong foundation in computing theory, systems and software engineering.',
      'Develop problem-solving, design and research skills through project-based learning.',
      'Prepare graduates for professional practice, higher studies and entrepreneurship.',
    ],
    academicFocus: ['Data Structures & Algorithms', 'Software Engineering', 'Networks & Security', 'Artificial Intelligence & Data Science'],
    researchAreas: ['Machine Learning & Deep Learning', 'Cloud & Distributed Systems', 'Cyber Security', 'Data Engineering & Analytics'],
    industryInteraction: ['Industry internships and live projects', 'Expert lecture series and workshops', 'Placement and recruitment partnerships'],
    vision:
      'To produce competent professionals for a globalized technological society by preparing them to become part of industry and research organizations in Computer Science and Technology, and to orient them towards serving society.',
    mission: [
      'Strengthening core competence in Computer Science and Engineering through analytical learning and industry-institute interaction.',
      'Providing exposure to the latest tools and technologies to design solutions and conduct investigations.',
      'Promoting innovative research-based projects and activities in emerging areas of technology convergence.',
      'Inculcating professional behaviour, strong ethical values, leadership abilities, entrepreneurship skills and commitment to lifelong learning.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Excel in professional careers and higher education by acquiring a solid foundation in mathematical, scientific and engineering fundamentals.' },
      { id: 'PEO 2', text: 'Analyze real-world engineering problems and create innovative software systems using modern computational tools and methodologies.' },
      { id: 'PEO 3', text: 'Exhibit ethical attitude, effective communication, multidisciplinary teamwork and adaptability to emerging technologies through lifelong learning.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Design and develop scalable software applications using modern programming languages, frameworks and databases.' },
      { id: 'PSO 2', text: 'Apply AI, data science and cloud technologies to solve practical computing problems.' },
      { id: 'PSO 3', text: 'Build secure and reliable networked systems with an awareness of professional and ethical responsibility.' },
    ],
    programmes: [
      programme('be', 'B.E. Computer Science and Engineering', 'B.E.', '4 Years', 180, 'Undergraduate programme covering computing fundamentals, software systems, networks, AI and project work.', 'Professionally accredited programme'),
      programme('me', 'M.E. Computer Science and Engineering', 'M.E.', '2 Years', 18, 'Postgraduate programme focused on advanced computing, research methodology and a supervised dissertation.', ''),
      programme('phd', 'Ph.D. in Computer Science and Engineering', 'Ph.D.', '3+ Years', null, 'Doctoral research programme in emerging areas of computer science and engineering.', ''),
    ],
    labs: [
      lab('Advanced Computing & AI Lab', 'Computing & AI', 'Workstations for AI, machine learning and high-performance computing practicals.', {
        equipment: ['Intel Core i7 workstations', '16 GB RAM', 'NVIDIA RTX 3060 GPUs', 'Linux and Windows dual boot'],
        experiments: ['Machine learning model training', 'Computer vision exercises', 'Parallel computing practicals'],
        courses: ['Artificial Intelligence & Machine Learning', 'Deep Learning', 'High Performance Computing'],
        incharge: 'Department AI Lab In-charge',
      }),
      lab('Full-Stack Software Development Lab', 'Software Engineering', 'Modern software development environment for web and application engineering.', {
        equipment: ['Intel Core i5 workstations', '16 GB RAM', 'VS Code', 'Node.js, Python and Docker'],
        experiments: ['Web application development', 'REST API design', 'Containerized deployment'],
        courses: ['Full-Stack Web Development', 'Software Engineering', 'Object Oriented Programming'],
      }),
      lab('Cisco Networking & Cloud Lab', 'Networks & Cloud', 'Networking and cloud infrastructure laboratory with industry-standard equipment.', {
        equipment: ['Cisco routers and switches', 'Packet Tracer', 'AWS / Azure sandbox access'],
        experiments: ['Routing and switching configuration', 'Network troubleshooting', 'Cloud resource provisioning'],
        courses: ['Computer Networks', 'Cloud Computing Services', 'Network Security'],
      }),
      lab('Data Engineering & Analytics Lab', 'Data Science', 'Data engineering and analytics facility for big data coursework and projects.', {
        equipment: ['Hadoop cluster nodes', 'Apache Spark', 'Tableau', 'R Studio', 'MongoDB'],
        experiments: ['Data pipeline construction', 'Large-scale data analysis', 'Dashboard development'],
        courses: ['Big Data Analytics', 'Database Management Systems', 'Data Mining'],
      }),
      lab('Open Source Software Lab', 'Computing', 'Linux-based laboratory for open-source tools and systems programming.', {
        equipment: ['Ubuntu Linux workstations', 'Git', 'MySQL', 'Java', 'GCC toolchain'],
        experiments: ['Shell scripting', 'Database design', 'Open-source contribution workflows'],
        courses: ['Operating Systems', 'Database Management Systems', 'Programming in C'],
      }),
      lab('Project & R&D Research Lab', 'Research', 'Project and research workspace for final-year and doctoral work.', {
        equipment: ['High-performance GPU workstations', 'IoT kits', 'Raspberry Pi 4 boards'],
        experiments: ['Prototype development', 'IoT system integration', 'Research experimentation'],
        courses: ['Mini Project with Seminar', 'Project Work', 'Research Methodology'],
      }),
    ],
    curriculum: {
      programmes: [
        {
          id: 'be',
          name: 'B.E. Computer Science and Engineering',
          degree: 'B.E.',
          duration: '4 Years',
          regulations: [
            {
              year: '2026',
              semesters: [
                semester(1, 21, ['Professional English', 'Engineering Mathematics I', 'Engineering Physics', 'Problem Solving with Python', 'Python Programming Lab']),
                semester(2, 22, ['Technical English', 'Discrete Mathematics', 'Programming in C', 'Digital Principles & System Design', 'C Programming Lab']),
                semester(3, 24, ['Data Structures', 'Database Management Systems', 'Object Oriented Programming (Java)', 'Computer Organization', 'Data Structures Lab']),
                semester(4, 23, ['Design & Analysis of Algorithms', 'Operating Systems', 'Software Engineering', 'Theory of Computation', 'OS & DBMS Lab']),
                semester(5, 22, ['Computer Networks', 'Microprocessors & Microcontrollers', 'Full-Stack Web Development', 'Professional Elective I', 'Networks Lab']),
                semester(6, 21, ['Artificial Intelligence & Machine Learning', 'Compiler Design', 'Cryptography & Network Security', 'Professional Elective II', 'AI & ML Lab']),
                semester(7, 20, ['Cloud Computing Services', 'Big Data Analytics', 'Open Elective II', 'Professional Elective III', 'Mini Project with Seminar']),
                semester(8, 16, ['Professional Ethics in Engineering', 'Industry Internship / Project Work Phase II']),
              ],
            },
          ],
          resources: [
            { label: 'Academic Regulations', to: '/academics/regulations' },
            { label: 'Curriculum Framework', to: '/academics/curriculum' },
            { label: 'Examination Guidelines', to: '/academics/coe' },
          ],
        },
      ],
    },
    association: {
      name: 'MAGNUMOPUS — CSE Association',
      purpose: 'A student-led forum that promotes technical learning, innovation and professional development.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Hackersbay (Cybersecurity)', 'PyLamp (Python Programming)', 'Tech Crew (Web & Mobile)', 'Data Pirates (Analytics)', 'Mindcraft AI (Deep Learning)'],
    },
    events: [
      { id: 'cse-symposium', title: 'National Level Technical Symposium', category: 'Technical Events', date: '', venue: '', description: 'Annual technical symposium with paper presentations, coding contests and industry talks.', organizer: 'MAGNUMOPUS — CSE Association', status: 'Annual activity', image: '' },
      { id: 'cse-codesprint', title: '24-Hour CodeSprint Hackathon', category: 'Technical Events', date: '', venue: '', description: 'Team-based hackathon focused on rapid prototyping and problem solving.', organizer: 'MAGNUMOPUS — CSE Association', status: 'Annual activity', image: '' },
      { id: 'cse-alumni', title: 'Alumni Mentorship Workshops', category: 'Professional Development', date: '', venue: '', description: 'Sessions with alumni on career pathways, higher studies and industry practice.', organizer: 'MAGNUMOPUS — CSE Association', status: 'Annual activity', image: '' },
      { id: 'cse-expert', title: 'Industry Expert Lecture Series', category: 'Industrial Exposure', date: '', venue: '', description: 'Guest lectures by industry practitioners on current computing technologies.', organizer: 'MAGNUMOPUS — CSE Association', status: 'Annual activity', image: '' },
    ],
    achievements: [],
    placements: {
      years: [
        { year: 'Latest recorded', eligible: null, placed: null, percentage: '96%', recruiters: 8, internships: null, highestPackage: '₹24.0 LPA', averagePackage: '₹7.2 LPA' },
      ],
      recruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Deloitte', 'Accenture', 'Qualcomm', 'IBM'].map((name) => ({ name, industry: '', year: '', website: '' })),
      reports: [],
    },
  },

  it: {
    contentStatus: 'published',
    established: 2002,
    intakeUG: 120,
    intakePG: 0,
    tagline: 'Engineering secure, scalable and industry-ready information systems.',
    overview:
      'The Department of Information Technology was started in 2002. With dedicated faculty, state-of-the-art computational facilities and a curriculum synchronized with industry demands, IT students regularly achieve top placements and academic honours.',
    objectives: [
      'Provide a strong foundation in information technology and computing systems.',
      'Develop skills in networking, cloud infrastructure and information security.',
      'Encourage project-based learning and industry collaboration.',
    ],
    academicFocus: ['Web & Mobile Technologies', 'Cloud Computing', 'Information Security', 'Data Management'],
    researchAreas: ['Cloud & Edge Computing', 'Information Security', 'Data Science', 'Internet of Things'],
    industryInteraction: ['Internships and industry projects', 'Cloud and security workshops', 'Placement partnerships'],
    vision:
      'To achieve academic excellence in Information Technology and produce competent IT professionals committed to ethical values and societal well-being.',
    mission: [
      'Imparting quality technical education in Information Technology with industry relevance.',
      'Fostering innovative research and project-based experiential learning.',
      'Inculcating managerial capabilities and professional ethics for sustainable career growth.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Demonstrate strong competence in information technology tools, networking and cloud applications.' },
      { id: 'PEO 2', text: 'Design and implement secure, scalable software systems for global organizations.' },
      { id: 'PEO 3', text: 'Pursue advanced studies, research or entrepreneurial ventures with continuous learning.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Develop and deploy web, mobile and cloud-based applications.' },
      { id: 'PSO 2', text: 'Secure information systems using modern security practices and tools.' },
      { id: 'PSO 3', text: 'Manage and analyze organizational data for informed decision making.' },
    ],
    programmes: [
      programme('be', 'B.E. Information Technology', 'B.E.', '4 Years', 120, 'Undergraduate programme covering software, networking, cloud and security foundations.', 'Industry-aligned curriculum'),
      programme('phd', 'Ph.D. in Information Technology', 'Ph.D.', '3+ Years', null, 'Doctoral research programme in information technology and related areas.', ''),
    ],
    labs: [
      lab('Information Systems & Cloud Lab', 'Cloud & Systems', 'Laboratory for information systems and cloud platform practicals.', {
        equipment: ['Intel Core i5 workstations', '16 GB RAM', 'AWS cloud tools'],
        experiments: ['Cloud service provisioning', 'Information system design', 'Virtualization exercises'],
        courses: ['Cloud Computing', 'Information Systems', 'Operating Systems'],
      }),
      lab('Mobile Application & Web Lab', 'Software Development', 'Facility for mobile and web application development.', {
        equipment: ['Android Studio', 'Flutter', 'React', 'Node.js'],
        experiments: ['Responsive web development', 'Cross-platform mobile apps', 'API integration'],
        courses: ['Web Technology', 'Mobile Computing', 'Software Engineering'],
      }),
      lab('Cyber Security & Network Lab', 'Networks & Security', 'Network security laboratory with monitoring and simulation tools.', {
        equipment: ['Wireshark', 'Kali Linux', 'Snort', 'Cisco Packet Tracer'],
        experiments: ['Network traffic analysis', 'Vulnerability assessment', 'Firewall configuration'],
        courses: ['Information Security', 'Computer Networks', 'Cryptography'],
      }),
    ],
    curriculum: {
      programmes: [
        {
          id: 'be',
          name: 'B.E. Information Technology',
          degree: 'B.E.',
          duration: '4 Years',
          regulations: [
            {
              year: '2026',
              semesters: [
                semester(1, 21, ['Communicative English', 'Calculus & Linear Algebra', 'Applied Physics', 'C Programming', 'Programming Lab']),
                semester(2, 22, ['Technical Communication', 'Probability & Statistics', 'Data Structures', 'Digital Logic Design', 'Data Structures Lab']),
                semester(3, 23, ['Object Oriented Programming', 'Database Systems', 'Computer Architecture', 'Software Engineering', 'DBMS Lab']),
                semester(4, 22, ['Web Technology', 'Design of Algorithms', 'Operating Systems', 'Microcontrollers', 'Web Technology Lab']),
              ],
            },
          ],
          resources: [
            { label: 'Academic Regulations', to: '/academics/regulations' },
            { label: 'Curriculum Framework', to: '/academics/curriculum' },
          ],
        },
      ],
    },
    association: {
      name: 'INFOBLITZ — IT Students Association',
      purpose: 'A student forum for technical events, workshops and peer learning in information technology.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['App Development Club', 'Cyber Defense Guild', 'Open Source Innovators'],
    },
    events: [
      { id: 'it-infoquest', title: 'InfoQuest Tech Fest', category: 'Technical Events', date: '', venue: '', description: 'Annual IT festival with technical contests and project showcases.', organizer: 'INFOBLITZ — IT Students Association', status: 'Annual activity', image: '' },
      { id: 'it-webdesign', title: 'Web Design Challenge', category: 'Technical Events', date: '', venue: '', description: 'Design and development competition for web interfaces and applications.', organizer: 'INFOBLITZ — IT Students Association', status: 'Annual activity', image: '' },
      { id: 'it-bugbounty', title: 'Bug Bounty Workshop', category: 'Professional Development', date: '', venue: '', description: 'Hands-on workshop on security testing and responsible disclosure.', organizer: 'INFOBLITZ — IT Students Association', status: 'Annual activity', image: '' },
    ],
    achievements: [],
    placements: {
      years: [
        { year: 'Latest recorded', eligible: null, placed: null, percentage: '94%', recruiters: 6, internships: null, highestPackage: '₹18.0 LPA', averagePackage: '₹6.4 LPA' },
      ],
      recruiters: ['Microsoft', 'Amazon', 'Adobe', 'Deloitte', 'IBM', 'Accenture'].map((name) => ({ name, industry: '', year: '', website: '' })),
      reports: [],
    },
  },

  ece: {
    contentStatus: 'published',
    established: 2001,
    intakeUG: 180,
    intakePG: 18,
    tagline: 'Advancing electronics, communication and embedded systems.',
    overview:
      'The Department of Electronics and Communication Engineering was established in 2001 and is professionally accredited. The department houses VLSI design tools, DSP processors, RF and microwave lab equipment and embedded system workstations.',
    objectives: [
      'Build strong fundamentals in electronics, signals and communication systems.',
      'Provide hands-on experience in VLSI, embedded systems and RF engineering.',
      'Prepare graduates for core electronics industries and higher studies.',
    ],
    academicFocus: ['VLSI Design', 'Embedded Systems', 'Communication Systems', 'Signal Processing'],
    researchAreas: ['VLSI & FPGA Design', 'Wireless Communication', 'Embedded & IoT Systems', 'Biomedical Signal Processing'],
    industryInteraction: ['Core electronics internships', 'VLSI and embedded workshops', 'Industry certification programmes'],
    vision:
      'To emerge as a centre of excellence in electronics and communication engineering by nurturing technically competent, ethically strong and innovative graduates.',
    mission: [
      'Providing state-of-the-art laboratory facilities and learning environments.',
      'Bridging the industry-academia gap through collaborative projects and internships.',
      'Inspiring creative research and ethical engineering practices.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply technical expertise in core electronics, signal processing and communication systems.' },
      { id: 'PEO 2', text: 'Design VLSI and embedded solutions meeting modern industrial standards.' },
      { id: 'PEO 3', text: 'Exhibit leadership, ethical standards and effective communication in global engineering teams.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Design and verify digital and analog circuits using industry-standard EDA tools.' },
      { id: 'PSO 2', text: 'Develop embedded and IoT systems for real-world applications.' },
      { id: 'PSO 3', text: 'Analyze and design communication systems including RF and optical links.' },
    ],
    programmes: [
      programme('be', 'B.E. Electronics and Communication Engineering', 'B.E.', '4 Years', 180, 'Undergraduate programme in electronics, communication, VLSI and embedded systems.', 'Professionally accredited programme'),
      programme('me', 'M.E. Electronics and Communication Engineering', 'M.E.', '2 Years', 18, 'Postgraduate programme with advanced coursework and a supervised dissertation.', ''),
      programme('phd', 'Ph.D. in Electronics and Communication Engineering', 'Ph.D.', '3+ Years', null, 'Doctoral research programme in electronics and communication.', ''),
    ],
    labs: [
      lab('VLSI Design & Cadence Lab', 'VLSI Design', 'Digital and analog VLSI design laboratory with industry EDA tools.', {
        equipment: ['Cadence EDA suite', 'Xilinx Vivado', 'FPGA development kits'],
        experiments: ['CMOS circuit design', 'FPGA prototyping', 'Timing and power analysis'],
        courses: ['VLSI Design', 'Digital Electronics', 'ASIC Design'],
      }),
      lab('Embedded Systems & IoT Lab', 'Embedded Systems', 'Embedded systems and IoT prototyping facility.', {
        equipment: ['ARM Cortex kits', 'Arduino boards', 'NodeMCU', 'PIC microcontrollers'],
        experiments: ['Microcontroller programming', 'Sensor interfacing', 'IoT system integration'],
        courses: ['Microprocessors & Microcontrollers', 'Embedded Systems', 'Internet of Things'],
      }),
      lab('RF, Microwave & Optical Lab', 'Communication Systems', 'RF, microwave and optical communication laboratory.', {
        equipment: ['Spectrum analyzers', 'Microwave benches', 'Optical fibre kits'],
        experiments: ['Antenna measurements', 'Microwave component characterization', 'Optical link testing'],
        courses: ['Communication Theory', 'RF and Microwave Engineering', 'Optical Communication'],
      }),
    ],
    curriculum: {
      programmes: [
        {
          id: 'be',
          name: 'B.E. Electronics and Communication Engineering',
          degree: 'B.E.',
          duration: '4 Years',
          regulations: [
            {
              year: '2026',
              semesters: [
                semester(1, 21, ['Professional English', 'Calculus', 'Engineering Physics', 'Engineering Chemistry', 'Basics of EEE']),
                semester(2, 22, ['Circuit Analysis', 'Electronic Devices', 'Engineering Graphics', 'Physics & Chemistry Lab']),
                semester(3, 23, ['Electronic Circuits I', 'Signals and Systems', 'Digital Electronics', 'Linear Integrated Circuits']),
                semester(4, 23, ['Electronic Circuits II', 'Electromagnetic Fields', 'Communication Theory', 'Microprocessors']),
              ],
            },
          ],
          resources: [
            { label: 'Academic Regulations', to: '/academics/regulations' },
            { label: 'Curriculum Framework', to: '/academics/curriculum' },
          ],
        },
      ],
    },
    association: {
      name: 'CENACTIV — ECE Association',
      purpose: 'A departmental association promoting electronics, robotics and communication activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Robotics & Automation Club', 'VLSI Design Guild', 'Ham Radio & Wireless Club'],
    },
    events: [
      { id: 'ece-electrowiz', title: 'Electrowiz Symposium', category: 'Technical Events', date: '', venue: '', description: 'Annual electronics symposium with technical paper presentations and contests.', organizer: 'CENACTIV — ECE Association', status: 'Annual activity', image: '' },
      { id: 'ece-robotics', title: 'Line Follower Robotics Contest', category: 'Technical Events', date: '', venue: '', description: 'Robotics competition for design, build and race challenges.', organizer: 'CENACTIV — ECE Association', status: 'Annual activity', image: '' },
      { id: 'ece-pcb', title: 'PCB Design Bootcamp', category: 'Professional Development', date: '', venue: '', description: 'Hands-on training in schematic capture and PCB layout.', organizer: 'CENACTIV — ECE Association', status: 'Annual activity', image: '' },
    ],
    achievements: [],
    placements: {
      years: [
        { year: 'Latest recorded', eligible: null, placed: null, percentage: '95%', recruiters: 6, internships: null, highestPackage: '₹20.0 LPA', averagePackage: '₹6.8 LPA' },
      ],
      recruiters: ['Qualcomm', 'Bosch', 'Texas Instruments', 'Siemens', 'NVIDIA', 'Analog Devices'].map((name) => ({ name, industry: '', year: '', website: '' })),
      reports: [],
    },
  },

  aids: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Applying artificial intelligence and data science to real-world problems.',
    overview:
      'The Department of Artificial Intelligence and Data Science focuses on intelligent systems, data-driven decision making and applied machine learning. The curriculum blends computing fundamentals with statistics, analytics and AI engineering.',
    objectives: [
      'Build foundations in AI, machine learning and data science.',
      'Develop skills to collect, process and analyze large datasets.',
      'Apply intelligent systems to industry and societal problems.',
    ],
    academicFocus: ['Machine Learning', 'Data Analytics', 'Deep Learning', 'Natural Language Processing'],
    researchAreas: ['Applied Machine Learning', 'Computer Vision', 'Data Engineering', 'Responsible AI'],
    industryInteraction: ['AI project internships', 'Analytics workshops', 'Industry mentorship'],
    vision:
      'To develop skilled AI and data science professionals who apply intelligent technologies responsibly for societal benefit.',
    mission: [
      'Provide strong foundations in artificial intelligence, statistics and data engineering.',
      'Promote applied research and industry collaboration in AI and analytics.',
      'Instil ethical and responsible use of data and intelligent systems.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply AI and data science techniques to solve practical problems.' },
      { id: 'PEO 2', text: 'Design data-driven systems with sound statistical and computational foundations.' },
      { id: 'PEO 3', text: 'Communicate insights and work ethically in multidisciplinary teams.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Build machine learning and deep learning models for real-world datasets.' },
      { id: 'PSO 2', text: 'Design data pipelines and analytics dashboards.' },
      { id: 'PSO 3', text: 'Apply AI responsibly with awareness of privacy and bias.' },
    ],
    labs: [
      lab('Artificial Intelligence Lab', 'AI & Machine Learning', 'Laboratory for artificial intelligence and intelligent systems practicals.'),
      lab('Data Science & Analytics Lab', 'Data Science', 'Analytics workspace for statistics, visualization and data mining.'),
      lab('Machine Learning & Deep Learning Lab', 'AI & Machine Learning', 'GPU-enabled facility for machine learning and deep learning experiments.'),
      lab('Big Data Computing Lab', 'Data Engineering', 'Distributed computing facility for large-scale data processing.'),
    ],
    association: {
      name: 'AI&DS Department Association',
      purpose: 'Student forum for AI, analytics and data science activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['AI Research Club', 'Data Analytics Club', 'Kaggle & Open Data Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  aiml: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Engineering intelligent systems with machine learning.',
    overview:
      'The Department of Artificial Intelligence and Machine Learning prepares students to design, train and deploy intelligent systems. The programme emphasizes mathematical foundations, model development and responsible AI practice.',
    objectives: [
      'Develop strong foundations in machine learning and neural networks.',
      'Apply AI techniques to vision, language and decision-making problems.',
      'Promote ethical and sustainable AI engineering.',
    ],
    academicFocus: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    researchAreas: ['Neural Networks', 'Computer Vision', 'Speech & Language', 'AI for Social Good'],
    industryInteraction: ['AI internships', 'Research collaborations', 'Industry hackathons'],
    vision:
      'To be a centre for machine learning education and research that produces responsible AI engineers.',
    mission: [
      'Deliver rigorous education in machine learning and intelligent systems.',
      'Encourage research and innovation in AI applications.',
      'Promote ethical, inclusive and sustainable AI practice.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Design and deploy machine learning models for practical applications.' },
      { id: 'PEO 2', text: 'Apply AI techniques across vision, language and data-driven domains.' },
      { id: 'PEO 3', text: 'Work ethically and collaboratively in interdisciplinary AI teams.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Develop and evaluate supervised and unsupervised learning models.' },
      { id: 'PSO 2', text: 'Build deep learning solutions for vision and language tasks.' },
      { id: 'PSO 3', text: 'Deploy AI models responsibly with attention to fairness and privacy.' },
    ],
    labs: [
      lab('Machine Learning Lab', 'AI & Machine Learning', 'Laboratory for core machine learning practicals and projects.'),
      lab('Deep Learning & Neural Networks Lab', 'AI & Machine Learning', 'GPU workstations for deep learning experimentation.'),
      lab('Computer Vision Lab', 'AI & Machine Learning', 'Facility for image processing and computer vision projects.'),
      lab('Natural Language Processing Lab', 'AI & Machine Learning', 'Workspace for text analytics and language technology.'),
    ],
    association: {
      name: 'AI&ML Department Association',
      purpose: 'Student forum for machine learning research and innovation.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Deep Learning Club', 'Computer Vision Club', 'AI Ethics Forum'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  eee: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Powering sustainable electrical and energy systems.',
    overview:
      'The Department of Electrical and Electronics Engineering focuses on electrical machines, power systems, control engineering and power electronics. Students gain practical experience in generation, transmission, distribution and automation.',
    objectives: [
      'Build strong foundations in electrical engineering and energy systems.',
      'Provide practical experience in machines, power and control.',
      'Promote sustainable and efficient energy technologies.',
    ],
    academicFocus: ['Electrical Machines', 'Power Systems', 'Control Systems', 'Power Electronics'],
    researchAreas: ['Renewable Energy', 'Smart Grids', 'Electric Vehicles', 'Industrial Automation'],
    industryInteraction: ['Power sector internships', 'Automation workshops', 'Energy industry visits'],
    vision:
      'To produce competent electrical engineers who contribute to sustainable energy and automation.',
    mission: [
      'Deliver quality education in electrical and electronics engineering.',
      'Promote research in energy, control and power electronics.',
      'Encourage professional ethics and lifelong learning.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply electrical engineering fundamentals to power and energy systems.' },
      { id: 'PEO 2', text: 'Design and analyze machines, converters and control systems.' },
      { id: 'PEO 3', text: 'Contribute to sustainable energy solutions with professional responsibility.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Analyze and operate electrical machines and power systems.' },
      { id: 'PSO 2', text: 'Design power electronic converters and control schemes.' },
      { id: 'PSO 3', text: 'Apply automation and renewable energy technologies.' },
    ],
    labs: [
      lab('Electrical Machines Lab', 'Electrical Machines', 'Laboratory for testing and analysis of electrical machines.'),
      lab('Power Systems Lab', 'Power Systems', 'Facility for power system simulation and protection studies.'),
      lab('Control Systems Lab', 'Control Systems', 'Laboratory for control theory and automation experiments.'),
      lab('Power Electronics Lab', 'Power Electronics', 'Workspace for converter and drive experiments.'),
    ],
    association: {
      name: 'EEE Department Association',
      purpose: 'Student forum for electrical engineering and energy activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Renewable Energy Club', 'Automation Club', 'Electric Vehicle Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  mech: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Designing, manufacturing and sustaining modern machines.',
    overview:
      'The Department of Mechanical Engineering covers design, manufacturing, thermal sciences and materials. Students develop hands-on skills through workshops, simulation laboratories and industry-oriented projects.',
    objectives: [
      'Build strong foundations in mechanics, design and manufacturing.',
      'Provide practical experience in thermal, fluid and materials engineering.',
      'Promote sustainable and industry-ready mechanical engineering practice.',
    ],
    academicFocus: ['Manufacturing Technology', 'Thermal Engineering', 'Fluid Mechanics', 'CAD/CAM'],
    researchAreas: ['Advanced Manufacturing', 'Thermal Systems', 'Materials Engineering', 'Robotics & Automation'],
    industryInteraction: ['Manufacturing internships', 'CAD/CAM training', 'Industry visits'],
    vision:
      'To develop competent mechanical engineers who design sustainable and efficient engineering systems.',
    mission: [
      'Provide quality education in mechanical engineering fundamentals and applications.',
      'Promote research and innovation in manufacturing and thermal systems.',
      'Instil professional ethics, teamwork and lifelong learning.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply mechanical engineering fundamentals to design and manufacturing problems.' },
      { id: 'PEO 2', text: 'Analyze thermal, fluid and structural systems using modern tools.' },
      { id: 'PEO 3', text: 'Contribute to sustainable engineering practice with professional responsibility.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Design machine components and manufacturing processes.' },
      { id: 'PSO 2', text: 'Analyze thermal and fluid systems for engineering applications.' },
      { id: 'PSO 3', text: 'Use CAD/CAM and simulation tools for product development.' },
    ],
    labs: [
      lab('Manufacturing Technology Lab', 'Manufacturing', 'Laboratory for machining, forming and manufacturing processes.'),
      lab('Thermal Engineering Lab', 'Thermal Sciences', 'Facility for IC engines, heat transfer and thermodynamics experiments.'),
      lab('Fluid Mechanics Lab', 'Fluid Sciences', 'Laboratory for fluid flow and hydraulic machinery experiments.'),
      lab('CAD/CAM Lab', 'Design & Simulation', 'Workstation laboratory for computer-aided design and manufacturing.'),
      lab('Metrology Lab', 'Measurements', 'Precision measurement and inspection laboratory.'),
      lab('Materials Testing Lab', 'Materials', 'Facility for mechanical testing of engineering materials.'),
    ],
    association: {
      name: 'MECH Department Association',
      purpose: 'Student forum for mechanical engineering design and manufacturing activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['SAE Collegiate Club', 'CAD/CAM Club', 'Robotics Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  civil: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Building safe, sustainable and resilient infrastructure.',
    overview:
      'The Department of Civil Engineering addresses structural, geotechnical, environmental and transportation engineering. Students learn to plan, design and manage infrastructure with an emphasis on safety and sustainability.',
    objectives: [
      'Build strong foundations in structural and construction engineering.',
      'Provide practical experience in surveying, materials and environmental engineering.',
      'Promote sustainable infrastructure development.',
    ],
    academicFocus: ['Structural Engineering', 'Geotechnical Engineering', 'Environmental Engineering', 'Surveying'],
    researchAreas: ['Sustainable Construction', 'Structural Health Monitoring', 'Water & Environment', 'Transportation Systems'],
    industryInteraction: ['Construction site internships', 'Surveying field training', 'Infrastructure industry visits'],
    vision:
      'To develop civil engineers who create safe, sustainable and resilient infrastructure for society.',
    mission: [
      'Provide quality education in civil engineering theory and practice.',
      'Promote research in sustainable materials and infrastructure systems.',
      'Encourage ethical and socially responsible engineering.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply civil engineering fundamentals to analyze and design infrastructure.' },
      { id: 'PEO 2', text: 'Plan and manage construction projects with safety and sustainability.' },
      { id: 'PEO 3', text: 'Serve society through ethical and responsible engineering practice.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Analyze and design structural and geotechnical systems.' },
      { id: 'PSO 2', text: 'Apply surveying and construction management techniques.' },
      { id: 'PSO 3', text: 'Address environmental and sustainability challenges in infrastructure.' },
    ],
    labs: [
      lab('Concrete Technology Lab', 'Materials', 'Laboratory for concrete mix design and testing.'),
      lab('Surveying Lab', 'Surveying', 'Field and laboratory facility for surveying practice.'),
      lab('Geotechnical Engineering Lab', 'Geotechnical', 'Soil testing and geotechnical investigation laboratory.'),
      lab('Environmental Engineering Lab', 'Environmental', 'Water and wastewater analysis laboratory.'),
      lab('Structural Analysis Lab', 'Structures', 'Facility for structural modeling and testing.'),
    ],
    association: {
      name: 'CIVIL Department Association',
      purpose: 'Student forum for civil engineering and infrastructure activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['ICI Student Chapter', 'Sustainable Construction Club', 'Surveying Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  bme: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Engineering technology for better healthcare.',
    overview:
      'The Department of Bio-Medical Engineering combines engineering principles with medical and biological sciences. Students work with biomedical instrumentation, medical imaging and biomaterials to support healthcare technology.',
    objectives: [
      'Build foundations in biomedical instrumentation and biomechanics.',
      'Provide practical experience with medical devices and imaging systems.',
      'Promote ethical and safe biomedical engineering practice.',
    ],
    academicFocus: ['Biomedical Instrumentation', 'Medical Imaging', 'Biomechanics', 'Biomaterials'],
    researchAreas: ['Medical Devices', 'Biomedical Signal Processing', 'Biomaterials', 'Rehabilitation Engineering'],
    industryInteraction: ['Hospital and MedTech internships', 'Medical device workshops', 'Healthcare industry visits'],
    vision:
      'To develop biomedical engineers who improve healthcare through safe and innovative technology.',
    mission: [
      'Provide quality education at the interface of engineering and medicine.',
      'Promote research in medical devices and healthcare technologies.',
      'Instil ethical responsibility in biomedical engineering practice.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply engineering principles to biomedical and healthcare problems.' },
      { id: 'PEO 2', text: 'Design and analyze biomedical instrumentation and imaging systems.' },
      { id: 'PEO 3', text: 'Work ethically with healthcare professionals and diverse teams.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Design and maintain biomedical instrumentation systems.' },
      { id: 'PSO 2', text: 'Apply signal and image processing to medical data.' },
      { id: 'PSO 3', text: 'Evaluate biomaterials and devices for safety and efficacy.' },
    ],
    labs: [
      lab('Biomedical Instrumentation Lab', 'Biomedical', 'Laboratory for biomedical device and instrumentation practicals.'),
      lab('Biomechanics Lab', 'Biomechanics', 'Facility for biomechanics and human movement analysis.'),
      lab('Medical Imaging Lab', 'Imaging', 'Workspace for medical image processing and analysis.'),
      lab('Biomaterials Lab', 'Materials', 'Laboratory for biomaterials characterization and testing.'),
    ],
    association: {
      name: 'BME Department Association',
      purpose: 'Student forum for biomedical engineering and healthcare technology.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['MedTech Club', 'BioSignal Club', 'Healthcare Innovation Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  mde: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Electronics for diagnostics, monitoring and care.',
    overview:
      'The Department of Medical Electronics focuses on electronic systems used in diagnosis, monitoring and treatment. The programme combines electronics, embedded systems and signal processing with clinical applications.',
    objectives: [
      'Build foundations in electronics and medical instrumentation.',
      'Provide practical experience in diagnostic and monitoring devices.',
      'Promote safe and reliable medical electronic systems.',
    ],
    academicFocus: ['Medical Electronics', 'Embedded Systems', 'Signal Processing', 'Diagnostic Devices'],
    researchAreas: ['Wearable Health Devices', 'Medical Signal Processing', 'Embedded Healthcare Systems', 'Telemedicine'],
    industryInteraction: ['MedTech internships', 'Device design workshops', 'Hospital technology visits'],
    vision:
      'To produce medical electronics engineers who advance healthcare through reliable electronic technology.',
    mission: [
      'Provide quality education in medical electronics and embedded systems.',
      'Promote research in diagnostic and monitoring technologies.',
      'Instil safety, ethics and reliability in medical device engineering.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply electronics and embedded systems to medical applications.' },
      { id: 'PEO 2', text: 'Design and maintain diagnostic and monitoring devices.' },
      { id: 'PEO 3', text: 'Work responsibly within healthcare and engineering teams.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Develop embedded systems for medical monitoring.' },
      { id: 'PSO 2', text: 'Process biomedical signals for diagnosis and analysis.' },
      { id: 'PSO 3', text: 'Ensure safety and reliability of medical electronic equipment.' },
    ],
    labs: [
      lab('Medical Electronics Lab', 'Medical Electronics', 'Laboratory for medical electronic circuit and device practicals.'),
      lab('Embedded Medical Systems Lab', 'Embedded Systems', 'Workspace for embedded healthcare system development.'),
      lab('Diagnostic Equipment Lab', 'Diagnostics', 'Facility for diagnostic and monitoring equipment study.'),
      lab('Signal Processing Lab', 'Signal Processing', 'Laboratory for biomedical signal analysis.'),
    ],
    association: {
      name: 'MDE Department Association',
      purpose: 'Student forum for medical electronics and healthcare technology.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Medical Devices Club', 'Embedded Health Club', 'Signal Processing Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  mba: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Developing responsible business leaders.',
    overview:
      'The Department of Management Studies offers a professional management programme focused on strategy, finance, marketing, operations and entrepreneurship. Students develop analytical and leadership capabilities for modern organizations.',
    objectives: [
      'Build strong foundations in management theory and practice.',
      'Develop analytical, communication and leadership skills.',
      'Promote ethical and sustainable business decision making.',
    ],
    academicFocus: ['Strategy & Leadership', 'Finance', 'Marketing', 'Operations Management'],
    researchAreas: ['Business Analytics', 'Entrepreneurship', 'Financial Markets', 'Sustainable Business'],
    industryInteraction: ['Corporate internships', 'Case competitions', 'Industry mentorship'],
    vision:
      'To develop responsible business leaders who create sustainable value for organizations and society.',
    mission: [
      'Provide quality management education grounded in practice.',
      'Promote research and industry collaboration in management.',
      'Instil ethical leadership and social responsibility.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply management concepts to real business situations.' },
      { id: 'PEO 2', text: 'Lead teams and communicate effectively in organizations.' },
      { id: 'PEO 3', text: 'Make ethical and sustainable business decisions.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Analyze business problems using quantitative and qualitative methods.' },
      { id: 'PSO 2', text: 'Develop strategies for growth and operational efficiency.' },
      { id: 'PSO 3', text: 'Apply entrepreneurial and ethical leadership practices.' },
    ],
    programmes: [
      programme('mba', 'Master of Business Administration (MBA)', 'MBA', '2 Years', null, 'Professional postgraduate management programme with core and elective specializations.', 'Industry-aligned curriculum'),
    ],
    labs: [
      lab('Business Analytics Lab', 'Analytics', 'Computer laboratory for business analytics and data-driven decision making.'),
      lab('Finance & Trading Lab', 'Finance', 'Facility for financial modeling, markets and trading simulations.'),
      lab('Case Study & Discussion Studio', 'Management', 'Workspace for case discussions, group work and presentations.'),
    ],
    association: {
      name: 'MBA Department Association',
      purpose: 'Student forum for management learning, case competitions and industry interaction.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Finance Club', 'Marketing Club', 'Entrepreneurship Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },

  sh: {
    contentStatus: 'draft',
    established: null,
    intakeUG: null,
    intakePG: null,
    tagline: 'Building the scientific and human foundations of engineering.',
    overview:
      'The Department of Science and Humanities provides foundational education in mathematics, physics, chemistry, communication and management. The department supports all engineering programmes with strong theoretical and practical foundations.',
    objectives: [
      'Deliver strong foundational education in sciences and humanities.',
      'Support interdisciplinary learning across engineering programmes.',
      'Promote communication, ethics and lifelong learning skills.',
    ],
    academicFocus: ['Mathematics', 'Physics', 'Chemistry', 'Communication Skills'],
    researchAreas: ['Applied Mathematics', 'Applied Physics', 'Materials Science', 'Technical Communication'],
    industryInteraction: ['Foundation workshops', 'Communication training', 'Interdisciplinary projects'],
    vision:
      'To provide excellent foundational education that prepares students for advanced engineering study and professional life.',
    mission: [
      'Deliver rigorous foundation courses in sciences, mathematics and humanities.',
      'Support interdisciplinary research and innovation.',
      'Develop communication, ethics and lifelong learning skills.',
    ],
    peos: [
      { id: 'PEO 1', text: 'Apply mathematical and scientific foundations to engineering problems.' },
      { id: 'PEO 2', text: 'Communicate effectively and work in multidisciplinary teams.' },
      { id: 'PEO 3', text: 'Demonstrate ethical awareness and commitment to lifelong learning.' },
    ],
    psos: [
      { id: 'PSO 1', text: 'Apply mathematical and statistical methods to engineering problems.' },
      { id: 'PSO 2', text: 'Use scientific principles and laboratory practice effectively.' },
      { id: 'PSO 3', text: 'Communicate technical ideas clearly and professionally.' },
    ],
    programmes: [],
    labs: [
      lab('Physics Lab', 'Sciences', 'Laboratory for applied physics experiments supporting engineering programmes.'),
      lab('Chemistry Lab', 'Sciences', 'Laboratory for applied chemistry experiments and analysis.'),
      lab('Mathematics & Computing Lab', 'Sciences', 'Computing facility for mathematical modeling and analysis.'),
      lab('Communication Skills Lab', 'Humanities', 'Language and communication practice laboratory.'),
    ],
    association: {
      name: 'Science & Humanities Association',
      purpose: 'Forum for foundation courses, communication and interdisciplinary activities.',
      coordinator: '',
      academicYear: '',
      membership: '',
      bearers: [],
      clubs: ['Science Club', 'Communication Club', 'Mathematics Club'],
    },
    events: [],
    achievements: [],
    placements: null,
  },
};

function buildProgrammes(raw, config) {
  if (Array.isArray(raw.programmes)) {
    return raw.programmes;
  }

  const isManagement = config.category === 'Management';
  if (isManagement) {
    return [
      programme('mba', `Master of Business Administration (${config.code})`, 'MBA', '2 Years', raw.intakePG ?? null, `Postgraduate management programme in ${config.name}.`, 'Industry-aligned curriculum'),
    ];
  }

  return [
    programme('be', `B.E. ${config.name}`, 'B.E.', '4 Years', raw.intakeUG ?? null, `Undergraduate programme in ${config.name}.`, config.accredited ? 'Accredited programme' : 'Industry-aligned curriculum'),
  ];
}

function buildContent(slug, raw, config) {
  const contact = {
    email: `hod${slug}@hit.edu.in`,
    phone: siteConfig.contact.phone,
    office: 'Department Office, Main Academic Block',
    address: siteConfig.contact.address,
  };

  return {
    slug,
    name: config.name,
    code: config.code,
    category: config.category,
    accredited: config.accredited,
    contentStatus: raw.contentStatus ?? 'draft',
    established: raw.established ?? null,
    intakeUG: raw.intakeUG ?? null,
    intakePG: raw.intakePG ?? null,
    tagline: raw.tagline ?? `Academic programmes and research in ${config.name}.`,
    overview: raw.overview ?? '',
    objectives: raw.objectives ?? [],
    academicFocus: raw.academicFocus ?? [],
    researchAreas: raw.researchAreas ?? [],
    industryInteraction: raw.industryInteraction ?? [],
    vision: raw.vision ?? '',
    mission: raw.mission ?? [],
    peos: raw.peos ?? [],
    pos: COMMON_POS,
    psos: raw.psos ?? [],
    goals: raw.goals ?? COMMON_GOALS,
    coreValues: CORE_VALUES,
    labs: raw.labs ?? [],
    programmes: buildProgrammes(raw, config),
    curriculum: raw.curriculum ?? { programmes: [] },
    facilities: raw.facilities ?? DEFAULT_FACILITIES,
    contact: raw.contact ?? contact,
    association: raw.association ?? null,
    events: raw.events ?? [],
    achievements: raw.achievements ?? [],
    placements: raw.placements ?? null,
    preparationResources: PREPARATION_RESOURCES,
  };
}

const CONTENT_BY_SLUG = Object.fromEntries(
  siteConfig.departments.map((config) => {
    const raw = RAW_DEPARTMENTS[config.slug] ?? {};
    return [config.slug, buildContent(config.slug, raw, config)];
  }),
);

export function getDepartmentContent(slug) {
  return CONTENT_BY_SLUG[slug] ?? null;
}

export default CONTENT_BY_SLUG;
