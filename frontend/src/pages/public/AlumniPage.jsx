import { useState, useId, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicPageLayout } from './PublicStaticPages.jsx';
import { siteConfig } from '../../config/siteConfig.js';

// Global Chapters Directory Data
const chaptersData = [
  {
    city: 'Bengaluru (Headquarters)',
    country: 'India',
    members: '11,200+',
    lead: 'Dr. Vikramaditya Sen',
    batch: 'Class of 1995 (CSE)',
    role: 'Distinguished Fellow & Chapter President',
    email: 'alumni.blr@hit.edu.in',
    highlights: 'Monthly tech roundtables, student mentorship hub, annual Milan gala host.',
  },
  {
    city: 'Silicon Valley & San Francisco',
    country: 'United States',
    members: '3,800+',
    lead: 'Ananya Mukherjee',
    batch: 'Class of 2004 (ECE)',
    role: 'VP of Product at Google Cloud',
    email: 'alumni.sv@hit.edu.in',
    highlights: 'Seed funding pitch nights, summer intern reception, US university guidance.',
  },
  {
    city: 'London & Greater Europe',
    country: 'United Kingdom',
    members: '1,900+',
    lead: 'Rohan K. Deshmukh',
    batch: 'Class of 2009 (IT)',
    role: 'Principal Research Engineer, DeepMind',
    email: 'alumni.europe@hit.edu.in',
    highlights: 'European research bridge, winter networking dinner, Cambridge & Oxford mixers.',
  },
  {
    city: 'Singapore & Southeast Asia',
    country: 'Singapore',
    members: '2,100+',
    lead: 'Priya Natarajan',
    batch: 'Class of 2011 (CSE)',
    role: 'Director of FinTech Solutions, DBS',
    email: 'alumni.sg@hit.edu.in',
    highlights: 'Fintech masterclasses, APAC career recruitment, annual Marina Bay meet.',
  },
  {
    city: 'Dubai & Middle East',
    country: 'United Arab Emirates',
    members: '2,400+',
    lead: 'Farhan Akhtar',
    batch: 'Class of 2001 (MECH)',
    role: 'Managing Director, Gulf Infrastructure Corp',
    email: 'alumni.uae@hit.edu.in',
    highlights: 'Middle East infrastructure consortium, Gulf endowment drive.',
  },
  {
    city: 'Hyderabad & Cyberabad',
    country: 'India',
    members: '1,800+',
    lead: 'Rajeshwari Iyer',
    batch: 'Class of 2014 (AI & DS)',
    role: 'Staff Architect, Microsoft India',
    email: 'alumni.hyd@hit.edu.in',
    highlights: 'Semiconductor & AI summits, HIT innovation incubator roadshows.',
  },
];

// Office Bearers
const officeBearers = [
  {
    name: 'Dr. R. Sundararajan',
    role: 'President, HIT Alumni Association',
    batch: 'Class of 1982 · B.E. Mechanical',
    current: 'Former Director of Propulsion Systems, ISRO',
    quote: 'The roots of our accomplishments began in these halls. Giving back to current students is our greatest responsibility.',
  },
  {
    name: 'Shweta Kashyap',
    role: 'Vice President',
    batch: 'Class of 1999 · B.Tech ECE',
    current: 'Founder & CEO, NexGen Robotics',
    quote: 'Mentoring student inventors transforms young ambition into global tech enterprises.',
  },
  {
    name: 'Arvind Swaminathan',
    role: 'General Secretary',
    batch: 'Class of 2007 · B.Tech CSE',
    current: 'Managing Partner, Matrix Tech Ventures',
    quote: 'HIT alumni have built an indomitable global fraternity that opens doors across industries.',
  },
  {
    name: 'Karthik Balaji',
    role: 'Treasurer & Endowment Trustee',
    batch: 'Class of 2003 · B.Tech EEE',
    current: 'Chief Financial Officer, Zenith Global',
    quote: 'Our alumni scholarship endowment ensures that no deserving student drops out due to finances.',
  },
];

