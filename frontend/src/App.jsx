import { Route, Routes, useParams } from 'react-router-dom';
import ProtectedRoute, { RequireRole } from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import PublicLayout from './components/public/PublicLayout.jsx';
import HomePage from './pages/public/HomePage.jsx';
import {
  AboutPage,
  AdmissionPage,
  DepartmentsPage as PublicDepartmentsPage,
  FacultyPage as PublicFacultyPage,
  AcademicsPage,
  AccreditationPage,
  NirfPage,
  CareerDevelopmentPage,
  CampusPage,
  LibraryPage,
  InnovationPage,
  ResearchPage,
  AlumniPage,
  ContactPage,
  CareerPage,
  OnlineFeePage,
  HallReservationPage,
} from './pages/public/PublicStaticPages.jsx';
import DepartmentDetailWrapper from './pages/public/DepartmentDetailWrapper.jsx';

function AboutSectionWrapper() {
  const { section } = useParams();
  return <AboutPage section={section} />;
}
function AdmissionSectionWrapper() {
  const { section } = useParams();
  return <AdmissionPage section={section} />;
}
function AcademicsSectionWrapper() {
  const { section } = useParams();
  return <AcademicsPage section={section} />;
}
function AccreditationSectionWrapper() {
  const { section } = useParams();
  return <AccreditationPage section={section} />;
}
import RoleLoginPage from './pages/auth/RoleLoginPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { AdminDashboardPage, FacultyDashboardPage, StudentDashboardPage } from './pages/dashboard/RoleDashboardNew.jsx';
import RoleDashboard from './pages/RoleDashboard.jsx';
import ManageDepartmentsPage from './pages/manage/ManageDepartmentsPage.jsx';
import ManageStudentsPage from './pages/manage/ManageStudentsPage.jsx';
import ManageFacultyPage from './pages/manage/ManageFacultyPage.jsx';
import ManageEnrollmentsPage from './pages/manage/ManageEnrollmentsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import FacultyPage from './pages/FacultyPage.jsx';
import EnrollmentsPage from './pages/EnrollmentsPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage section="about" />} />
        <Route path="/about/:section" element={<AboutSectionWrapper />} />
        <Route path="/admission" element={<AdmissionPage section="admission" />} />
        <Route path="/admission/:section" element={<AdmissionSectionWrapper />} />
        <Route path="/departments" element={<PublicDepartmentsPage />} />
        <Route path="/departments/:slug" element={<DepartmentDetailWrapper />} />
        <Route path="/faculty" element={<PublicFacultyPage />} />
        <Route path="/academics" element={<AcademicsPage section="academics" />} />
        <Route path="/academics/:section" element={<AcademicsSectionWrapper />} />
        <Route path="/accreditation" element={<AccreditationPage section="accreditation" />} />
        <Route path="/accreditation/:section" element={<AccreditationSectionWrapper />} />
        <Route path="/nirf" element={<NirfPage />} />
        <Route path="/nirf/:sub" element={<NirfPage />} />
        <Route path="/career-development" element={<CareerDevelopmentPage />} />
        <Route path="/career-development/:sub" element={<CareerDevelopmentPage />} />
        <Route path="/campus" element={<CampusPage />} />
        <Route path="/campus/:sub" element={<CampusPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:sub" element={<LibraryPage />} />
        <Route path="/innovation" element={<InnovationPage />} />
        <Route path="/innovation/:sub" element={<InnovationPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:sub" element={<ResearchPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/alumni/:sub" element={<AlumniPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/online-fee" element={<OnlineFeePage />} />
        <Route path="/hall-reservation" element={<HallReservationPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/login/student"
        element={<RoleLoginPage allowedRole="student" title="Student Login" subtitle="Access your courses and attendance" />}
      />
      <Route
        path="/login/faculty"
        element={<RoleLoginPage allowedRole="faculty" title="Staff Login" subtitle="Manage attendance and announcements" />}
      />
      <Route path="/admin/login" element={<LoginPage defaultRole="admin" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
          <Route path="/admin/dashboard" element={<RequireRole roles={['admin']}><AdminDashboardPage /></RequireRole>} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route
            path="/students"
            element={<RequireRole roles={['admin', 'faculty']}><StudentsPage /></RequireRole>}
          />
          <Route
            path="/enrollments"
            element={<RequireRole roles={['admin', 'faculty']}><EnrollmentsPage /></RequireRole>}
          />
          <Route
            path="/faculty/manage"
            element={<RequireRole roles={['admin']}><FacultyPage /></RequireRole>}
          />
          <Route
            path="/departments/manage"
            element={<RequireRole roles={['admin']}><ManageDepartmentsPage /></RequireRole>}
          />
          <Route
            path="/students/manage"
            element={<RequireRole roles={['admin']}><ManageStudentsPage /></RequireRole>}
          />
          <Route
            path="/faculty/manage-list"
            element={<RequireRole roles={['admin']}><ManageFacultyPage /></RequireRole>}
          />
          <Route
            path="/enrollments/manage"
            element={<RequireRole roles={['admin']}><ManageEnrollmentsPage /></RequireRole>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
