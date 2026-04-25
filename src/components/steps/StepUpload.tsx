'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, Upload, XCircle, ArrowLeft } from 'lucide-react';

interface StepUploadProps {
  onUpload: (url: string) => void;
}

export default function StepUpload({ onUpload }: StepUploadProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onUpload(imageSrc);
    }
  }, [onUpload]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  if (mode === 'select') {
    return (
      <div className="flex flex-col items-center space-y-12 py-12">
        <div className="space-y-2 text-center">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Step 01</h3>
            <h4 className="text-xl font-bold text-zinc-950 tracking-tight">Source Selection</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 w-full max-w-2xl overflow-hidden">
          <button 
            className="p-12 bg-white flex flex-col items-center space-y-6 hover:bg-zinc-50 transition-colors group"
            onClick={() => setMode('camera')}
          >
            <div className="p-4 rounded-sm bg-zinc-100 text-zinc-600 group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-zinc-950">Biometric Capture</h4>
              <p className="text-[11px] text-zinc-600 font-medium">Use device webcam</p>
            </div>
          </button>

          <div 
            className="p-12 bg-white flex flex-col items-center space-y-6 hover:bg-zinc-50 transition-colors group relative cursor-pointer"
          >
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleFileUpload}
            />
            <div className="p-4 rounded-sm bg-zinc-100 text-zinc-600 group-hover:bg-zinc-950 group-hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-zinc-950">Local Import</h4>
              <p className="text-[11px] text-zinc-600 font-medium">Import from storage</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'camera') {
    return (
      <div className="flex flex-col items-center space-y-8 py-6">
        <div className="w-full max-w-xl aspect-[4/3] bg-zinc-50 rounded-none overflow-hidden relative border border-zinc-200">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <XCircle className="w-6 h-6 text-zinc-400" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">{cameraError}</p>
              <Button variant="outline" size="sm" onClick={() => setMode('select')} className="rounded-none text-[10px] uppercase tracking-widest border-zinc-200">Go Back</Button>
            </div>
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              onUserMediaError={() => setCameraError("Camera Access Denied")}
              className="w-full h-full object-cover grayscale-[0.4]"
            />
          )}
          {!cameraError && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-60 border border-dashed border-zinc-400" />
            </div>
          )}
        </div>
        
        {!cameraError && (
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setMode('select')} className="rounded-none text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
              <ArrowLeft className="w-3 h-3 mr-2" />
              Return
            </Button>
            <Button onClick={capture} className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] uppercase tracking-[0.2em] px-12 h-11">
              Execute Capture
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
