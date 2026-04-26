import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';

interface StepLandingProps {
  onStart: () => void;
}

export default function StepLanding({ onStart }: StepLandingProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-16 py-16">
      <div className="space-y-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest border border-zinc-200">
          <Lock className="w-3 h-3" />
          <span>Local Encrypted Session</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-zinc-950 tracking-tighter leading-tight uppercase">
          NORMA <br />
          <span className="text-zinc-500 font-bold tracking-tight">Global Biometric Utility.</span>
        </h2>
        <div className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto font-black uppercase tracking-tight">
            Create government-compliant passport photos in seconds. 
            All AI processing happens locally in your browser.
            </p>
            <p className="text-[11px] text-zinc-600 italic font-black uppercase tracking-widest">
            Photos never leave your device.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" onClick={onStart} className="text-xs uppercase tracking-[0.3em] w-full sm:w-auto px-8 sm:px-12 h-14 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none font-black shadow-xl shadow-zinc-200 transition-all">
            Launch Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 w-full max-w-3xl border border-zinc-200 overflow-hidden shadow-sm">
        {[
          {
            icon: ShieldCheck,
            title: 'Privacy Assurance',
            desc: 'Every pixel is processed locally. We have zero visibility into your personal data.'
          },
          {
            icon: Zap,
            title: 'Edge-AI Engine',
            desc: 'Standardized background removal and biometric cropping running on your device.'
          }
        ].map((feature, i) => (
          <div key={i} className="p-6 sm:p-8 bg-white flex flex-col items-start text-left space-y-4">
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-sm">
              <feature.icon className="w-4 h-4 text-zinc-950" />
            </div>
            <div>
                <h3 className="font-bold text-xs uppercase tracking-tight text-zinc-950">{feature.title}</h3>
                <p className="text-[13px] text-zinc-600 leading-relaxed mt-1 font-semibold">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
