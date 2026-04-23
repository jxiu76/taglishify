"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SystemMonitor() {
  const [stats, setStats] = useState({ cpu: 0, ram: 0, gpu: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:8000/system-monitor')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel w-full flex flex-col space-y-6">
      <h3 className="font-semibold text-lg text-white">Local System Status</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm"><span className="text-gray-400">CPU Usage</span> <span className="font-mono">{stats.cpu}%</span></div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div initial={{width: 0}} animate={{width: `${stats.cpu}%`}} className="h-full bg-purple-500" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm"><span className="text-gray-400">RAM Usage</span> <span className="font-mono">{stats.ram}%</span></div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div initial={{width: 0}} animate={{width: `${stats.ram}%`}} className="h-full bg-blue-500" />
        </div>
      </div>
      
      <div className="pt-4 mt-2 border-t border-white/10 text-xs text-gray-500 text-center">
        Powered by FastAPI psutil endpoint
      </div>
    </div>
  );
}
