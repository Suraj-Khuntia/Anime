import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import AnimeDetail from './pages/AnimeDetail';
import GenrePage from './pages/GenrePage';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import { LoginPage, SignUpPage, ForgotPasswordPage } from './pages/AuthPages';
import AuthModal from './components/auth/AuthModal';
import { FilterProvider } from './context/FilterContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <FilterProvider>
          <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-purple-600 selection:text-white">
            {/* Global User Auth Modal */}
            <AuthModal />

            {/* Top Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/search" element={<Search />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />
                <Route path="/genres/:name" element={<GenrePage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Site Footer */}
            <Footer />
          </div>
        </FilterProvider>
      </AuthProvider>
    </Router>
  );
}