// Activities Accomplished by Alumni Data
const alumniActivities = [
  {
    id: 1,
    title: '"Margadarshi" 1-on-1 Student Mentorship Initiative',
    category: 'Mentorship',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    impact: '1,250+ Students Mentored Annually',
    date: 'Ongoing (Bi-Annual Batches)',
    summary:
      'Alumni working at top global tech and engineering firms dedicate 2 hours weekly to mentor pre-final and final-year students. Activities include resume teardowns, system design coaching, mock technical interviews, and higher-education application guidance.',
    keyOutcomes: [
      'Over 96% placement conversion rate for mentored student cohorts',
      '240+ students placed directly through alumni employee referral tracks',
      '35 students admitted into Stanford, CMU, IISc, and ETH Zurich with alumni letters of recommendation',
    ],
  },
  {
    id: 2,
    title: 'HIT Alumni Advanced IoT & Robotics Research Lab',
    category: 'Campus Contribution',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    impact: '₹1.8 Crore Infrastructure Endowment',
    date: 'Established Nov 2024 (Active Expansion 2026)',
    summary:
      'Fully funded by alumni batches of 1995-2005, this state-of-the-art center features industrial-grade robotic arms, Nvidia GPU clusters, 3D additive manufacturing stations, and sensor testbenches for interdisciplinary student research.',
    keyOutcomes: [
      'Open 24/7 for student prototyping and national hackathon preparations',
      'Enabled 18 student patent filings and 26 IEEE conference publications',
      'Zero cost for students using high-performance compute and prototyping supplies',
    ],
  },
  {
    id: 3,
    title: 'HIT Alumni Seed Grant & Venture Pitch Fest',
    category: 'Innovation & Startups',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    impact: '₹35 Lakhs Non-Dilutive Capital Granted',
    date: 'Annual (Next Edition: March 2026)',
    summary:
      'An annual startup accelerator and pitch challenge judged by prominent venture capitalist alumni. The grant provides non-dilutive seed funding to student prototypes, complimentary co-working space, legal incorporation support, and executive mentorship.',
    keyOutcomes: [
      'Funded 4 thriving student startups including AgriDrone Technologies and NeuraHealth AI',
      'Winning student teams received angel follow-on funding exceeding $1.2M',
      'Quarterly office hours with Silicon Valley alumni angel investors',
    ],
  },
  {
    id: 4,
    title: 'Industry Tech Masterclasses & Guest Lecture Series',
    category: 'Knowledge Sharing',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    impact: '52 Masterclasses Conducted in 2025-2026',
    date: 'Monthly Weekends',
    summary:
      'Distinguished alumni leaders return to deliver deep-dive technical workshops on cutting-edge industry practices: Generative AI & LLMs, Cloud-Native Kubernetes at scale, EV Battery Management Systems, VLSI Semiconductor Design, and Financial Tech.',
    keyOutcomes: [
      'Interactive hands-on code labs with industry-grade toolchains',
      'Digital verifiable certificates issued to all participating students',
      'Curriculum modernization feedback provided directly to HIT Academic Council',
    ],
  },
  {
    id: 5,
    title: 'Alumni Emergency Relief & Merit-Cum-Need Scholarships',
    category: 'Scholarships & CSR',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    impact: '₹65 Lakhs Disbursed in 2025-2026',
    date: 'Annual Disbursement (Each Semester)',
    summary:
      'Funded by global alumni contributions, this endowment guarantees financial coverage for students facing sudden medical or economic crises, along with merit fellowships for top academic performers from disadvantaged backgrounds.',
    keyOutcomes: [
      '140 students supported with 100% tuition and boarding fee waivers',
      '45 brand-new engineering laptops distributed to first-generation college students',
      'Completely transparent selection overseen by alumni trustees and faculty council',
    ],
  },
  {
    id: 6,
    title: 'Green Bengaluru Campus & Rural STEM Education Drive',
    category: 'Community Service',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    impact: '2,500 Native Trees & 120 Computers Donated',
    date: 'Quarterly Community Days',
    summary:
      'The Alumni Association organizes environmental stewardship drives on campus and outreach programs in peri-urban and rural schools across Karnataka, fostering science curiosity and computer literacy among children.',
    keyOutcomes: [
      'Equipped 6 rural government schools with digital computer labs',
      'Trained 800+ rural middle-school pupils in introductory coding and robotics',
      'Developed solar-powered rainwater recharge pits across HIT campus grounds',
    ],
  },
];

// Flagship Reunions & Meets
const reunionsData = [
  {
    title: 'Milan 2026: 75th Platinum Jubilee Global Alumni Meet',
    date: 'January 10 – 12, 2026',
    venue: 'HIT Convention Arena & Main Campus Amphitheater, Bengaluru',
    attendees: '3,200+ Alumni from 22 Batches and 18 Countries',
    status: 'Completed with Grand Celebrations',
    highlights: [
      'Inauguration of the 75th Anniversary Alumni Heritage Wall and Time Capsule',
      'Distinguished Alumnus Awards ceremony honouring 15 global trailblazers',
      'Reunion banquet with nostalgic campus cafeteria food re-creations',
      'Batch-wise tree plantation and legacy donation pledges of ₹4.2 Crore',
    ],
  },
  {
    title: 'Silver Jubilee Reunion — Class of 2001',
    date: 'October 18 – 19, 2025',
    venue: 'HIT Campus Lawn & Tech Park Auditorium',
    attendees: '280 Alumni with Families',
    status: 'Completed',
    highlights: [
      '25th anniversary celebration of the Millennium Batch',
      'Class of 2001 sponsored ₹50 Lakhs for complete modernization of Digital Library',
      'Felicitation of retired professors and faculty mentors',
    ],
  },
  {
    title: 'Silicon Valley Chapter Annual Dinner & Innovation Forum',
    date: 'September 5, 2025',
    venue: 'Computer History Museum, Mountain View, California, USA',
    attendees: '420 Bay Area Alumni',
    status: 'Completed',
    highlights: [
      'Keynote on "AI Agents & The Future of Engineering" by HIT alumni leaders',
      'Networking mixer for HIT graduates working at FAANG, OpenAI, and YC startups',
      'Announcement of 10 Silicon Valley student summer internship sponsorships',
    ],
  },
];

// Upcoming Events
const upcomingEvents = [
  {
    title: 'Decennial Reunion — Class of 2016 (10 Years of Graduating)',
    date: 'December 12 – 13, 2026',
    time: '10:00 AM – 6:00 PM IST',
    venue: 'HIT Main Auditorium, Bengaluru',
    description: 'A 10-year celebratory milestone for the 2016 batch. Reconnect with classmates, revisit your favorite spots on campus, and share career milestones.',
    rsvpOpen: true,
  },
  {
    title: 'Global Alumni Virtual Hackathon & Mentorship Summit',
    date: 'November 21 – 22, 2026',
    time: 'Virtual (Zoom / Discord)',
    description: '48-hour global hackathon where current HIT students build prototypes with real-time coaching from alumni engineers worldwide.',
    rsvpOpen: true,
  },
  {
    title: 'London Chapter Winter Meetup 2026',
    date: 'December 4, 2026',
    time: '6:30 PM GMT',
    venue: 'The Royal Society of Arts, London, UK',
    description: 'An evening of celebration, networking, and welcoming newly relocated HIT alumni in the UK and European region.',
    rsvpOpen: true,
  },
];

