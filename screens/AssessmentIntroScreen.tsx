
import React from 'react';

interface Props {
  onStart: () => void;
  onBack: () => void;
  attempts: number;
}

const AssessmentIntroScreen: React.FC<Props> = ({ onStart, onBack, attempts }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
             <button onClick={onBack} className="text-sm text-gray-500 font-bold hover:text-gray-800">← Back</button>
             <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Attempts: {attempts} / 2</span>
        </div>
        
        <div className="p-10 text-center space-y-8">
            <div>
                <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase mb-4">Day 1 EMR Assessment</h1>
                <p className="text-lg text-gray-500 font-medium">Final Graded Simulation for Dental EMR Proficiency</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-600 text-left space-y-4">
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Assessment Overview</h2>
                <p className="text-sm text-blue-800 leading-relaxed">
                    This is a formal, graded assessment covering the Day 1 curriculum. You will be evaluated on your ability to navigate and perform tasks related to:
                </p>
                <ul className="text-xs text-blue-700 space-y-2 font-bold ml-4 list-disc">
                    <li>Module 1: Appointment Scheduling</li>
                    <li>Module 2: Patient Records & Family Management</li>
                    <li>Module 3: Ledger & Financial Stewardship</li>
                    <li>Module 4: Office Management Reports</li>
                    <li>Module 5: Clinical Charting & Progress Notes</li>
                </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-blue-500">ℹ️</span> Instructions
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Complete the 35 tasks listed in the Guide. Your actions are tracked and verified automatically.</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-green-500">✅</span> Submission
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">At the end, take a screenshot of your score and upload it to Talent LMS for credit.</p>
                </div>
            </div>

            <div className="pt-6">
                <button 
                    onClick={onStart}
                    className="w-full py-4 bg-[#004b8d] text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-blue-900 transition-all active:scale-95"
                >
                    Start Graded Assessment
                </button>
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Passing Threshold: 80% (28/35 Tasks)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentIntroScreen;
