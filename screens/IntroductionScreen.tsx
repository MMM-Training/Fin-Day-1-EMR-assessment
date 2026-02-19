
import React from 'react';

interface IntroductionScreenProps {
  onGoToAssessment: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onGoToAssessment }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl p-12 space-y-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 text-center animate-scale-in">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner border border-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase leading-tight">EMR Proficiency Portal</h1>
          <p className="text-lg text-gray-500 font-medium max-w-md mx-auto">
            Ready to verify your skills? The Day 1 Graded Assessment tracks your proficiency across 35 core navigation tasks.
          </p>
        </div>

        <div className="bg-blue-50/50 p-8 rounded-2xl border-2 border-dashed border-blue-200">
           <div className="flex items-center justify-center gap-6 text-left mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Requirement</p>
                <p className="text-sm font-bold text-blue-900">80% Passing Score</p>
              </div>
              <div className="w-px h-10 bg-blue-200"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Attempts</p>
                <p className="text-sm font-bold text-blue-900">2 Permitted</p>
              </div>
              <div className="w-px h-10 bg-blue-200"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Duration</p>
                <p className="text-sm font-bold text-blue-900">Untimed</p>
              </div>
           </div>

           <button 
              onClick={onGoToAssessment}
              className="w-full py-5 bg-[#004b8d] text-white rounded-2xl font-black uppercase text-sm tracking-[0.15em] shadow-2xl hover:bg-blue-900 transition-all active:scale-95 transform flex items-center justify-center gap-3"
            >
              <span>Begin Day 1 Assessment</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Secured Assessment Environment • Simulation v4.5.1
        </p>
      </div>
    </div>
  );
};

export default IntroductionScreen;
