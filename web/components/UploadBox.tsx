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
      onUploadSuccess(processData);
    } catch (e) {
      console.error(e);
      alert("Upload or API Processing Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className={`glass-panel border-2 border-dashed flex flex-col items-center justify-center p-12 transition-colors ${isHover ? 'border-blue-400 bg-white/10' : 'border-white/20'}`}
      onDragEnter={() => setIsHover(true)}
      onDragLeave={() => setIsHover(false)}
      whileHover={{ scale: 1.02 }}
    >
      <UploadCloud className="w-16 h-16 text-blue-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Drag & Drop Video Here</h2>
      <p className="text-gray-400 mb-6 max-w-sm text-center">Supports MP4, MKV up to 2GB. Whisper Large V3 Turbo handles the heavy lifting locally.</p>
      
      <label className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full cursor-pointer transition-colors shadow-lg shadow-blue-500/20">
        {loading ? "Processing via Next.js + FastAPI..." : "Select Local Video"}
        <input type="file" className="hidden" accept="video/mp4,video/x-m4v,video/*" onChange={handleFileChange} />
      </label>
    </motion.div>
  );
}
