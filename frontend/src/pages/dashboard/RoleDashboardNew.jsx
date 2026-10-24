import { useAuth } from '../../context/AuthContext.jsx';
import { AdminDashboard, FacultyDashboard, StudentDashboard } from '../Dashboards.jsx';

export function AdminDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <AdminDashboard />;
}

export function FacultyDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <FacultyDashboard />;
}

export function StudentDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <StudentDashboard />;
}
