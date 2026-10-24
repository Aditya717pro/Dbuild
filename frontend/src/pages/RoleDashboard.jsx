import { useAuth } from '../context/AuthContext.jsx';
import { AdminDashboard, FacultyDashboard, StudentDashboard } from './Dashboards.jsx';

export default function RoleDashboard() {
  const { user } = useAuth();

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'faculty') return <FacultyDashboard />;
  return <StudentDashboard />;
}
