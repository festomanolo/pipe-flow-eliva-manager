
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, Code, Cpu, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useTheme } from '@/components/ThemeProvider';

const skills = [
  { name: "ElectronJS", icon: <Cpu className="text-purple-500" size={24} /> },
  { name: "Mobile Apps", icon: <Smartphone className="text-indigo-500" size={24} /> },
  { name: "Desktop Apps", icon: <Monitor className="text-blue-500" size={24} /> },
  { name: "Web Applications", icon: <Code className="text-cyan-500" size={24} /> }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    } 
  }
};

const floatingAnimation = {
  y: [-5, 5],
  transition: {
    repeat: Infinity,
    repeatType: "reverse" as const,
    duration: 2,
    ease: "easeInOut"
  }
};

const AboutPage = () => {
  const { theme } = useTheme();
  const orbitRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Custom orbit animation using refs
    if (orbitRef.current) {
      const orbits = Array.from(orbitRef.current.children);
      orbits.forEach((orbit, index) => {
        const angle = 360 / orbits.length;
        const delay = index * 2;
        (orbit as HTMLElement).style.animation = `orbit ${10 + index * 5}s linear ${delay}s infinite`;
      });
    }
  }, []);

  // Replace the Electron shell with standard browser window.open
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 animate-fade-in">
      {/* Hero Section */}
      <motion.div 
        className="relative mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div ref={orbitRef} className="absolute inset-0 opacity-10">
            <div className="absolute w-40 h-40 rounded-full border-2 border-purple-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-72 h-72 rounded-full border-2 border-indigo-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-96 h-96 rounded-full border-2 border-blue-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Gradient Blobs */}
          <div className="absolute top-10 -left-20 w-64 h-64 bg-purple-500/20 dark:bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-500/20 dark:bg-blue-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Profile Section */}
        <motion.div
          className="text-center relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-xl"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              F
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-eliva-purple via-eliva-accent to-blue-500 bg-clip-text text-transparent"
            variants={item}
          >
            FestoManolo
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
            variants={item}
          >
            Professional developer with expertise in ElectronJS, mobile/desktop apps, and web applications.
          </motion.p>
          
          {/* Contact Links */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center mt-6"
            variants={item}
          >
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-eliva-card border border-gray-200 dark:border-white/10 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLink("https://wa.me/255784953866")}
            >
              <Phone size={18} className="text-green-500" />
              <span className="font-medium">+255 784 953 866</span>
              <ExternalLink size={14} className="ml-1 text-gray-400" />
            </motion.button>
            
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-eliva-card border border-gray-200 dark:border-white/10 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLink("https://festomanolo.xyz")}
            >
              <Globe size={18} className="text-blue-500" />
              <span className="font-medium">festomanolo.xyz</span>
              <ExternalLink size={14} className="ml-1 text-gray-400" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Expertise Section */}
      <motion.section 
        className="mb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            My Expertise
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.name}
              className="group"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { delay: 0.6 + index * 0.1 } 
              }}
            >
              <GlassCard glow className="p-6 h-full">
                <motion.div
                  animate={floatingAnimation}
                  className="w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-500/10 dark:to-blue-500/10 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300"
                >
                  {skill.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-eliva-accent transition-colors duration-300">
                  {skill.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Expert-level development and optimization for performance and user experience.
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mb-20"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Technology Stack
          </span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 animate-reveal-stagger">
          {['React', 'ElectronJS', 'React Native', 'TypeScript', 'Node.js', 'SQLite', 'TailwindCSS', 'MongoDB', 'AWS', 'Flutter'].map((tech) => (
            <div 
              key={tech}
              className="expertise-tag"
            >
              {tech}
            </div>
          ))}
        </div>
      </motion.section>
      
      {/* Call to Action */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <GlassCard className="p-8 max-w-2xl mx-auto" glow>
          <h3 className="text-2xl font-bold mb-4">Ready to work together?</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Let's create amazing applications together that exceed expectations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLink("https://wa.me/255784953866")}
            >
              Contact Me
              <ExternalLink size={16} className="ml-2 inline" />
            </motion.button>
            <motion.button
              className="px-6 py-3 bg-white dark:bg-eliva-card border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLink("https://festomanolo.xyz")}
            >
              Visit Website
              <ExternalLink size={16} className="ml-2 inline" />
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AboutPage;
