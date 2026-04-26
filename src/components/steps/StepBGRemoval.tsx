'use client';

import { useState, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { BG_COLORS } from '@/lib/constants';

interface StepBGRemovalProps {
  imageUrl: string;
  onComplete: (url: string) => void;
  onBack: () => void;
}

export default function StepBGRemoval({ imageUrl, onComplete, onBack }: StepBGRemovalProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [removedBgBlob, setRemovedBgBlob] = useState<Blob | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string>(BG_COLORS[0].id);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function processImage() {
      try {
        setLoading(true);
        const blob = await removeBackground(imageUrl, {
          progress: (key, current, total) => {
            if (total) {
                setProgress(Math.round((current / total) * 100));
            }
          },
          model: 'isnet',
        });
        setRemovedBgBlob(blob);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("AI Engine failed to process. Ensure facial clarity.");
        setLoading(false);
      }
    }
    processImage();
  }, [imageUrl]);

  useEffect(() => {
    if (!removedBgBlob) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const activeColor = BG_COLORS.find(c => c.id === selectedColorId)?.color || '#FFFFFF';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        // Draw background
        ctx.fillStyle = activeColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw person
        ctx.drawImage(img, 0, 0);
        
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.95));
      }
    };
    img.src = URL.createObjectURL(removedBgBlob);
  }, [removedBgBlob, selectedColorId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 py-10 sm:py-20 px-4 sm:px-8 w-full max-w-md mx-auto">
        <div className="space-y-4 w-full text-center">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
            {progress < 100 ? "Initializing AI Engine..." : "Optimizing Neural Layers..."}
          </h3>
          <Progress value={progress} className="h-1 bg-zinc-100 rounded-none overflow-hidden" />
          <p className="text-[10px] text-zinc-600 font-mono tracking-tighter font-black">{progress}%</p>
        </div>
        
        <div className="flex items-center gap-3 text-zinc-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[11px] uppercase tracking-widest font-black">Edge-AI Verification</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-10 sm:py-20 px-4 sm:px-8 text-center">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-950">Initialization Failed</h3>
          <p className="text-xs text-zinc-600 max-w-xs leading-relaxed font-black">{error}</p>
        </div>
        <Button onClick={onBack} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest border-zinc-200 text-zinc-950 font-black">
            Restart Session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-12 py-6">
      <div className="w-full max-w-[320px] aspect-[4/5] bg-white border border-zinc-200 overflow-hidden shadow-sm p-1">
        {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />}
      </div>

      <div className="space-y-10 w-full max-w-sm">
        {/* Background Standards */}
        <div className="space-y-4">
            <h4 className="text-center font-black text-zinc-950 uppercase tracking-[0.2em] text-[10px]">Background Standards</h4>
            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            {BG_COLORS.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => setSelectedColorId(item.id)}
                        className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center ${
                            selectedColorId === item.id ? 'border-zinc-950 scale-110 shadow-sm' : 'border-zinc-200'
                        }`}
                        style={{ backgroundColor: item.color }}
                    >
                        {selectedColorId === item.id && (
                            <Check className={`w-4 h-4 ${item.id === 'white' || item.id === 'off-white' || item.id === 'light-grey' || item.id === 'light-blue' ? 'text-zinc-950' : 'text-white'}`} />
                        )}
                    </button>
                    <span className={`text-[8px] uppercase font-black tracking-tighter text-center leading-tight ${selectedColorId === item.id ? 'text-zinc-950' : 'text-zinc-600'}`}>
                        {item.label}
                    </span>
                </div>
            ))}
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="rounded-none text-[10px] uppercase tracking-widest text-zinc-600 font-black">
          <ArrowLeft className="w-3 h-3 mr-2" />
          Previous
        </Button>
        <Button onClick={() => previewUrl && onComplete(previewUrl)} className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-none px-6 sm:px-12 h-12 text-[10px] uppercase tracking-[0.2em] font-black">
          Confirm & Edit
        </Button>
      </div>
    </div>
  );
}
