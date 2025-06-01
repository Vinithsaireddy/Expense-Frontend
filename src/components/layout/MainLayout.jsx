import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AnimatedBackground from '@/components/layout/AnimatedBackground';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Add state for sidebar

  return (
    <div className="flex min-h-screen bg-background">
      <AnimatedBackground />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Pass state to Sidebar */}
      
      {/* Adjust margin based on sidebar state for larger screens */}
      <div 
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0' 
        } md:ml-64`} // Keep md:ml-64 for default state on larger screens where sidebar is static
      >
        <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} /> {/* Pass sidebar state to Navbar */}
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10">
          <motion.div
              key={location.pathname} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          >
              <Outlet />
          </motion.div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground z-10 border-t">
          <p>Expense Wise</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;