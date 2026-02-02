import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admins from './pages/Admins';
import CreateAnnouncement from './pages/CreateAnnouncement';
import StockReport from './pages/StockReport';
import Announcements from './pages/Announcements';
import FeeStatus from './pages/FeeStatus';
import SupportTicketsPage from './pages/SupportTicketsPage';
import Settings from './pages/Settings';
import Schools from './pages/Schools';
import AddSchool from './pages/AddSchool';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Parents from './pages/Parents';
import Notes from './pages/Notes';
import Help from './pages/Help';
import FloatingButton from './components/FloatingButton';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import './index.css';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="app-container">
      {!isLoginPage && (
        <>
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          {location.pathname !== '/notes' && <FloatingButton />}
        </>
      )}
      <main className={`main-content ${isLoginPage ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/create-announcement" element={<CreateAnnouncement />} />
          <Route path="/stock-report" element={<StockReport />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/fee-status" element={<FeeStatus />} />
          <Route path="/support-tickets" element={<SupportTicketsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/add-school" element={<AddSchool />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

