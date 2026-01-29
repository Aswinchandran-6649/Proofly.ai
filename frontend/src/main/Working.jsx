import React from 'react';
import { UserCircle2, FileUp, Hourglass, CheckCircle2 } from 'lucide-react';

const Working = ({ dark }) => {
  const userSteps = [
    {
      title: "1. Join Proofly",
      desc: "Create your personal account. This is where your digital warranties will live forever.",
      icon: <UserCircle2 size={32} className="text-blue-500" />,
      tag: "GET STARTED"
    },
    {
      title: "2. Upload Receipt",
      desc: "Take a clear photo of your purchase receipt and upload it. Make sure the date and item are visible.",
      icon: <FileUp size={32} className="text-purple-500" />,
      tag: "ACTION"
    },
    {
      title: "3. Seller Review",
      desc: "The store where you bought the item will check your receipt. Your status will show 'Pending' during this time.",
      icon: <Hourglass size={32} className="text-amber-500" />,
      tag: "WAITING"
    },
    {
      title: "4. Warranty Active",
      desc: "Once verified, your warranty turns green. You are now protected and can claim .",
      icon: <CheckCircle2 size={32} className="text-emerald-500" />,
      tag: "DONE"
    }
  ];

  return (
    <section id="how-it-works" className={`py-24 px-6 ${dark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Simplified Header */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            How to <span className="text-blue-600">Secure</span> your items.
          </h2>
          <p className="text-xl text-slate-500 font-medium italic">Follow these 4 steps to get protected.</p>
        </div>

        {/* High-Contrast List */}
        <div className="space-y-4">
          {userSteps.map((step, i) => (
            <div 
              key={i} 
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-[2rem] border-2 transition-all ${
                dark 
                ? "bg-[#0f172a] border-slate-800 hover:border-blue-500" 
                : "bg-slate-50 border-slate-100 hover:border-blue-400"
              }`}
            >
              {/* Icon Container */}
              <div className={`shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center ${dark ? "bg-black" : "bg-white"} border border-slate-800/50 shadow-xl`}>
                {step.icon}
              </div>

              {/* Text Area */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full tracking-widest uppercase">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">{step.title}</h3>
                <p className={`text-base leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Working;