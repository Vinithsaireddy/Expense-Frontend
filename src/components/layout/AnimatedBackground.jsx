import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const particleColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ backgroundColor: particleColor }}
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            scale: Math.random() * 0.3 + 0.1, // Smaller particles
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 30 + 20, // Slower, more ambient movement
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            width: Math.random() * 60 + 30, // Smaller particles
            height: Math.random() * 60 + 30, // Smaller particles
            backgroundColor: particleColor,
          }}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedBackground;