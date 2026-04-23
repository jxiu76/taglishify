"use client";
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadBox({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) {
  const [isHover, setIsHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload
      let res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      let responseData = await res.json();
      
      // Step 2: Trigger processing loop
      const processForm = new FormData();
      processForm.append("filename", responseData.filename);
      let processRes = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: processForm
      });
      let processData = await processRes.json();
      if (!processRes.ok) {
         throw new Error(processData.detail || "Processing Failed on Backend");
      }
      onUploadSuccess(processData);
    } catch (e: any) {
      alert(`Backend Execution Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className={`glass-panel border-4 border-dashed flex flex-col items-center justify-center py-20 px-8 transition-colors ${isHover ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-slate-700' : 'border-blue-200 bg-blue-50/50 dark:border-slate-600 dark:bg-slate-700/50'}`}
      onDragEnter={() => setIsHover(true)}
      onDragLeave={() => setIsHover(false)}
      whileHover={{ scale: 1.02 }}
    >
      <UploadCloud className="w-20 h-20 text-blue-600 dark:text-blue-400 mb-4" />
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Upload your video here.</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-center">Supports MP4, MKV up to 2GB. Whisper Large V3 Turbo handles the heavy lifting locally.</p>
      
      <label className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xl font-semibold px-10 py-5 rounded-lg cursor-pointer transition-colors shadow-lg">
        {loading ? "Transcribing..." : "Select Video"}
        <input type="file" className="hidden" accept="video/mp4,video/x-m4v,video/*" onChange={handleFileChange} />
      </label>
    </motion.div>
  );
}