// Renowned Alumni
const renownedAlumniData = [
  {
    name: 'Dr. Arvind Swaminathan',
    degree: 'B.Tech Computer Science & Engineering',
    batch: 'Class of 1996',
    role: 'Vice President of Engineering, Cloud AI',
    company: 'Google',
    category: 'Tech & Corporate',
    location: 'Mountain View, California, USA',
    achievements: 'Pioneered large-scale distributed inference systems. Author of 30+ patents and IEEE Fellow.',
    quote: 'The rigorous foundational grounding I received at HIT provided the exact mental stamina needed to tackle global technological challenges.',
  },
  {
    name: 'Meera Raghavan',
    degree: 'B.Tech Electronics & Communication',
    batch: 'Class of 2001',
    role: 'Co-Founder & Chief Technology Officer',
    company: 'PaySwift (Unicorn FinTech)',
    category: 'Entrepreneurs',
    location: 'Bengaluru, India',
    achievements: 'Built payment gateway infrastructure powering $40B+ annual transaction volume. Featured on Forbes Asia 40 Under 40.',
    quote: 'HIT taught me to be fearless with technology and empathetic with people — the two essential ingredients for entrepreneurship.',
  },
  {
    name: 'Dr. K. S. Narayanan',
    degree: 'B.E. Mechanical Engineering',
    batch: 'Class of 1984',
    role: 'Distinguished Scientist & Former Mission Director',
    company: 'Indian Space Research Organisation (ISRO)',
    category: 'Research & Science',
    location: 'Thiruvananthapuram, India',
    achievements: 'Key contributor to indigenous cryogenic engine stage development and planetary exploration missions. Recipient of National Science Honor.',
    quote: 'Our engineering laboratories at HIT cultivated that persistent curiosity which powered every rocket stage we engineered.',
  },
  {
    name: 'Vikramaditya Bose',
    degree: 'B.Tech Information Technology',
    batch: 'Class of 2005',
    role: 'Founder & CEO',
    company: 'NeuraHealth AI',
    category: 'Entrepreneurs',
    location: 'San Francisco, USA & Bengaluru, India',
    achievements: 'Y-Combinator alumnus; raised $45M in venture financing to automate clinical oncology radiology diagnostics.',
    quote: 'Whenever we hire at NeuraHealth, HIT graduates stand out for their exceptional work ethic and genuine depth of problem-solving.',
  },
  {
    name: 'Sujata Sen, IAS',
    degree: 'B.Tech Civil Engineering',
    batch: 'Class of 2008',
    role: 'Additional Chief Secretary',
    company: 'Government of Karnataka',
    category: 'Public Service',
    location: 'Bengaluru, India',
    achievements: 'Ranked top 15 in the UPSC Civil Services Examination. Architect of state-wide smart urban drainage and sustainable metro expansion.',
    quote: 'The discipline and social responsibility instilled at HIT continue to guide my work in serving millions of citizens every day.',
  },
  {
    name: 'Prof. Rajeshwari Krishnamurthy',
    degree: 'B.Tech Electrical & Electronics Engineering',
    batch: 'Class of 1999',
    role: 'Tenured Professor of Electrical Engineering',
    company: 'Stanford University',
    category: 'Research & Science',
    location: 'Palo Alto, California, USA',
    achievements: 'Breakthrough contributions in renewable microgrids and ultra-low-power neuromorphic architectures. NSF Early Career Awardee.',
    quote: 'HIT fostered our intellectual independence. It proved that world-class scientific inquiry can flourish anywhere with dedication.',
  },
  {
    name: 'Karthik Nambiar',
    degree: 'B.Tech Bio-Medical Engineering',
    batch: 'Class of 2012',
    role: 'Director of Surgical Robotics Systems',
    company: 'MedTech Innovations UK',
    category: 'Tech & Corporate',
    location: 'London, United Kingdom',
    achievements: 'Led clinical deployment of minimally invasive laparoscopic robotic arms across 80+ NHS hospitals in Europe.',
    quote: 'HIT\'s specialized biomedical curriculum and laboratory access gave me an unbeatable headstart in the global medtech arena.',
  },
  {
    name: 'Ananya Deshmukh',
    degree: 'MBA (Systems & Operations)',
    batch: 'Class of 2015',
    role: 'Managing Director, Global Supply Chain',
    company: 'Amazon APAC',
    category: 'Tech & Corporate',
    location: 'Singapore',
    achievements: 'Manages cross-border e-commerce logistics across 14 Asian and Pacific nations with AI-driven automated fulfillment.',
    quote: 'The leadership opportunities and cross-disciplinary projects at HIT prepared me to lead multinational operations with confidence.',
  },
];

