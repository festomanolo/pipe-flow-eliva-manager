import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, Code, Cpu, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useTheme } from '@/components/ThemeProvider';
import { openExternal } from '@/lib/electron-bridge';

const skills = [
  { name: 'React', icon: Code, color: '#61DAFB' },
  { name: 'Node.js', icon: Cpu, color: '#68A063' },
  { name: 'Mobile Development', icon: Smartphone, color: '#38BDF8' },
  { name: 'UI/UX Design', icon: Monitor, color: '#A78BFA' },
  { name: 'Electron', icon: Phone, color: '#9FEAF9' },
];

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const AboutPage = () => {
  const { theme } = useTheme();
  const orbitRef = useRef(null);
  
  useEffect(() => {
    // Custom orbit animation using refs
    if (orbitRef.current) {
      const orbits = Array.from(orbitRef.current.children);
      orbits.forEach((orbit, index) => {
        const delay = index * 2;
        (orbit as HTMLElement).style.animation = `orbit ${10 + index * 5}s linear ${delay}s infinite`;
      });
    }
  }, []);

  const handleOpenLink = (url: string) => {
    openExternal(url);
  };

  return (
    <motion.div
      className="container mx-auto p-6 md:p-12 lg:p-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-center mb-8 animate-reveal-up"
        variants={itemVariants}
      >
        About Pipe Flow Eliva Manager
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={itemVariants}
      >
        <GlassCard className="p-6">
          <motion.h2 className="text-xl font-semibold mb-4 animate-reveal-stagger">
            Our Mission
          </motion.h2>
          <motion.p className="text-muted-foreground animate-reveal-stagger">
            To revolutionize pipeline management through innovative technology,
            ensuring efficiency, safety, and sustainability.
          </motion.p>
        </GlassCard>

        <GlassCard className="p-6">
          <motion.h2 className="text-xl font-semibold mb-4 animate-reveal-stagger">
            Our Vision
          </motion.h2>
          <motion.p className="text-muted-foreground animate-reveal-stagger">
            To be the global leader in pipeline management solutions, setting the
            standard for excellence and driving positive change in the industry.
          </motion.p>
        </GlassCard>
      </motion.div>

      <motion.div
        className="mt-12"
        variants={itemVariants}
      >
        <motion.h2 className="text-2xl font-semibold mb-6 text-center animate-reveal-up">
          Our Expertise
        </motion.h2>
        <motion.div className="flex flex-wrap justify-center gap-4 animate-reveal-stagger">
          {skills.map((skill, index) => (
            <motion.span
              key={index}
              className="expertise-tag"
              style={{ backgroundColor: skill.color }}
              variants={itemVariants}
            >
              {skill.name}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12"
        variants={itemVariants}
      >
        <motion.h2 className="text-2xl font-semibold mb-6 text-center animate-reveal-up">
          Connect with Us
        </motion.h2>
        <motion.div className="flex justify-center gap-8 animate-reveal-stagger">
          <motion.button
            className="glass-button"
            onClick={() => handleOpenLink('https://www.example.com/company')}
            variants={itemVariants}
          >
            <Globe className="mr-2 h-5 w-5" />
            Visit Our Website
            <ExternalLink className="ml-2 h-4 w-4" />
          </motion.button>
          <motion.button
            className="glass-button"
            onClick={() => handleOpenLink('https://www.example.com/contact')}
            variants={itemVariants}
          >
            <Phone className="mr-2 h-5 w-5" />
            Contact Us
            <ExternalLink className="ml-2 h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 flex justify-center items-center"
        variants={itemVariants}
      >
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full border border-dashed border-eliva-purple/50 dark:border-eliva-accent/50" style={{ animation: 'orbit 20s linear 0s infinite' }}></div>
          <div className="absolute inset-0 rounded-full border border-dashed border-eliva-purple/50 dark:border-eliva-accent/50" style={{ animation: 'orbit 30s linear 5s infinite' }}></div>
          <div className="absolute inset-0 rounded-full border border-dashed border-eliva-purple/50 dark:border-eliva-accent/50" style={{ animation: 'orbit 40s linear 10s infinite' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold">Eliva<br />Manager</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
