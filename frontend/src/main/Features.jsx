import React from 'react';
import { ShieldCheck, Zap, BarChart3, Users, Fingerprint, Globe } from 'lucide-react';

const Features = ({ dark }) => {
  const list = [
    { 
      title: "Vetted Ecosystem", 
      desc: "Every retail partner is personally verified by Admin oversight, ensuring a zero-fraud environment.", 
      icon: ShieldCheck, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      title: "Instant Verification", 
      desc: "Moving from 'Pending' to 'Active' in seconds. Sellers approve receipts with one-click automation.", 
      icon: Zap, 
      color: "from-amber-400 to-orange-500" 
    },
    { 
      title: "Retail Analytics", 
      desc: "Sellers track warranty distribution and claim rates through high-fidelity data visualization.", 
      icon: BarChart3, 
      color: "from-purple-500 to-indigo-500" 
    },
    { 
      title: "Managed Onboarding", 
      desc: "Direct Admin-to-Seller registration logic prevents public spam and secures the partner network.", 
      icon: Users, 
      color: "from-emerald-500 to-teal-500" 
    },
    { 
      title: "Digital Vault", 
      desc: "Users store and manage all lifetime warranties in one secure, accessible location.", 
      icon: Fingerprint, 
      color: "from-rose-500 to-pink-500" 
    },
    { 
      title: "Global Compliance", 
      desc: "Standardized warranty formats that are recognized across the entire Proofly retail network.", 
      icon: Globe, 
      color: "from-blue-600 to-blue-800" 
    },
  ];

  return (
    <section id="features" className={`py-24 px-6 ${dark ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="px-4 py-1 rounded-full bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-blue-500/20">
            Enterprise Grade
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
            Engineered for <span className="text-blue-600">Total Trust.</span>
          </h2>
          <p className="max-w-xl text-slate-500 font-medium leading-relaxed">
            The next generation of warranty management. A streamlined bridge between retailers and their customers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((f, i) => (
            <div 
              key={i} 
              className={`relative group p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-3 ${
                dark 
                ? "bg-[#0f172a] border-slate-800/60 hover:border-blue-500/50 shadow-2xl" 
                : "bg-white border-slate-200 shadow-xl hover:shadow-2xl"
              }`}
            >
              {/* Background Decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity`}></div>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-10 text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <f.icon size={28} />
              </div>

              <h3 className="text-xl font-black mb-4 tracking-tight group-hover:text-blue-500 transition-colors">
                {f.title}
              </h3>
              
              <p className={`text-sm leading-relaxed font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {f.desc}
              </p>

              {/* Bottom accent line */}
              <div className={`mt-8 w-10 h-1 rounded-full bg-gradient-to-r ${f.color} group-hover:w-full transition-all duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;