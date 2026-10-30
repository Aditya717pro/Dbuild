import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import ProtectedRoute, {

  RequireCdcOrAdmin,
  RequireRole,
} from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import PublicLayout from './components/public/PublicLayout.jsx';
import PageLoader from './components/public/PageLoader.jsx';
import HomePage from './pages/public/HomePage.jsx';
import {
  AboutPage,
  AdmissionPage,
  AcademicsPage,
  AccreditationPage,
  RankingsPage,
  CareerDevelopmentPage,
  CampusPage,
  LibraryPage,
  InnovationPage,
  ContactPage,
  CareerPage,
} from './pages/public/PublicStaticPages.jsx';
import AlumniPage from './pages/public/AlumniPage.jsx';
import ResearchPage from './pages/public/ResearchPage.jsx';
import DepartmentDetailWrapper from './pages/public/DepartmentDetailWrapper.jsx';

function AboutSectionWrapper() {
  const { section } = useParams();
  return <AboutPage section={section} />;
}
function AdmissionSectionWrapper() {
  const { section, course } = useParams();
  return <AdmissionPage key={`${section}-${course || 'index'}`} section={section} courseSlug={course} />;
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
import LoginPortalPage from './pages/auth/LoginPortalPage.jsx';
import { AdminDashboardPage, FacultyDashboardPage, StudentDashboardPage } from './pages/dashboard/RoleDashboardNew.jsx';
import RoleDashboard from './pages/RoleDashboard.jsx';
import ManageDepartmentsPage from './pages/manage/ManageDepartmentsPage.jsx';
import ManageStudentsPage from './pages/manage/ManageStudentsPage.jsx';
import ManageFacultyPage from './pages/manage/ManageFacultyPage.jsx';
import ManageEnrollmentsPage from './pages/manage/ManageEnrollmentsPage.jsx';
import ManagePlacementPostersPage from './pages/manage/ManagePlacementPostersPage.jsx';
import InnovationPortalLayout from './pages/innovation/InnovationPortalLayout.jsx';
import InnovationDashboardPage from './pages/innovation/InnovationDashboardPage.jsx';
import InnovationIdeasPage from './pages/innovation/InnovationIdeasPage.jsx';
import InnovationProjectsPage from './pages/innovation/InnovationProjectsPage.jsx';
import InnovationStartupsPage from './pages/innovation/InnovationStartupsPage.jsx';
import InnovationMentorsPage from './pages/innovation/InnovationMentorsPage.jsx';
import InnovationEventsPage from './pages/innovation/InnovationEventsPage.jsx';
import InnovationLabPage from './pages/innovation/InnovationLabPage.jsx';
import InnovationResearchPage from './pages/innovation/InnovationResearchPage.jsx';
import InnovationAdminPage from './pages/innovation/InnovationAdminPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import FacultyPage from './pages/FacultyPage.jsx';
import EnrollmentsPage from './pages/EnrollmentsPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import StudentRecordsPage from './pages/StudentRecordsPage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <>
      <PageLoader />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage section="about" />} />
          <Route path="/about/:section" element={<AboutSectionWrapper />} />
          <Route path="/admission" element={<AdmissionPage section="admission" />} />
          <Route path="/admission/:section" element={<AdmissionSectionWrapper />} />
          <Route path="/admission/:section/:course" element={<AdmissionSectionWrapper />} />
          <Route path="/departments" element={<Navigate to="/departments/cse" replace />} />
          <Route path="/departments/:slug" element={<DepartmentDetailWrapper />} />
          <Route path="/academics" element={<AcademicsPage section="academics" />} />
          <Route path="/academics/:section" element={<AcademicsSectionWrapper />} />
          <Route path="/accreditation" element={<AccreditationPage section="accreditation" />} />
          <Route path="/accreditation/:section" element={<AccreditationSectionWrapper />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/rankings/:sub" element={<RankingsPage />} />
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
        </Route>

        <Route path="/login" element={<LoginPortalPage />} />
        <Route
          path="/login/student"
          element={<RoleLoginPage allowedRole="student" title="Student Login" subtitle="View your end semester marksheet, attendance, and fees details" />}
        />
        <Route
          path="/login/teacher"
          element={<RoleLoginPage allowedRole="faculty" title="Teacher Login" subtitle="Mark and review attendance for every student" />}
        />
        <Route path="/login/faculty" element={<Navigate to="/login/teacher" replace />} />
        <Route
          path="/login/admin"
          element={<RoleLoginPage allowedRole="admin" title="Admin Login" subtitle="Manage the college portal" />}
        />
        <Route path="/admin/login" element={<Navigate to="/login/admin" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
          <Route path="/admin/dashboard" element={<RequireRole roles={['admin']}><AdminDashboardPage /></RequireRole>} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route
            path="/student/records"
            element={<RequireRole roles={['student']}><StudentRecordsPage /></RequireRole>}
          />
          <Route
            path="/announcements"
            element={(
              <RequireCdcOrAdmin>
                <AnnouncementsPage />
              </RequireCdcOrAdmin>
            )}
          />
          <Route
            path="/students"
            element={<RequireRole roles={['admin']}><StudentsPage /></RequireRole>}
          />
          <Route
            path="/enrollments"
            element={<RequireRole roles={['admin']}><EnrollmentsPage /></RequireRole>}
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
          <Route
            path="/placement-posters"
            element={<RequireCdcOrAdmin><ManagePlacementPostersPage /></RequireCdcOrAdmin>}
          />
          <Route path="/innovation/portal" element={<RequireRole roles={['admin', 'student']}><InnovationPortalLayout /></RequireRole>}>
            <Route index element={<InnovationDashboardPage />} />
            <Route path="ideas" element={<InnovationIdeasPage />} />
            <Route path="projects" element={<InnovationProjectsPage />} />
            <Route path="startups" element={<InnovationStartupsPage />} />
            <Route path="mentors" element={<InnovationMentorsPage />} />
            <Route path="events" element={<InnovationEventsPage />} />
            <Route path="lab" element={<InnovationLabPage />} />
            <Route path="research" element={<InnovationResearchPage />} />
            <Route
              path="admin"
              element={<RequireRole roles={['admin']}><InnovationAdminPage /></RequireRole>}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      </Routes>
    </>
  );
}
