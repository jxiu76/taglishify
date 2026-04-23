"use client";
import { useState } from 'react';
import UploadBox from '../components/UploadBox';
import SystemMonitor from '../components/SystemMonitor';
import Editor from '../components/Editor';

export default function Home() {
  const [processResult, setProcessResult] = useState<any>(null);

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center space-y-4">
         <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 pb-2">
            Taglishify
         </h1>
         <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional Taglish Subtitles powered by Whisper Large V3 Turbo & Gemini 1.5 Flash.
         </p>
      </div>

      {!processResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UploadBox onUploadSuccess={(data) => setProcessResult(data)} />
            
            <div className="grid grid-cols-2 gap-8 mt-8">
               <div className="glass-panel text-center hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-lg font-medium text-white mb-2">Recent Projects</h4>
                  <p className="text-sm text-gray-500">Local indexedDB empty.</p>
               </div>
               <div className="glass-panel text-center hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-lg font-medium text-white mb-2">Settings / Refiner Config</h4>
                  <p className="text-sm text-gray-500 text-green-400">Gemini 1.5 Flash Active<br />Max Limit: 42 Chars</p>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <SystemMonitor />
          </div>
        </div>
      ) : (
        <Editor rawAsr={processResult.raw_asr} initialRefined={processResult.refined_subtitles} />
      )}
    </main>
  );
}
