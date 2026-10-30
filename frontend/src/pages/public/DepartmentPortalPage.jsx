import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';
import { API_BASE } from '../../services/api.js';

// Department-specific data
const departmentDetails = {
  cse: {
    name: 'Computer Science and Engineering',
    code: 'CSE',
    established: 2001,
    accredited: true,
    intakeUG: 180,
    intakePG: 18,
    hod: {
      name: 'Dr. S. Jabeen Begum',
      designation: 'Professor & Head of Department',
      qualification: 'M.E., Ph.D.',
      experience: '24+ Years',
      email: 'hodcse@hit.edu.in',
      phone: '+91 80 4718 2300 Ext: 220',
      message:
        'The Department of Computer Science and Engineering aims to impart high-quality education and cutting-edge research opportunities to develop intellectually agile, technically competent, and globally employable IT professionals.',
    },
    overview:
      'The Department of Computer Science and Engineering was established in 2001 and received professional accreditation in 2015. The department offers B.E. (CSE), M.E. (CSE), and Ph.D. research programmes, supported by experienced faculty across academics, research, and industry. Our alumni work at leading global technology firms including Google, Microsoft, Amazon, Meta, and Adobe.',
    vision:
      'To produce competent professionals for a globalized technological society by preparing them to become part of the industry and research organizations in the field of Computer Science and Technology and orient them towards serving the society.',
    mission: [
      'Strengthening the core competence in Computer Science and Engineering through analytical learning and Industry-Institute interaction.',
      'Providing exposure to latest tools and technologies in the core area to design solutions and conduct investigations.',
      'Promoting innovative research-based projects and activities in the emerging areas of technology convergence.',
      'Inculcating professional behavior, strong ethical values, leadership abilities, entrepreneurship skills, and commitment to lifelong learning.',
    ],
    peos: [
      'PEO 1: Excel in professional career and higher education by acquiring solid foundation in mathematical, scientific and engineering fundamentals.',
      'PEO 2: Analyze real-world engineering problems and create innovative software systems using modern computational tools and methodologies.',
      'PEO 3: Exhibit ethical attitude, effective communication skills, multidisciplinary teamwork, and adaptation to emerging technologies through lifelong learning.',
    ],
    facultyList: [
      { name: 'Dr. S. Jabeen Begum', role: 'Professor & HOD', qual: 'M.E., Ph.D.', spec: 'Data Mining, AI' },
      { name: 'Dr. S. Russia', role: 'Professor', qual: 'M.E., Ph.D.', spec: 'Cloud Computing, Networks' },
      { name: 'Dr. K. Gowsic', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Machine Learning, IoT' },
      { name: 'Dr. V. Kavitha', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Cyber Security, Cryptography' },
      { name: 'Dr. C. Kotteeswari', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Image Processing' },
      { name: 'Dr. M. Suresh', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Big Data Analytics' },
      { name: 'Mr. S. Vivekanandan', role: 'Assistant Professor (Sl.Gr)', qual: 'M.E., (Ph.D.)', spec: 'Full Stack Web Dev' },
      { name: 'Ms. K. Mohanapriya', role: 'Assistant Professor (Sr.Gr)', qual: 'M.E.', spec: 'Mobile Computing' },
      { name: 'Ms. S. Nithya', role: 'Assistant Professor (Sr.Gr)', qual: 'M.E.', spec: 'Computer Networks' },
      { name: 'Ms. M. Thilagarani', role: 'Assistant Professor', qual: 'M.Tech', spec: 'Compiler Design' },
    ],
    labs: [
      { name: 'Advanced Computing & AI Lab', pcs: 70, config: 'Intel Core i7, 16GB RAM, RTX 3060, Linux & Windows' },
      { name: 'Full-Stack Software Development Lab', pcs: 65, config: 'Intel Core i5, 16GB RAM, VS Code, Node.js, Python, Docker' },
      { name: 'Cisco Networking & Cloud Lab', pcs: 60, config: 'Cisco Routers, Switches, Packet Tracer, AWS / Azure Sandbox' },
      { name: 'Data Engineering & Analytics Lab', pcs: 60, config: 'Hadoop Clusters, Spark, Tableau, R Studio, MongoDB' },
      { name: 'Open Source Software Lab', pcs: 65, config: 'Ubuntu Linux 24.04 LTS, Git, MySQL, Java, GCC Toolchain' },
      { name: 'Project & R&D Research Lab', pcs: 35, config: 'High-Performance GPU Workstations, IoT Kits, Raspberry Pi 4' },
    ],
    curriculum: [
      { sem: 'Semester I', credits: 21, subjects: ['Professional English', 'Engineering Mathematics I', 'Engineering Physics', 'Problem Solving with Python', 'Python Programming Lab'] },
      { sem: 'Semester II', credits: 22, subjects: ['Technical English', 'Discrete Mathematics', 'Programming in C', 'Digital Principles & System Design', 'C Programming Lab'] },
      { sem: 'Semester III', credits: 24, subjects: ['Data Structures', 'Database Management Systems', 'Object Oriented Programming (Java)', 'Computer Organization', 'Data Structures Lab'] },
      { sem: 'Semester IV', credits: 23, subjects: ['Design & Analysis of Algorithms', 'Operating Systems', 'Software Engineering', 'Theory of Computation', 'OS & DBMS Lab'] },
      { sem: 'Semester V', credits: 22, subjects: ['Computer Networks', 'Microprocessors & Microcontrollers', 'Full-Stack Web Development', 'Professional Elective I', 'Networks Lab'] },
      { sem: 'Semester VI', credits: 21, subjects: ['Artificial Intelligence & Machine Learning', 'Compiler Design', 'Cryptography & Network Security', 'Professional Elective II', 'AI & ML Lab'] },
      { sem: 'Semester VII', credits: 20, subjects: ['Cloud Computing Services', 'Big Data Analytics', 'Open Elective II', 'Professional Elective III', 'Mini Project with Seminar'] },
      { sem: 'Semester VIII', credits: 16, subjects: ['Professional Ethics in Engineering', 'Industry Internship / Project Work Phase II'] },
    ],
    association: {
      name: 'MAGNUMOPUS - CSE Association',
      clubs: ['Hackersbay (Cybersecurity)', 'PyLamp (Python Programming)', 'Tech Crew (Web & Mobile)', 'Data Pirates (Analytics)', 'Mindcraft AI (Deep Learning)'],
      events: ['National Level Technical Symposium', '24-Hour CodeSprint Hackathon', 'Alumni Mentorship Workshops', 'Industry Expert Lecture Series'],
    },
    placements: {
      placedPercentage: '96%',
      highestPackage: '₹24.0 LPA',
      averagePackage: '₹7.2 LPA',
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Deloitte', 'Accenture', 'Qualcomm', 'IBM'],
    },
  },
  it: {
    name: 'Information Technology',
    code: 'IT',
    established: 2002,
    accredited: false,
    intakeUG: 120,
    intakePG: 0,
    hod: {
      name: 'Dr. P. Murugesan',
      designation: 'Professor & Head of Department',
      qualification: 'M.Tech., Ph.D.',
      experience: '21+ Years',
      email: 'hodit@hit.edu.in',
      phone: '+91 80 4718 2300 Ext: 230',
      message: 'Information Technology department prepares engineers to solve challenging problems through modern computing architectures, cloud infrastructure, and cybersecurity solutions.',
    },
    overview: 'The Department of Information Technology was started in the year 2002. With dedicated faculty, state-of-the-art computational facilities, and a curriculum synchronized with industry demands, IT students regularly achieve top placements and academic honors.',
    vision: 'To achieve academic excellence in Information Technology and produce competent IT professionals committed to ethical values and societal well-being.',
    mission: [
      'Imparting quality technical education in Information Technology with industry relevance.',
      'Fostering innovative research and project-based experiential learning.',
      'Inculcating managerial capabilities and professional ethics for sustainable career growth.',
    ],
    peos: [
      'PEO 1: Demonstrate strong competence in information technology tools, networking, and cloud applications.',
      'PEO 2: Design and implement secure, scalable software systems for global organizations.',
      'PEO 3: Pursue advanced studies, research, or entrepreneurial ventures with continuous learning.',
    ],
    facultyList: [
      { name: 'Dr. P. Murugesan', role: 'Professor & HOD', qual: 'M.Tech., Ph.D.', spec: 'Cloud Computing, IoT' },
      { name: 'Dr. R. Mynavathi', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Information Security' },
      { name: 'Mr. C. Saravanan', role: 'Assistant Professor (Sl.Gr)', qual: 'M.E.', spec: 'Web Technologies' },
      { name: 'Ms. T. Premalatha', role: 'Assistant Professor', qual: 'M.E.', spec: 'Data Science' },
    ],
    labs: [
      { name: 'Information Systems & Cloud Lab', pcs: 60, config: 'Intel Core i5, 16GB RAM, AWS Cloud Tools' },
      { name: 'Mobile Application & Web Lab', pcs: 60, config: 'Android Studio, Flutter, React, Node.js' },
      { name: 'Cyber Security & Network Lab', pcs: 60, config: 'Wireshark, Kali Linux, Snort, Cisco Packet Tracer' },
    ],
    curriculum: [
      { sem: 'Semester I', credits: 21, subjects: ['Communicative English', 'Calculus & Linear Algebra', 'Applied Physics', 'C Programming', 'Programming Lab'] },
      { sem: 'Semester II', credits: 22, subjects: ['Technical Communication', 'Probability & Statistics', 'Data Structures', 'Digital Logic Design', 'Data Structures Lab'] },
      { sem: 'Semester III', credits: 23, subjects: ['Object Oriented Programming', 'Database Systems', 'Computer Architecture', 'Software Engineering', 'DBMS Lab'] },
      { sem: 'Semester IV', credits: 22, subjects: ['Web Technology', 'Design of Algorithms', 'Operating Systems', 'Microcontrollers', 'Web Technology Lab'] },
    ],
    association: {
      name: 'INFOBLITZ - IT Students Association',
      clubs: ['App Development Club', 'Cyber Defense Guild', 'Open Source Innovators'],
      events: ['InfoQuest Tech Fest', 'Web Design Challenge', 'Bug Bounty Workshop'],
    },
    placements: {
      placedPercentage: '94%',
      highestPackage: '₹18.0 LPA',
      averagePackage: '₹6.4 LPA',
      topRecruiters: ['Microsoft', 'Amazon', 'Adobe', 'Deloitte', 'IBM', 'Accenture'],
    },
  },
  ece: {
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    established: 2001,
    accredited: true,
    intakeUG: 180,
    intakePG: 18,
    hod: {
      name: 'Dr. M. Nisha Angeline',
      designation: 'Professor & Head of Department',
      qualification: 'M.E., Ph.D.',
      experience: '22+ Years',
      email: 'hodece@hit.edu.in',
      phone: '+91 80 4718 2300 Ext: 240',
      message: 'The ECE department is committed to imparting knowledge in semiconductor technologies, embedded systems, VLSI, and signal processing to prepare students for core electronics industries.',
    },
    overview: 'The Department of Electronics and Communication Engineering was established in 2001 and is professionally accredited. The department houses cutting-edge VLSI design tools, DSP processors, RF and microwave lab equipment, and embedded system workstations.',
    vision: 'To emerge as a center of excellence in electronics and communication engineering by nurturing technically competent, ethically strong, and innovative graduates.',
    mission: [
      'Providing state-of-the-art laboratory facilities and learning environments.',
      'Bridging industry-academia gap through collaborative projects and internships.',
      'Inspiring creative research and ethical engineering practices.',
    ],
    peos: [
      'PEO 1: Apply technical expertise in core electronics, signal processing, and communication systems.',
      'PEO 2: Design VLSI and embedded solutions meeting modern industrial standards.',
      'PEO 3: Exhibit leadership, ethical standards, and effective communication skills in global engineering teams.',
    ],
    facultyList: [
      { name: 'Dr. M. Nisha Angeline', role: 'Professor & HOD', qual: 'M.E., Ph.D.', spec: 'VLSI Design, Signal Processing' },
      { name: 'Dr. K. S. Kausalya Devi', role: 'Professor', qual: 'M.E., Ph.D.', spec: 'Embedded Systems, IoT' },
      { name: 'Dr. S. Mahendrakumar', role: 'Associate Professor', qual: 'M.E., Ph.D.', spec: 'Wireless Communication' },
    ],
    labs: [
      { name: 'VLSI Design & Cadence Lab', pcs: 50, config: 'Cadence EDA Suite, Xilinx Vivado, FPGA Kits' },
      { name: 'Embedded Systems & IoT Lab', pcs: 55, config: 'ARM Cortex Kits, Arduino, NodeMCU, PIC Microcontrollers' },
      { name: 'RF, Microwave & Optical Lab', pcs: 45, config: 'Spectrum Analyzers, Microwave Benches, Optical Fibres' },
    ],
    curriculum: [
      { sem: 'Semester I', credits: 21, subjects: ['Professional English', 'Calculus', 'Engineering Physics', 'Engineering Chemistry', 'Basics of EEE'] },
      { sem: 'Semester II', credits: 22, subjects: ['Circuit Analysis', 'Electronic Devices', 'Engineering Graphics', 'Physics & Chemistry Lab'] },
      { sem: 'Semester III', credits: 23, subjects: ['Electronic Circuits I', 'Signals and Systems', 'Digital Electronics', 'Linear Integrated Circuits'] },
      { sem: 'Semester IV', credits: 23, subjects: ['Electronic Circuits II', 'Electromagnetic Fields', 'Communication Theory', 'Microprocessors'] },
    ],
    association: {
      name: 'CENACTIV - ECE Association',
      clubs: ['Robotics & Automation Club', 'VLSI Design Guild', 'Ham Radio & Wireless Club'],
      events: ['Electrowiz Symposium', 'Line Follower Robotics Contest', 'PCB Design Bootcamp'],
    },
    placements: {
      placedPercentage: '95%',
      highestPackage: '₹20.0 LPA',
      averagePackage: '₹6.8 LPA',
      topRecruiters: ['Qualcomm', 'Bosch', 'Texas Instruments', 'Siemens', 'NVIDIA', 'Analog Devices'],
    },
  },
};

// Generic fallback data generator for other departments
function getDepartmentData(slug) {
  if (departmentDetails[slug]) {
    return departmentDetails[slug];
  }
  const configDept = siteConfig.departments.find((d) => d.slug === slug);
  if (!configDept) return null;

  return {
    name: configDept.name,
    code: configDept.code,
    established: 2005,
    accredited: configDept.accredited,
    intakeUG: 60,
    intakePG: 18,
    hod: {
      name: `Dr. K. ${configDept.code} HOD`,
      designation: 'Professor & Head of Department',
      qualification: 'M.Tech., Ph.D.',
      experience: '18+ Years',
      email: `hod${configDept.slug}@hit.edu.in`,
      phone: '+91 80 4718 2300',
      message: `Welcome to the Department of ${configDept.name}. We are committed to fostering academic rigor, practical knowledge, and holistic professional growth.`,
    },
    overview: `The Department of ${configDept.name} offers specialized curriculum designed in consultation with industry leaders. We emphasize experimental learning, hands-on laboratory workshops, industry internships, and ethical engineering principles.`,
    vision: `To become a pioneer in education and research in the field of ${configDept.name}, nurturing socially responsible professionals.`,
    mission: [
      `Providing quality technical education in ${configDept.name} through modern pedagogical tools.`,
      'Promoting applied research and industry-oriented student innovation.',
      'Fostering leadership, ethics, and sustainability awareness among students.',
    ],
    peos: [
      `PEO 1: Demonstrate profound understanding of fundamental principles in ${configDept.name}.`,
      'PEO 2: Design sustainable and efficient solutions to modern technological problems.',
      'PEO 3: Pursue continuous learning and adapt to changing industry requirements.',
    ],
    facultyList: [
      { name: `Dr. K. ${configDept.code} Head`, role: 'Professor & HOD', qual: 'Ph.D.', spec: configDept.name },
      { name: 'Dr. P. Sundaram', role: 'Associate Professor', qual: 'Ph.D.', spec: 'Applied Engineering' },
      { name: 'Mr. R. Karthik', role: 'Assistant Professor', qual: 'M.E.', spec: 'Advanced Computing' },
      { name: 'Ms. S. Kavitha', role: 'Assistant Professor', qual: 'M.E.', spec: 'Design & Analysis' },
    ],
    labs: [
      { name: 'Core Departmental Practical Lab', pcs: 60, config: 'Standard workstations with high-speed Internet and specialized toolsets' },
      { name: 'Advanced Research & Simulation Lab', pcs: 45, config: 'Workstations with MATLAB, Ansys, AutoCAD and specialized simulation tools' },
      { name: 'Project & Prototyping Laboratory', pcs: 35, config: 'Experimental benches, test fixtures, and prototyping equipment' },
    ],
    curriculum: [
      { sem: 'Semester I', credits: 21, subjects: ['Professional English', 'Engineering Mathematics I', 'Physics', 'Basics of Computing'] },
      { sem: 'Semester II', credits: 22, subjects: ['Technical English', 'Engineering Mathematics II', 'Chemistry', 'Engineering Graphics'] },
      { sem: 'Semester III', credits: 23, subjects: ['Core Discipline Fundamentals I', 'Electrical & Electronic Systems', 'Applied Lab I'] },
      { sem: 'Semester IV', credits: 23, subjects: ['Core Discipline Fundamentals II', 'Design Principles', 'Applied Lab II'] },
    ],
    association: {
      name: `${configDept.code} Students Association`,
      clubs: ['Innovators Club', 'Tech Guild', 'Project Forum'],
      events: ['Annual Department Symposium', 'Industry Workshops', 'Technical Quizzes'],
    },
    placements: {
      placedPercentage: '92%',
      highestPackage: '₹12.0 LPA',
      averagePackage: '₹5.6 LPA',
      topRecruiters: ['Deloitte', 'Siemens', 'Bosch', 'IBM', 'Accenture'],
    },
  };
}

export default function DepartmentPortalPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Faculty fetched live from the database
  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [facultyError, setFacultyError] = useState('');

  const dept = getDepartmentData(slug);

  // Map slug → DB department code (e.g. 'cse' → 'CSE', 'aids' → 'AI&DS')
  const configDept = siteConfig.departments.find((d) => d.slug === slug);
  // The siteConfig stores codes like 'AI & DS' with a space; DB uses 'AI&DS'.
  // Normalise by removing all spaces so both sides match.
  const deptCode = configDept?.code?.replace(/\s+/g, '') ?? slug.toUpperCase();

  useEffect(() => {
    if (!deptCode) return;
    setFacultyLoading(true);
    setFacultyError('');
    fetch(`${API_BASE}/public/departments/${encodeURIComponent(deptCode)}/faculty`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFacultyList(data.faculty || []);
      })
      .catch((err) => {
        setFacultyError(err.message);
      })
      .finally(() => setFacultyLoading(false));
  }, [deptCode]);

  if (!dept) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Department Not Found</h1>
        <p className="mt-2 text-slate-600">The requested department does not exist.</p>
        <Link to="/" className="mt-4 inline-block btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview & HOD' },
    { id: 'vision', label: 'Vision & Mission' },
    { id: 'faculty', label: 'Faculty Members' },
    { id: 'labs', label: 'Laboratories' },
    { id: 'curriculum', label: 'Curriculum & Syllabus' },
    { id: 'association', label: 'Association & Activities' },
    { id: 'placements', label: 'Placements & Records' },
  ];

  function setTab(tabId) {
    setSearchParams({ tab: tabId });
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Department Banner Header */}
      <div className="bg-gradient-to-r from-[#0b3d91] via-[#09357e] to-[#041e42] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <nav className="flex items-center gap-2 text-xs text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Departments</span>
            <span>/</span>
            <span className="text-white font-medium">{dept.code}</span>
          </nav>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                  {dept.code}
                </span>
                {dept.accredited && (
                  <span className="rounded bg-emerald-500/90 px-2 py-0.5 text-xs font-bold uppercase text-white shadow-xs">
                    Professionally Accredited
                  </span>
                )}
                <span className="text-xs text-blue-200">
                  Est. {dept.established} • Bengaluru, India
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl text-white">
                Department of {dept.name}
              </h1>
              <p className="mt-1 text-sm text-blue-100 max-w-3xl">
                B.E. • M.E. • Ph.D. Programmes • Bengaluru, India
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
              <div className="text-center">
                <p className="text-xl font-black text-amber-300">{dept.intakeUG}</p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">UG Intake</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-black text-amber-300">
                  {facultyLoading ? '…' : `${facultyList.length}+`}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">Faculty</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-black text-emerald-300">{dept.placements.placedPercentage}</p>
                <p className="text-[11px] uppercase tracking-wider text-blue-200">Placement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Sub-Navigation Tabs Bar */}
        <div className="border-t border-white/15 bg-[#072d6d]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex overflow-x-auto no-scrollbar gap-1 py-1 text-xs font-bold uppercase tracking-wide">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTab(tab.id)}
                    className={`whitespace-nowrap rounded-md px-3.5 py-2.5 transition ${
                      isActive
                        ? 'bg-white text-[#0b3d91] shadow-sm font-extrabold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Tab Panel (3 cols) */}
          <div className="lg:col-span-3">
            {/* TAB 1: OVERVIEW & HOD */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-[#0b3d91]">About the Department</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {dept.overview}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-blue-50/70 p-3 text-center border border-blue-100">
                      <p className="text-lg font-bold text-[#0b3d91]">{dept.established}</p>
                      <p className="text-xs text-slate-600">Year Established</p>
                    </div>
                    <div className="rounded-lg bg-blue-50/70 p-3 text-center border border-blue-100">
                      <p className="text-lg font-bold text-[#0b3d91]">{dept.intakeUG}</p>
                      <p className="text-xs text-slate-600">UG Seats / Year</p>
                    </div>
                    <div className="rounded-lg bg-blue-50/70 p-3 text-center border border-blue-100">
                      <p className="text-lg font-bold text-[#0b3d91]">{dept.labs.length}</p>
                      <p className="text-xs text-slate-600">Advanced Labs</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-center border border-emerald-200">
                      <p className="text-lg font-bold text-emerald-700">{dept.accredited ? 'Accredited' : 'Industry-Aligned'}</p>
                      <p className="text-xs text-slate-600">{dept.accredited ? 'Professionally Recognised' : 'Curriculum'}</p>
                    </div>
                  </div>
                </div>

                {/* HOD Profile */}
                <div className="card overflow-hidden">
                  <div className="bg-[#0b3d91] px-6 py-3 text-white">
                    <h3 className="text-base font-bold">Head of the Department (HOD)</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-3xl font-extrabold text-white shadow-md">
                        {dept.hod.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-900">{dept.hod.name}</h4>
                        <p className="text-xs font-semibold text-[#0b3d91] uppercase">{dept.hod.designation}</p>
                        <p className="text-xs text-slate-600">
                          Qualification: <span className="font-medium text-slate-800">{dept.hod.qualification}</span> • Experience: <span className="font-medium text-slate-800">{dept.hod.experience}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Email: <a href={`mailto:${dept.hod.email}`} className="text-blue-600 hover:underline">{dept.hod.email}</a> • Phone: {dept.hod.phone}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-slate-50 p-4 border-l-4 border-[#0b3d91]">
                      <p className="text-xs font-semibold uppercase text-slate-500">HOD's Message</p>
                      <p className="mt-1 text-sm italic text-slate-700">"{dept.hod.message}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VISION & MISSION */}
            {currentTab === 'vision' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center gap-2 text-[#0b3d91]">
                    <span className="text-xl">🎯</span>
                    <h2 className="text-xl font-bold">Vision of the Department</h2>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 rounded-lg bg-blue-50/50 p-4 border border-blue-100 font-medium">
                    {dept.vision}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-[#0b3d91]">
                    <span className="text-xl">🚀</span>
                    <h2 className="text-xl font-bold">Mission of the Department</h2>
                  </div>
                  <ul className="mt-3 space-y-3">
                    {dept.mission.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 border border-slate-200">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0b3d91] text-xs font-bold text-white">
                          M{idx + 1}
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center gap-2 text-[#0b3d91]">
                    <span className="text-xl">📌</span>
                    <h2 className="text-xl font-bold">Program Educational Objectives (PEOs)</h2>
                  </div>
                  <div className="mt-3 space-y-3">
                    {dept.peos.map((peo, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 p-4 bg-white shadow-xs">
                        <p className="text-sm text-slate-700">{peo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FACULTY MEMBERS */}
            {currentTab === 'faculty' && (
              <div className="card p-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0b3d91]">Faculty Members</h2>
                    <p className="text-xs text-slate-500">Experienced academic and research mentors</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0b3d91]">
                    Total Faculty: {dept.facultyList.length}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {dept.facultyList.map((fac, idx) => (
                    <div key={idx} className="flex gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-[#0b3d91] hover:shadow-md">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0b3d91] text-sm font-bold text-white">
                        {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{fac.name}</p>
                        <p className="text-xs font-semibold text-[#0b3d91]">{fac.role}</p>
                        <p className="text-xs text-slate-600">Qualification: {fac.qual}</p>
                        <p className="text-xs text-slate-500">Specialization: {fac.spec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: LABORATORIES */}
            {currentTab === 'labs' && (
              <div className="card p-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-bold text-[#0b3d91]">Laboratories & Research Facilities</h2>
                  <p className="text-xs text-slate-500">Equipped with industry-standard hardware, workstations, and licensed software suites</p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {dept.labs.map((lab, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 p-4 transition hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-[#0b3d91]">
                          0{idx + 1}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {lab.pcs} Workstations
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-slate-900">{lab.name}</h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700">Configuration:</span> {lab.config}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CURRICULUM & SYLLABUS */}
            {currentTab === 'curriculum' && (
              <div className="card p-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-[#0b3d91]">Curriculum & Syllabus</h2>
                      <p className="text-xs text-slate-500">2026 Credit Framework</p>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => alert('Downloading official curriculum PDF.')}>
                      📥 Download Syllabus PDF
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {dept.curriculum.map((sem, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <p className="font-bold text-slate-800">{sem.sem}</p>
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#0b3d91]">
                          Total Credits: {sem.credits}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sem.subjects.map((sub, sIdx) => (
                          <span key={sIdx} className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: ASSOCIATION & ACTIVITIES */}
            {currentTab === 'association' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-[#0b3d91]">{dept.association.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">Student development forum organizing workshops, hackathons, and symposiums</p>

                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-900">Student Technical Clubs</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {dept.association.clubs.map((club, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-lg bg-blue-50/60 p-3 text-xs font-semibold text-[#0b3d91] border border-blue-100">
                          <span>⚡</span>
                          <span>{club}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-900">Flagship Annual Activities</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {dept.association.events.map((ev, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PLACEMENTS */}
            {currentTab === 'placements' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-[#0b3d91]">Department Placement Records</h2>
                  <p className="mt-1 text-xs text-slate-500">Consistent track record of campus placements in leading national & multinational firms</p>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-emerald-50 p-4 text-center border border-emerald-200">
                      <p className="text-2xl font-black text-emerald-700">{dept.placements.placedPercentage}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">Placement Record</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 text-center border border-blue-200">
                      <p className="text-2xl font-black text-[#0b3d91]">{dept.placements.highestPackage}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">Highest Package</p>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-4 text-center border border-purple-200">
                      <p className="text-2xl font-black text-purple-700">{dept.placements.averagePackage}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">Average Package</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-slate-900">Top Recruiting Partners</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {dept.placements.topRecruiters.map((rec, idx) => (
                        <span key={idx} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs">
                          🏢 {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FACULTY MEMBERS — rendered from live DB data */}
            <section id="faculty" className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-[#0b3d91] to-[#0a357f] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Faculty Members</h2>
                  <p className="mt-1 text-sm text-blue-100">Experienced academic and research mentors</p>
                </div>
                <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {facultyLoading ? 'Loading…' : `Total Faculty: ${facultyList.length}`}
                </span>
              </div>

              {/* Loading skeleton */}
              {facultyLoading && (
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 rounded-xl border border-slate-100 p-5 animate-pulse">
                      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-3 w-2/3 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {!facultyLoading && facultyError && (
                <div className="p-6 text-center text-sm text-red-600">
                  <p className="font-semibold">Could not load faculty</p>
                  <p className="mt-1 text-xs text-slate-500">{facultyError}</p>
                </div>
              )}

              {/* Empty state */}
              {!facultyLoading && !facultyError && facultyList.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-500">
                  No faculty members assigned to this department yet.
                </div>
              )}

              {/* Faculty cards */}
              {!facultyLoading && !facultyError && facultyList.length > 0 && (
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  {facultyList.map((fac, idx) => (
                    <div key={idx} className="flex gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0b3d91] text-sm font-bold text-white">
                        {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-bold text-slate-900">{fac.name}</p>
                        <p className="text-sm font-semibold text-[#0b3d91]">{fac.designation || 'Faculty'}</p>
                        <p className="text-sm text-slate-500">
                          <a href={`mailto:${fac.email}`} className="hover:text-blue-600 hover:underline">
                            {fac.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Department Quick Switcher Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="card p-4">
              <h3 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                All Departments
              </h3>
              <div className="mt-3 flex flex-col gap-1 text-xs font-medium">
                {siteConfig.departments.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/departments/${d.slug}`}
                    className={`flex items-center justify-between rounded-md px-3 py-2 transition ${
                      d.slug === slug
                        ? 'bg-[#0b3d91] font-bold text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0b3d91]'
                    }`}
                  >
                    <span>{d.name}</span>
                    {d.accredited && (
                      <span className={`text-[9px] font-bold uppercase px-1 rounded ${
                        d.slug === slug ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Accredited
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Admission Help card */}
            <div className="rounded-xl bg-gradient-to-br from-[#0b3d91] to-[#041e42] p-5 text-white shadow-md">
              <h3 className="text-base font-bold">Apply for Admission</h3>
              <p className="mt-1 text-xs text-blue-100 leading-relaxed">
                Admissions are open for B.E., B.Tech, M.E., and MBA programmes on a merit basis.
              </p>
              <Link
                to="/admission"
                className="mt-4 block w-full rounded-lg bg-amber-400 py-2 text-center text-xs font-bold text-slate-900 hover:bg-amber-300 transition"
              >
                Start Application &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
