import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, LogOut, UserCircle, Menu } from 'lucide-react'; // Added Menu icon
import { motion } from 'framer-motion';

const Navbar = ({ setIsSidebarOpen, isSidebarOpen }) => { // Receive props
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <motion.nav 
      className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <div className="flex items-center">
          {/* Mobile Menu Button - visible only on md and smaller screens */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden" // Hide on larger screens
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </Button>
          
          {/* Logo/Title - hidden on md and smaller if menu button is present, otherwise shown */}
          {/* On larger screens, this will be visible as a part of the natural flow */}
          <Link 
            to={isAuthenticated ? "/" : "/auth"} 
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange"
          >
            ExpenseWise
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2 text-sm">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">{user.name || user.email}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;