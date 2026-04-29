"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StepLanding from '@/components/steps/StepLanding';
import StepUpload from '@/components/steps/StepUpload';
import StepBGRemoval from '@/components/steps/StepBGRemoval';
import StepCrop from '@/components/steps/StepCrop';
import StepExport from '@/components/steps/StepExport';
import { Step, ImageData } from '@/lib/types';
import { Card } from '@/components/ui/card';

function EditorContent() {
  const searchParams = useSearchParams();
  // URL check: ?success=true
  const isPaid = searchParams.get('success') === 'true';

  const [step, setStep] = useState<Step>('landing');
  const [imageData, setImageData] = useState<ImageData>({
    originalUrl: null,
    noBgUrl: null,
    croppedUrl: null,
    blob: null,
  });

  const nextStep = (next: Step) => setStep(next);

  const reset = () => {
    setStep('landing');
    setImageData({
      originalUrl: null,
      noBgUrl: null,
      croppedUrl: null,
      blob: null,
    });
  };

  const renderStep = () => {
    switch(step) {
      case 'landing': return <StepLanding onStart={() => nextStep('upload')} />;
      case 'upload': return (
        <StepUpload 
          onUpload={(url) => {
            setImageData(prev => ({ ...prev, originalUrl: url }));
            nextStep('bg-removal');
          }} 
        />
      );
      case 'bg-removal': return (
        <StepBGRemoval 
          imageUrl={imageData.originalUrl!} 
          onComplete={(noBgUrl) => {
            setImageData(prev => ({ ...prev, noBgUrl }));
            nextStep('crop');
          }}
          onBack={() => nextStep('upload')}
        />
      );
      case 'crop': return (
        <StepCrop 
          imageUrl={imageData.noBgUrl!} 
          onComplete={(croppedUrl, blob) => {
            setImageData(prev => ({ ...prev, croppedUrl, blob }));
            nextStep('export');
          }}
          onBack={() => nextStep('bg-removal')}
        />
      );
      case 'export': return (
        <StepExport 
          imageUrl={imageData.croppedUrl!} 
          blob={imageData.blob!}
          onReset={reset}
          isPaid={isPaid} // Passing the paid status
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 font-sans">
      <div className="w-full max-w-4xl animate-in fade-in duration-700 slide-in-from-bottom-4">
        {step === 'landing' ? (
          renderStep()
        ) : (
          <Card className="bg-white border-zinc-200 rounded-none shadow-sm overflow-hidden w-full">
            <div className="p-4 sm:p-8 md:p-12">
                {renderStep()}
            </div>
          </Card>
        )}
      </div>
      <footer className="mt-20 w-full max-w-4xl border-t border-zinc-200 pt-8 pb-12 flex flex-col items-center">
          <p className="text-zinc-500 text-[10px] text-center font-medium">
            © 2026 Kushagra Mishra • All Rights Reserved
          </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}