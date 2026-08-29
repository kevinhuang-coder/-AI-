import React from 'react';
import { GraduationCap, Award, Building2, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

export const AuthorBanner: React.FC = () => {
  return (
    <div className="w-full rounded-xl sm:rounded-full bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800/90 px-3.5 sm:px-4 py-2 sm:py-1.5 backdrop-blur-md shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
      {/* Left: Author identity & credentials */}
      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>筆者：黃玉龍 (Kevin Huang)</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Credentials Pills */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 text-[11px]">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
            <GraduationCap className="w-3 h-3 text-blue-400" />
            <span>彰師大會計碩士</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-medium">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>會計師高考及格</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
            <Building2 className="w-3 h-3 text-cyan-400" />
            <span>四大事務所審計實務</span>
          </span>
        </div>
      </div>

      {/* Right: Direct Blog link */}
      <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-auto">
        <a
          href="https://kevin-huang-cpa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition group"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>《凱文黃的知識天地》部落格專欄</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
