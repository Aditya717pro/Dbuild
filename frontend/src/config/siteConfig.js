// College Management Portal - site configuration
// Configured to match Hogwarts Institute of Technology
export const siteConfig = {
  collegeName: 'Hogwarts Institute of Technology',
  shortName: 'HIT',
  establishmentText: 'Established 1951',
  tagline: 'Empowering the Next Generation',
  anniversaryText: '75 Years of Academic Excellence (1951 - 2026)',
  heroHeadline: 'Your Journey STARTS HERE.',
  heroSubtext: 'Building Tomorrow\'s Leaders through industry-aligned curriculum, world-class faculty, modern labs, and 100% placement support.',
  theme: {
    primary: '#0b3d91', // HIT Royal Blue
    primaryHover: '#082f70',
    accent: '#0284c7',
  },
  contact: {
    address: 'Hogwarts Institute of Technology, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034, India',
    phone: '+91 80 4718 2300',
    email: 'info@hit.edu.in',
    officeHours: 'Mon - Sat, 9:00 AM - 5:30 PM',
  },
  accreditations: [
    { code: 'EST. 1951', type: 'code', label: 'Established 1951' },
    { code: 'QS 5★', type: 'qs', label: 'QS 5-Star Rated' },
    { code: 'THE', type: 'the', label: 'THE Impact Ranked' },
    { code: 'ABET', type: 'abet', label: 'ABET-Aligned Curriculum' },
    { code: 'SDGs', type: 'sdg', label: 'UN SDGs Committed' },
  ],
  stats: [
    { label: 'Years of Excellence', value: '75' },
    { label: 'Global Alumni', value: '26,000+' },
    { label: 'Faculty & Researchers', value: '350+' },
    { label: 'Placement Rate', value: '96%' },
  ],
  departments: [
    { name: 'Computer Science and Engineering', slug: 'cse', code: 'CSE', accredited: true, category: 'Engineering' },
    { name: 'Information Technology', slug: 'it', code: 'IT', accredited: false, category: 'Engineering' },
    { name: 'Artificial Intelligence and Data Science', slug: 'aids', code: 'AI & DS', accredited: false, category: 'Engineering' },
    { name: 'Artificial Intelligence and Machine Learning', slug: 'aiml', code: 'AI & ML', accredited: false, category: 'Engineering' },
    { name: 'Electronics and Communication Engineering', slug: 'ece', code: 'ECE', accredited: true, category: 'Engineering' },
    { name: 'Electrical and Electronics Engineering', slug: 'eee', code: 'EEE', accredited: false, category: 'Engineering' },
    { name: 'Mechanical Engineering', slug: 'mech', code: 'MECH', accredited: true, category: 'Engineering' },
    { name: 'Civil Engineering', slug: 'civil', code: 'CIVIL', accredited: false, category: 'Engineering' },
    { name: 'Bio-Medical Engineering', slug: 'bme', code: 'BME', accredited: true, category: 'Engineering' },
    { name: 'Medical Electronics', slug: 'mde', code: 'MDE', accredited: false, category: 'Engineering' },
    { name: 'Management Studies (MBA)', slug: 'mba', code: 'MBA', accredited: false, category: 'Management' },
    { name: 'Science and Humanities', slug: 'sh', code: 'S&H', accredited: false, category: 'Basic Sciences' },
  ],
  shortcutLinks: [
    { label: 'CAREER', to: '/career' },
    { label: 'ERP - LOGIN', to: '/login', isLogin: true },
  ],
  navItems: [
    { label: 'Home', to: '/', isHome: true },
    {
      label: 'ABOUT',
      to: '/about',
      hasDropdown: true,
      children: [
        { label: 'About HIT', to: '/about' },
        { label: 'Objectives & Vision', to: '/about/objectives' },
        { label: 'Secretary Message', to: '/about/secretary-message' },
        { label: 'Governing Council', to: '/about/governing-council' },
        { label: 'Principal Profile', to: '/about/principal-profile' },
        { label: 'Governance Committees', to: '/about/committees' },
      ],
    },
    {
      label: 'ADMISSION',
      to: '/admission',
      hasDropdown: true,
      children: [
        { label: 'UG Programmes', to: '/admission/ug' },
        { label: 'PG Programmes', to: '/admission/pg' },
      ],
    },
    {
      label: 'DEPARTMENTS',
      to: '/departments',
      hasDropdown: true,
      isMega: true,
    },
    {
      label: 'CAREER DEVELOPMENT',
      to: '/career-development',
      hasDropdown: true,
      children: [
        { label: 'Career Development Cell', to: '/career-development' },
        { label: 'Training & Skill Development', to: '/career-development/training' },
      ],
    },
    {
      label: 'PLACEMENT',
      to: '/career-development/placements',
      hasDropdown: true,
      children: [
        { label: 'Placement Statistics & Records', to: '/career-development/placements' },
        { label: 'Top Recruiting Companies', to: '/career-development/recruiters' },
      ],
    },
    {
      label: 'INNOVATION',
      to: '/innovation',
      hasDropdown: true,
      children: [
        { label: 'Innovation Council', to: '/innovation/iic' },
        { label: 'IDEA Lab', to: '/innovation/idea-lab' },
        { label: 'Startup Incubator', to: '/innovation/incubator' },
        { label: 'Product Development Hub', to: '/innovation/product-hub' },
      ],
    },
    {
      label: 'R&D',
      to: '/research',
      hasDropdown: true,
      children: [
        { label: 'Research Objectives & Council', to: '/research/council' },
        { label: 'Recognized Research Centres', to: '/research/centres' },
        { label: 'Recognized Supervisors & Scholars', to: '/research/supervisors' },
        { label: 'Grants & Sponsored Projects', to: '/research/grants' },
        { label: 'Patents & Copyrights', to: '/research/patents' },
      ],
    },
    {
      label: 'ALUMNI',
      to: '/alumni',
      hasDropdown: true,
      children: [
        { label: 'Alumni Association', to: '/alumni' },
        { label: 'Alumni Meet & Activities', to: '/alumni/activities' },
        { label: 'Renowned Alumni', to: '/alumni/renowned' },
        { label: 'Alumni Registration Link', to: '/alumni/register' },
      ],
    },
  ],
  quickLinks: [
    { label: 'Home', to: '/' },
    { label: 'About HIT', to: '/about' },
    { label: 'Admission', to: '/admission' },
    { label: 'Placements', to: '/career-development/placements' },
    { label: 'Contact Us', to: '/contact' },
  ],
};
