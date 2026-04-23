"use client";
import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function Editor({ rawAsr, initialRefined }: { rawAsr: string, initialRefined: string }) {
  const [text, setText] = useState(initialRefined || "");

  // Check 42 Char Limits dynamically
  const lines = (text || "").split('\n');
  const hasErrors = lines.some(line => line.length > 42);

  const exportText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "taglish_subtitles.srt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="glass-panel mt-8 flex flex-col h-[700px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">SRT Refiner Editor</h2>
        <button onClick={exportText} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm transition-colors">
          <Download className="w-4 h-4" />
          <span>Export .SRT / .VTT</span>
        </button>
      </div>

      <div className="flex flex-col h-full min-h-0">
        {/* Unified Editor Pane */}
        <div className={`flex flex-col min-h-0 bg-black/40 rounded-xl border p-6 relative ${hasErrors ? 'border-red-500/50' : 'border-white/5'}`}>
          <div className="flex justify-between items-center mb-4">
             <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold">Subtitles Editor (Taglishified)</div>
             {hasErrors && <span className="text-xs text-red-500 font-bold animate-pulse">⚠️ Over 42 Chars Found</span>}
          </div>
          <textarea 
            className={`w-full h-full bg-transparent resize-none focus:outline-none text-base font-mono leading-relaxed ${hasErrors ? 'text-red-300' : 'text-gray-100'}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
