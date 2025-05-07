
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, BookOpenIcon, InfoIcon } from 'lucide-react';

const Settings = () => {
  // Function to open external links
  const openExternalLink = (url: string) => {
    try {
      // @ts-ignore: Electron API not in types
      window.api.openExternalLink(url);
    } catch (error) {
      console.error('Error opening link:', error);
      // Fallback to regular browser navigation if not in Electron
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-eliva-purple">Settings</h1>
      </motion.div>
      
      <Tabs defaultValue="about" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TabsList className="mb-6 bg-eliva-card/60">
            <TabsTrigger value="account" className="data-[state=active]:bg-eliva-purple data-[state=active]:text-white">
              <UserIcon size={16} className="mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-eliva-purple data-[state=active]:text-white">
              <InfoIcon size={16} className="mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-eliva-purple data-[state=active]:text-white">
              <BookOpenIcon size={16} className="mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>
        </motion.div>
        
        <TabsContent value="account">
          <GlassCard className="p-6" glow>
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-muted-foreground">Account settings coming soon.</p>
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="docs">
          <GlassCard className="p-6" glow>
            <h2 className="text-2xl font-bold mb-4">Documentation</h2>
            <p className="text-muted-foreground">Documentation coming soon.</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="about">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <GlassCard className="overflow-hidden" glow>
              <div className="p-8 relative">
                <motion.div 
                  className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-eliva-purple/20 to-eliva-accent/20 blur-3xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }} 
                  transition={{ 
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative z-10"
                >
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-eliva-accent to-eliva-purple bg-clip-text text-transparent">About Eliva Hardware Manager</h2>
                  <p className="text-lg text-white/80 mb-6">
                    A comprehensive hardware inventory management system for tracking products, sales, and analytics.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <Card className="bg-gradient-to-br from-eliva-card/80 to-eliva-highlight/60 border-white/5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-eliva-accent">Developer Profile</CardTitle>
                          <CardDescription>Meet the creator of this application</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-eliva-accent to-eliva-purple flex items-center justify-center text-white text-2xl font-bold">
                                FM
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">Festo Manolo</h3>
                                <p className="text-white/70">Software Developer</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-semibold text-white">Expertise</h4>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-eliva-purple/20 text-eliva-purple rounded-full text-sm">ElectronJS</span>
                                <span className="px-3 py-1 bg-eliva-accent/20 text-eliva-accent rounded-full text-sm">Mobile Apps</span>
                                <span className="px-3 py-1 bg-eliva-purple/20 text-eliva-purple rounded-full text-sm">Desktop Apps</span>
                                <span className="px-3 py-1 bg-eliva-accent/20 text-eliva-accent rounded-full text-sm">Web Applications</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <Card className="bg-gradient-to-br from-eliva-card/80 to-eliva-highlight/60 border-white/5 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-eliva-accent">Contact Information</CardTitle>
                          <CardDescription>Get in touch for software assistance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 bg-black/20 rounded-lg space-y-3">
                              <div 
                                onClick={() => openExternalLink('https://wa.me/255784953866')}
                                className="flex items-center gap-3 p-3 bg-eliva-highlight/30 rounded-md cursor-pointer hover:bg-eliva-highlight/50 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                  <span className="text-green-500 text-lg">W</span>
                                </div>
                                <div>
                                  <p className="font-medium text-white">WhatsApp</p>
                                  <p className="text-sm text-white/70">+255 784 953 866</p>
                                </div>
                              </div>
                              
                              <div 
                                onClick={() => openExternalLink('https://festomanolo.xyz')}
                                className="flex items-center gap-3 p-3 bg-eliva-highlight/30 rounded-md cursor-pointer hover:bg-eliva-highlight/50 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-eliva-purple/20 flex items-center justify-center">
                                  <span className="text-eliva-purple text-lg">W</span>
                                </div>
                                <div>
                                  <p className="font-medium text-white">Website</p>
                                  <p className="text-sm text-white/70">festomanolo.xyz</p>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-center text-white/60 text-sm italic">
                              For any complaints or software assistance, please contact using the information above
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-8 p-6 bg-gradient-to-r from-eliva-highlight/30 to-eliva-card/50 rounded-lg border border-white/5"
                  >
                    <h3 className="text-xl font-bold mb-3 text-white">About This Application</h3>
                    <p className="text-white/80">
                      Eliva Hardware Manager is a powerful inventory management system designed specifically for hardware stores. 
                      It features comprehensive product tracking, sales management, customer database, and analytics to help optimize business operations.
                      The application is built using Electron.js with React, utilizing SQLite for local data storage.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-md bg-eliva-purple/20 text-eliva-accent text-sm">Version 1.0.0</div>
                      <div className="px-3 py-1.5 rounded-md bg-eliva-accent/20 text-eliva-purple text-sm">© 2025 Festo Manolo</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