export default function AlumniPage() {
  const { sub } = useParams();
  const subNav = [
    { label: 'Alumni Association', to: '/alumni' },
    { label: 'Alumni Meet & Activities', to: '/alumni/activities' },
    { label: 'Renowned Alumni', to: '/alumni/renowned' },
    { label: 'Alumni Registration Link', to: '/alumni/register' },
  ];

  // Map sub route parameter to active section
  const currentTab = useMemo(() => {
    const raw = (sub || '').toLowerCase().trim();
    if (raw === 'activities' || raw === 'meet') return 'activities';
    if (raw === 'renowned' || raw === 'hall-of-fame') return 'renowned';
    if (raw === 'register' || raw === 'registration') return 'register';
    return 'association';
  }, [sub]);

  // Page titles and subtitles
  const meta = {
    association: {
      title: 'HIT Alumni Association',
      subtitle: 'A lifelong, vibrant global fraternity of 26,000+ engineers, researchers, entrepreneurs, and leaders across 45+ countries.',
      crumb: 'Alumni Association',
    },
    activities: {
      title: 'Alumni Meets & Impact Activities',
      subtitle: 'Discover the inspiring initiatives, lab contributions, scholarships, mentorship drives, and annual reunions driven by our alumni.',
      crumb: 'Alumni Meet & Activities',
    },
    renowned: {
      title: 'Renowned & Distinguished Alumni',
      subtitle: 'Celebrating our alumni who have achieved exemplary milestones across technology, public service, space research, and entrepreneurship.',
      crumb: 'Renowned Alumni',
    },
    register: {
      title: 'Alumni Registration & Verification Portal',
      subtitle: 'Join the official HIT Alumni Directory. Please submit your graduation details and last year student ID proof to receive your official membership card.',
      crumb: 'Alumni Registration',
    },
  }[currentTab];

  return (
    <PublicPageLayout
      title={meta.title}
      subtitle={meta.subtitle}
      breadcrumbs={[{ label: 'Alumni', to: '/alumni' }, { label: meta.crumb }]}
      subNav={subNav}
    >
      {currentTab === 'association' && <AlumniAssociationSection />}
      {currentTab === 'activities' && <AlumniActivitiesSection />}
      {currentTab === 'renowned' && <RenownedAlumniSection />}
      {currentTab === 'register' && <AlumniRegistrationSection />}
    </PublicPageLayout>
  );
}

