import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RegisterItem from './pages/RegisterItem';
import PickupRequests from './pages/PickupRequests';
import Rewards from './pages/Rewards';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-main">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<RegisterItem />} />
              <Route path="/pickups" element={<PickupRequests />} />
              <Route path="/rewards" element={<Rewards />} />
              {/* Catch-all */}
              <Route path="*" element={
                <div className="app-404">
                  <span style={{ fontSize: 64 }}>♻️</span>
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="app-404-link">Go to Dashboard</a>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
