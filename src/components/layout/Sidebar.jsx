import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Home, ListChecks, Settings, X, LayoutGrid } from 'lucide-react'; // Added LayoutGrid for logo
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Transactions', path: '/transactions', icon: ListChecks },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => { // Receive props
  const location = useLocation();
  const { theme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const navItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };
  
  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } },
  };

  return (
    <>
      {/* Sidebar for larger screens (static) */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-card text-card-foreground shadow-xl z-40 border-r",
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        )}
      >
        <motion.div 
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="p-6 border-b flex items-center space-x-3"
        >
          <LayoutGrid className="h-8 w-8 text-primary" />
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange">
            ExpenseWise
          </Link>
        </motion.div>
        <nav className="flex-grow px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 + 0.3 }} // Adjust delay
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive || (item.path === '/' && location.pathname === '/')
                        ? "bg-primary/20 text-primary font-semibold shadow-inner"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t mt-auto">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ExpenseWise</p>
        </div>
      </aside>

      {/* Mobile Sidebar (drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.aside
              key="mobile-sidebar"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "fixed top-0 left-0 h-full w-64 bg-card text-card-foreground shadow-xl z-50 transform md:hidden",
                "flex flex-col",
                theme === 'dark' ? 'border-r border-gray-700' : 'border-r border-gray-200'
              )}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange">
                  ExpenseWise
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close sidebar">
                  <X />
                </Button>
              </div>
              <nav className="flex-grow px-4 py-4">
                <ul className="space-y-2">
                  <AnimatePresence>
                    {navItems.map((item, index) => (
                      <motion.li
                        key={item.name + '-mobile'}
                        variants={navItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavLink
                          to={item.path}
                          onClick={toggleSidebar} 
                          className={({ isActive }) =>
                            cn(
                              "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out",
                              "hover:bg-primary/10 hover:text-primary",
                              isActive || (item.path === '/' && location.pathname === '/')
                                ? "bg-primary/20 text-primary font-semibold shadow-inner"
                                : "text-muted-foreground"
                            )
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </NavLink>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </nav>
              <div className="p-4 border-t mt-auto">
                <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ExpenseWise</p>
              </div>
            </motion.aside>
            
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;