// -------------------------------------------------------------
// SECTION 1: ALUMNI ASSOCIATION
// -------------------------------------------------------------
function AlumniAssociationSection() {
  return (
    <div className="space-y-10">
      {/* Overview Stat Counters Banner */}
      <div className="rounded-2xl border border-blue-900/10 bg-gradient-to-br from-[#0b3d91] via-[#09357a] to-[#041e42] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Established 1951 · 75 Years of Legacy
            </span>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Connecting 26,000+ HITians Across The Globe
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              The Hogwarts Institute of Technology Alumni Association serves as an unbreakable bridge between generations of graduates, current students, faculty, and industry partners. We empower students through mentorship, sponsor pioneering campus research labs, and organize high-impact reunions worldwide.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/alumni/register"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-900 shadow hover:bg-amber-300 transition"
            >
              Join / Register As Alumnus &rarr;
            </Link>
            <Link
              to="/alumni/activities"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              View Alumni Activities
            </Link>
          </div>
        </div>

        {/* 5 Key Metric Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">26,000+</p>
            <p className="text-[11px] font-medium text-blue-100">Global Alumni</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">45+</p>
            <p className="text-[11px] font-medium text-blue-100">Nations Worldwide</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">12</p>
            <p className="text-[11px] font-medium text-blue-100">Active City Chapters</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center">
            <p className="text-2xl font-black text-amber-300">₹3.8 Cr+</p>
            <p className="text-[11px] font-medium text-blue-100">Endowments & Grants</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-black text-amber-300">1,250+</p>
            <p className="text-[11px] font-medium text-blue-100">Annual Student Mentees</p>
          </div>
        </div>
      </div>

      {/* Association Mission & 4 Core Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h3 className="text-xl font-black text-[#0b3d91]">Our Core Strategic Pillars</h3>
          <p className="mt-1 text-xs text-slate-600">
            Dedicated to uplifting every current student while expanding global career pathways for alumni.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Student Mentorship ("Margadarshi")',
              desc: 'One-on-one technical coaching, mock interview panels, resume reviews, and masterclasses conducted directly by alumni working in premier tech and core industries.',
              icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
            },
            {
              title: 'Endowments & Scholarships',
              desc: 'Disbursing over ₹65 Lakhs annually in merit and need-based tuition waivers to ensure no talented HIT student ever faces education interruption due to economic constraints.',
              icon: (
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: 'Infrastructure & Research Grants',
              desc: 'Alumni funded modern lab bays such as the IoT & Advanced Robotics Lab, providing high-end Nvidia GPU nodes, 3D printing farms, and rapid hardware prototyping supplies.',
              icon: (
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: 'Global Chapter Networking',
              desc: 'Dynamic chapter hubs in Silicon Valley, London, Singapore, Dubai, Bengaluru, and Hyderabad hosting regular mixers, professional networking, and relocation assistance.',
              icon: (
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((pillar, idx) => (
            <div key={idx} className="card p-5 hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 mb-3">
                {pillar.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{pillar.title}</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Alumni Chapters */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#0b3d91] uppercase">
              Global Network
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Official Alumni Chapters</h3>
            <p className="text-xs text-slate-600">Connect with regional coordinators in your current city or country</p>
          </div>
          <Link
            to="/alumni/register"
            className="self-start sm:self-auto rounded-lg bg-[#0b3d91] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#082e6e] transition"
          >
            Update Your Chapter &rarr;
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chaptersData.map((chap, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0b3d91]">{chap.city}</span>
                <span className="badge bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
                  {chap.members}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{chap.country}</p>

              <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1 text-xs">
                <p className="font-semibold text-slate-800">{chap.lead}</p>
                <p className="text-[11px] text-slate-600">{chap.batch}</p>
                <p className="text-[11px] text-slate-500 italic">{chap.role}</p>
              </div>

              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-100">
                {chap.highlights}
              </p>

              <div className="mt-3 pt-2">
                <a
                  href={`mailto:${chap.email}`}
                  className="text-[11px] font-bold text-[#0b3d91] hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {chap.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Association Leadership / Office Bearers */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
            Governing Council
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Alumni Association Office Bearers</h3>
          <p className="text-xs text-slate-600">Elected leadership guiding the initiatives and endowments of the association</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {officeBearers.map((bearer, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#0b3d91] font-black text-sm mb-3">
                  {bearer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{bearer.name}</h4>
                <p className="text-[11px] font-bold text-[#0b3d91] mt-0.5">{bearer.role}</p>
                <p className="text-[11px] text-slate-500 mt-1">{bearer.batch}</p>
                <p className="text-[11px] text-slate-700 font-medium mt-1.5">{bearer.current}</p>
              </div>
              <blockquote className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded">
                "{bearer.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 2: ALUMNI MEET & ACTIVITIES
// -------------------------------------------------------------
function AlumniActivitiesSection() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [rsvpModalEvent, setRsvpModalEvent] = useState(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', batch: '', guests: '1' });

  const categories = ['All', 'Mentorship', 'Campus Contribution', 'Innovation & Startups', 'Knowledge Sharing', 'Scholarships & CSR', 'Community Service'];

  const filteredActivities = useMemo(() => {
    if (filterCategory === 'All') return alumniActivities;
    return alumniActivities.filter((a) => a.category.toLowerCase().includes(filterCategory.toLowerCase()));
  }, [filterCategory]);

  function handleRsvpSubmit(e) {
    e.preventDefault();
    if (!rsvpForm.name || !rsvpForm.email || !rsvpForm.batch) {
      alert('Please fill out all required RSVP fields.');
      return;
    }
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpModalEvent(null);
      setRsvpForm({ name: '', email: '', batch: '', guests: '1' });
    }, 2500);
  }

  return (
    <div className="space-y-10">
      {/* Hero Banner for Activities */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-white to-amber-50/40 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="badge bg-amber-100 text-amber-800 font-bold border border-amber-200">
              Alumni In Action
            </span>
            <h2 className="text-2xl font-black text-[#0b3d91]">
              High-Impact Activities Accomplished By Alumni
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              From equipping advanced hardware research laboratories and seed-funding student ventures to leading 1-on-1 mentorship cohorts and planting thousands of campus trees, our alumni actively drive transformation on campus and across society.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/alumni/register"
              className="rounded-lg bg-[#0b3d91] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#082e6e] transition shadow"
            >
              Volunteer / Contribute &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Activities Grid with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Featured Alumni Initiatives & Outcomes</h3>
            <p className="text-xs text-slate-500">Filter by domain to see specific contributions</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  filterCategory === cat
                    ? 'bg-[#0b3d91] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="card p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`badge text-[10px] font-bold border ${act.badgeColor}`}>
                    {act.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {act.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {act.title}
                </h4>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Impact: {act.impact}</span>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {act.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    Measurable Outcomes:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {act.keyOutcomes.map((outcome, oIdx) => (
                      <li key={oIdx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span className="text-[11px] leading-snug">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Annual Meets & Reunions */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="badge bg-blue-100 text-[#0b3d91] font-bold uppercase text-[10px]">
            Milestone Gatherings
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Annual Alumni Meets & Reunions</h3>
          <p className="text-xs text-slate-600">Bringing generations together to celebrate memories, honor mentors, and pledge support</p>
        </div>

        <div className="space-y-4">
          {reunionsData.map((reunion, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-sm transition">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h4 className="text-base font-bold text-[#0b3d91]">{reunion.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{reunion.venue}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {reunion.date}
                  </span>
                  <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {reunion.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Attendance: {reunion.attendees}</span>
              </div>

              <div className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                {reunion.highlights.map((item, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">★</span>
                    <span className="text-[11px] leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events & Calendar with RSVP */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="badge bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
              Mark Your Calendar
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Upcoming Alumni Meets & Activities</h3>
            <p className="text-xs text-slate-600">Reserve your presence or participate virtually</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {upcomingEvents.map((evt, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0b3d91]">
                  <span>{evt.date}</span>
                  <span className="badge bg-sky-50 text-sky-700 border border-sky-200 text-[10px]">RSVP Open</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900">{evt.title}</h4>
                <p className="mt-1 text-[11px] text-slate-500 font-medium">Time: {evt.time}</p>
                {evt.venue && <p className="text-[11px] text-slate-500 font-medium">Venue: {evt.venue}</p>}
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{evt.description}</p>
              </div>

              <button
                type="button"
                onClick={() => setRsvpModalEvent(evt)}
                className="mt-4 w-full rounded-lg bg-[#0b3d91] py-2 text-xs font-bold text-white hover:bg-[#082e6e] transition text-center shadow-sm"
              >
                RSVP / Register Attendance
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0b3d91]">RSVP for Event</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{rsvpModalEvent.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setRsvpModalEvent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="rounded-xl bg-emerald-50 p-6 text-center space-y-2 border border-emerald-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-emerald-900">RSVP Confirmed!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you! An invitation pass and event schedule have been emailed to {rsvpForm.email}. We look forward to seeing you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3">
                <div>
                  <label className="label text-xs">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    className="input text-xs"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="label text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                    className="input text-xs"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label text-xs">Graduation Batch *</label>
                    <input
                      type="text"
                      required
                      value={rsvpForm.batch}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, batch: e.target.value })}
                      className="input text-xs"
                      placeholder="e.g. 2016"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Number of Guests</label>
                    <select
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                      className="input text-xs"
                    >
                      <option value="1">1 (Self)</option>
                      <option value="2">2 (With Spouse / Guest)</option>
                      <option value="3">3 (Family of 3)</option>
                      <option value="4">4+ (Family of 4+)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="btn btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs bg-[#0b3d91] hover:bg-[#082e6e]"
                  >
                    Confirm My RSVP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 3: RENOWNED ALUMNI (HALL OF FAME)
// -------------------------------------------------------------
function RenownedAlumniSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['All', 'Tech & Corporate', 'Entrepreneurs', 'Research & Science', 'Public Service'];

  const filteredAlumni = useMemo(() => {
    return renownedAlumniData.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.degree.toLowerCase().includes(query) ||
        item.batch.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-[#0b3d91] text-white">
        <div className="max-w-3xl space-y-2">
          <span className="badge bg-amber-400 text-slate-900 font-extrabold text-[10px]">
            HIT Hall Of Fame
          </span>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
            Trailblazers & Global Change-Makers
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Our graduates occupy top executive suites at Fortune 500 tech companies, spearhead deep-tech unicorn ventures, lead sovereign space programs, and draft national public policies. Here are some of our esteemed alumni whose work inspires the world.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedCategory(tab)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === tab
                  ? 'bg-[#0b3d91] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alumni by name, company, or batch..."
            className="input pl-8 text-xs py-1.5"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Renowned Alumni Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlumni.map((alum, idx) => (
          <div
            key={idx}
            className="card p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition bg-white"
          >
            <div>
              {/* Header with Avatar and Category */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0b3d91] to-sky-600 text-white font-black text-lg shadow-sm">
                  {alum.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('')}
                </div>
                <span className="badge bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                  {alum.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {alum.name}
              </h3>

              <div className="mt-1 space-y-0.5">
                <p className="text-xs font-extrabold text-[#0b3d91]">{alum.role}</p>
                <p className="text-xs font-bold text-slate-800">{alum.company}</p>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span className="badge bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                  {alum.batch}
                </span>
                <span className="text-slate-400">·</span>
                <span className="truncate">{alum.degree}</span>
              </div>

              <div className="mt-3.5 rounded-lg bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Key Milestones & Honors:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {alum.achievements}
                </p>
              </div>
            </div>

            <blockquote className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic bg-amber-50/50 p-2.5 rounded border border-amber-100/60">
              "{alum.quote}"
            </blockquote>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="card p-12 text-center text-slate-500">
          <p className="text-sm font-semibold">No alumni matched your search criteria.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-3 btn btn-secondary text-xs"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 4: ALUMNI REGISTRATION & LAST YEAR ID PROOF
// -------------------------------------------------------------
function AlumniRegistrationSection() {
  const fileInputId = useId();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    city: '',
    country: 'India',
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    graduationYear: '2024',
    rollNumber: '',
    employmentStatus: 'Employed in Industry',
    company: '',
    designation: '',
    industrySector: 'IT & Software',
    experienceYears: '2',
    linkedIn: '',
    willingToMentor: true,
    willingToSpeak: false,
    willingToHire: false,
    willingToFund: false,
    willingToLeadChapter: false,
  });

  // ID Proof State (Requested explicitly by user)
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [idProofError, setIdProofError] = useState('');

  // Submit / Success Status
  const [submitting, setSubmitting] = useState(false);
  const [registeredMember, setRegisteredMember] = useState(null);
  const [existingRegistrations, setExistingRegistrations] = useState([]);
  const [showDirectory, setShowDirectory] = useState(false);

  // Load existing registrations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hit_alumni_registrations');
      if (stored) {
        setExistingRegistrations(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle ID proof file selection & validation
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setIdProofError('');

    if (!file) return;

    // Check size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setIdProofError('File size exceeds 5MB limit. Please upload a smaller scan or image.');
      setIdProofFile(null);
      setIdProofPreview(null);
      return;
    }

    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setIdProofError('Invalid file type. Please upload a JPG, PNG, or PDF of your Final Year College ID card or Degree.');
      setIdProofFile(null);
      setIdProofPreview(null);
      return;
    }

    setIdProofFile(file);

    // If image, create data preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setIdProofPreview(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIdProofPreview('pdf');
    }
  }

  function removeIdProof() {
    setIdProofFile(null);
    setIdProofPreview(null);
    setIdProofError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIdProofError('');

    // Ensure ID proof is attached (Explicit user requirement)
    if (!idProofFile) {
      setIdProofError('Final / Last Year College ID Proof is strictly required for alumni verification.');
      const fileElem = document.getElementById(fileInputId);
      if (fileElem) fileElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    // Simulate network submission and create official member pass
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const membershipId = `HIT-ALUM-${formData.graduationYear}-${randomSuffix}`;

      const newRegistration = {
        id: membershipId,
        ...formData,
        idProofFileName: idProofFile.name,
        idProofFileSize: (idProofFile.size / 1024).toFixed(1) + ' KB',
        registeredAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        verificationStatus: 'Verified & Approved',
      };

      try {
        const updated = [newRegistration, ...existingRegistrations];
        localStorage.setItem('hit_alumni_registrations', JSON.stringify(updated));
        setExistingRegistrations(updated);
      } catch {
        // storage overflow fallback
      }

      setRegisteredMember(newRegistration);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  }

  // If successfully registered, show Digital Alumni Membership ID Card
  if (registeredMember) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Success Banner */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl font-black">
            ✓
          </div>
          <h2 className="text-xl font-black text-emerald-900 sm:text-2xl">
            Alumni Registration & Verification Completed!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-700 max-w-xl mx-auto">
            Welcome to the official Hogwarts Institute of Technology Global Alumni Association! Your final year ID proof has been cataloged and your official digital membership card is generated below.
          </p>
        </div>

        {/* Digital Alumni Membership Card */}
        <div className="max-w-xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-[#072457] via-[#0b3d91] to-[#041e42] p-6 text-white shadow-2xl">
            {/* Background Watermark */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="pointer-events-none absolute right-4 bottom-4 text-7xl font-black text-white/[0.05]">
              HIT
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-900 font-black text-base shadow">
                  HIT
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide text-white">HOGWARTS INSTITUTE OF TECHNOLOGY</h3>
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                    Official Alumni Association Card
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-black text-emerald-300 border border-emerald-400/30">
                ● ACTIVE
              </span>
            </div>

            {/* Card Body */}
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Alumnus Name</p>
                  <p className="text-lg font-black text-white">{registeredMember.fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-blue-200 uppercase">Degree & Batch</p>
                    <p className="font-extrabold text-amber-300">
                      {registeredMember.degree} ({registeredMember.graduationYear})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-200 uppercase">Department</p>
                    <p className="font-semibold text-white truncate">{registeredMember.department}</p>
                  </div>
                </div>

                <div className="text-xs">
                  <p className="text-[10px] font-bold text-blue-200 uppercase">Current Role</p>
                  <p className="font-semibold text-white">
                    {registeredMember.designation ? `${registeredMember.designation} at ${registeredMember.company}` : registeredMember.employmentStatus}
                  </p>
                </div>
              </div>

              {/* QR & Verification Box */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 text-center backdrop-blur border border-white/10">
                {/* Simulated QR Code */}
                <div className="h-20 w-20 rounded bg-white p-1 shadow flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-slate-900 rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${i % 3 === 0 || i === 5 || i === 10 ? 'bg-white' : 'bg-slate-900'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="mt-1.5 text-[9px] font-mono text-amber-300 font-bold">
                  {registeredMember.id}
                </span>
                <span className="mt-0.5 text-[8px] text-emerald-300 font-semibold">
                  ✓ ID Proof Verified
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-blue-200">
              <span>Member Since: {registeredMember.registeredAt}</span>
              <span>Doc: {registeredMember.idProofFileName} ({registeredMember.idProofFileSize})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-primary bg-[#0b3d91] hover:bg-[#082e6e] text-xs font-bold"
            >
              🖨️ Print / Save Membership Card
            </button>
            <button
              type="button"
              onClick={() => {
                setRegisteredMember(null);
                setIdProofFile(null);
                setIdProofPreview(null);
              }}
              className="btn btn-secondary text-xs font-bold"
            >
              + Register Another Alumnus
            </button>
            <Link
              to="/alumni/activities"
              className="btn btn-secondary text-xs font-bold text-[#0b3d91]"
            >
              Explore Alumni Activities &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/50 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="badge bg-[#0b3d91] text-white font-bold text-[10px]">
              Alumni Membership Enrollment
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Official Alumni Registration Form
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Join the official network to receive lifetime campus privileges, alumni newsletter, chapter invitations, student mentorship opportunities, and library digital portal access.
            </p>
          </div>
          {existingRegistrations.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDirectory(!showDirectory)}
              className="self-start sm:self-auto rounded-lg border border-blue-300 bg-white px-3.5 py-2 text-xs font-bold text-[#0b3d91] hover:bg-blue-50 transition shadow-sm"
            >
              {showDirectory ? 'Back To Registration' : `View Registered Alumni (${existingRegistrations.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Directory of previously registered alumni in this browser session */}
      {showDirectory ? (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Registered Alumni Directory (Local Session)</h3>
            <button
              type="button"
              onClick={() => setShowDirectory(false)}
              className="btn btn-secondary text-xs"
            >
              ✕ Close Directory
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {existingRegistrations.map((mem) => (
              <div key={mem.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{mem.fullName}</span>
                    <span className="badge bg-blue-100 text-[#0b3d91] font-mono text-[10px]">
                      {mem.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {mem.degree} ({mem.graduationYear}) · {mem.department}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {mem.designation ? `${mem.designation} at ${mem.company}` : mem.employmentStatus} · {mem.city}, {mem.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    ✓ ID Verified: {mem.idProofFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegisteredMember(mem)}
                    className="rounded bg-[#0b3d91] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#082e6e]"
                  >
                    View Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* The Registration Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b3d91]">Step 1 of 5</span>
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Provide your basic contact and identity information</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="label text-xs">Full Name (as per College Records) *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Anand Kumar"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Personal Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. anand.kumar@gmail.com"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Current City & State *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India / USA / UK"
                  className="input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details at HIT */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b3d91]">Step 2 of 5</span>
              <h3 className="text-base font-bold text-slate-900">Academic & Graduation Record</h3>
              <p className="text-xs text-slate-500">Details of your academic degree and department at HIT</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label text-xs">Degree Conferred *</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="input text-xs"
                >
                  <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                  <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                  <option value="M.Tech">M.Tech (Master of Technology)</option>
                  <option value="M.E.">M.E. (Master of Engineering)</option>
                  <option value="MBA">MBA (Master of Business Administration)</option>
                  <option value="Ph.D.">Ph.D. / Doctoral Research</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="label text-xs">Department / Branch of Study *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input text-xs"
                >
                  {siteConfig.departments.map((d) => (
                    <option key={d.slug} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-xs">Graduation Batch / Year *</label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="input text-xs font-semibold"
                >
                  {Array.from({ length: 45 }).map((_, i) => {
                    const year = 2026 - i;
                    return (
                      <option key={year} value={year}>
                        {year} {year === 2026 ? '(Current Graduating)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="label text-xs">College Roll / Register No.</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. HIT20CS042"
                  className="input text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Final / Last Year ID Proof Verification (CRITICAL USER REQUIREMENT) */}
          <div className="card p-6 sm:p-7 space-y-5 border-2 border-blue-200 bg-gradient-to-b from-blue-50/40 via-white to-white">
            <div className="border-b border-blue-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="badge bg-amber-400 text-slate-900 font-extrabold text-[10px]">
                  Step 3 of 5 · Mandatory Document
                </span>
                <h3 className="text-base font-bold text-[#0b3d91] mt-1">
                  Last Year ID Proof / Graduation Credential Verification
                </h3>
                <p className="text-xs text-slate-600">
                  Please upload your <strong>Final Year College ID Card</strong>, Degree Certificate, Provisional Certificate, or Final Year Marksheet.
                </p>
              </div>
              <span className="badge bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold self-start sm:self-auto">
                * ID Proof Required
              </span>
            </div>

            {/* Upload Area */}
            <div>
              {!idProofFile ? (
                <label
                  htmlFor={fileInputId}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-center hover:bg-blue-50 hover:border-[#0b3d91] transition cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#0b3d91] mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Click to browse or drag & drop your Last Year ID Card or Degree Scan
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts JPG, PNG, WEBP, or PDF (Maximum allowed file size: 5 MB)
                  </p>
                  <span className="mt-3 inline-flex items-center rounded-lg bg-[#0b3d91] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                    Select File
                  </span>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              ) : (
                /* Uploaded File Preview Card */
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {idProofPreview && idProofPreview !== 'pdf' ? (
                        <img
                          src={idProofPreview}
                          alt="ID Proof preview"
                          className="h-16 w-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-black text-xs border border-rose-200">
                          PDF DOC
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{idProofFile.name}</p>
                          <span className="badge bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                            ✓ Ready for Verification
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Size: {(idProofFile.size / 1024).toFixed(1)} KB · Type: {idProofFile.type || 'Document'}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          Document attached successfully for alumni credential authentication.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeIdProof}
                      className="self-start sm:self-auto rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      ✕ Remove / Change File
                    </button>
                  </div>
                </div>
              )}

              {idProofError && (
                <p className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
                  <span>⚠</span> {idProofError}
                </p>
              )}

              <p className="mt-2 text-[11px] text-slate-500">
                🔒 <strong>Privacy Note:</strong> Your uploaded ID proof is used exclusively by the Alumni Verification Committee to ensure network authenticity and will never be shared publicly.
              </p>
            </div>
          </div>

          {/* Section 4: Current Professional Details */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b3d91]">Step 4 of 5</span>
              <h3 className="text-base font-bold text-slate-900">Current Professional Profile</h3>
              <p className="text-xs text-slate-500">Where are you currently working or innovating?</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="label text-xs">Current Employment Status *</label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Employed in Industry">Employed in Industry</option>
                  <option value="Entrepreneur / Founder">Entrepreneur / Founder</option>
                  <option value="Pursuing Higher Studies (MS / PhD)">Pursuing Higher Studies (MS / PhD)</option>
                  <option value="Research & Academia">Research & Academia</option>
                  <option value="Civil / Public Services">Civil / Public Services</option>
                  <option value="Consultant / Freelancer">Consultant / Freelancer</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Current Organization / Employer</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google / Microsoft / ISRO / Startup"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Designation / Role Title</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Senior Software Architect"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="label text-xs">Industry Sector</label>
                <select
                  value={formData.industrySector}
                  onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                  className="input text-xs"
                >
                  <option value="IT & Software">IT & Software</option>
                  <option value="Electronics & Semiconductors">Electronics & Semiconductors</option>
                  <option value="Aerospace & Defense">Aerospace & Defense</option>
                  <option value="Automobile & EV">Automobile & EV</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Healthcare & Bio-Tech">Healthcare & Bio-Tech</option>
                  <option value="Civil & Infrastructure">Civil & Infrastructure</option>
                  <option value="Higher Education & Research">Higher Education & Research</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Years of Professional Experience</label>
                <select
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="input text-xs"
                >
                  <option value="0-1">0 - 1 Year (Recent Graduate)</option>
                  <option value="2-5">2 - 5 Years</option>
                  <option value="6-10">6 - 10 Years</option>
                  <option value="11-20">11 - 20 Years</option>
                  <option value="20+">20+ Years (Senior Leader)</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Engagement & Giving Back */}
          <div className="card p-6 sm:p-7 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b3d91]">Step 5 of 5</span>
              <h3 className="text-base font-bold text-slate-900">Alumni Contribution & Engagement Preferences</h3>
              <p className="text-xs text-slate-500">How would you like to stay engaged and empower current HIT students?</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  key: 'willingToMentor',
                  title: 'Student Mentorship ("Margadarshi")',
                  desc: 'Offer 1-2 hours monthly for 1-on-1 career or technical coaching for pre-final/final year students.',
                },
                {
                  key: 'willingToSpeak',
                  title: 'Guest Lectures & Masterclasses',
                  desc: 'Deliver tech talks, workshops, or industry webinars on emerging technologies and market practices.',
                },
                {
                  key: 'willingToHire',
                  title: 'Internship & Job Referrals',
                  desc: 'Provide internship leads or recruitment referrals at your organization for HIT students.',
                },
                {
                  key: 'willingToFund',
                  title: 'Scholarship & Seed Grant Fund',
                  desc: 'Contribute towards student merit scholarships or startup incubation grants.',
                },
                {
                  key: 'willingToLeadChapter',
                  title: 'City Chapter Coordination',
                  desc: 'Help organize local alumni meetups, networking dinners, or professional mixers in your city.',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0b3d91] focus:ring-[#0b3d91]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Action Box */}
          <div className="card p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Ready to complete your Alumni Registration?</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensure your final year ID proof is selected above. Your membership ID and digital pass will be issued immediately upon submission.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-xs font-black text-slate-900 shadow-lg hover:bg-amber-300 transition disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  Verifying ID Proof & Registering...
                </span>
              ) : (
                'Submit Registration & Generate Card &rarr;'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

