import { Outlet } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
