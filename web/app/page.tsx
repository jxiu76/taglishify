"use client";
import { useState, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import Editor from '../components/Editor';
import { Sun, Moon } from 'lucide-react';

export default function Home() {
  const [processResult, setProcessResult] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Header with Logo */}
      <header className="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-4 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
           <div className="flex items-center" style={{ width: '171.36px', height: '59.99px' }}>
             <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight whitespace-nowrap">
                Taglishify
             </h1>
           </div>
           <button 
             onClick={() => setIsDark(!isDark)}
             className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-sm"
             title="Toggle Dark Mode"
           >
             {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl flex flex-col items-center">
        {!processResult ? (
          <div className="w-full max-w-4xl text-center space-y-10">
            <div className="space-y-4">
               <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                  Transcribe & Translate Video
               </h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors">
                  Professional Taglish Subtitles powered by local ASR.
               </p>
            </div>
            
            <UploadBox onUploadSuccess={(data) => setProcessResult(data)} />
          </div>
        ) : (
          <div className="w-full space-y-6">
            <button 
              onClick={() => setProcessResult(null)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors shadow-sm font-medium flex items-center gap-2"
            >
              &larr; Back to Home
            </button>
            <div className="w-full text-left">
              <Editor rawAsr={processResult.raw_asr} initialRefined={processResult.refined_subtitles} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
