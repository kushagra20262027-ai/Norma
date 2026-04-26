'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { CROP_PRESETS } from '@/lib/constants';
import { CropPreset } from '@/lib/types';

interface StepCropProps {
  imageUrl: string;
  onComplete: (url: string, blob: Blob) => void;
  onBack: () => void;
}

export default function StepCrop({ imageUrl, onComplete, onBack }: StepCropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CROP_PRESETS[0].id);
  const [customWidth, setCustomWidth] = useState(1000);
  const [customHeight, setCustomHeight] = useState(1000);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Robust initialization and safety check
  useEffect(() => {
    if (isNaN(zoom) || zoom === null) {
      setZoom(1.0);
    }
  }, [zoom]);

  // Safety Render Guard
  if (!imageUrl || isNaN(zoom)) {
    return (
        <div className="flex items-center justify-center h-64 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
            Initializing Asset...
        </div>
    );
  }

  const getActivePreset = (): CropPreset => {
    const preset = CROP_PRESETS.find(p => p.id === selectedPresetId) || CROP_PRESETS[0];
    if (selectedPresetId === 'custom') {
      return {
        ...preset,
        width: customWidth,
        height: customHeight,
        aspectRatio: customWidth / customHeight,
      };
    }
    return preset;
  };

  const activePreset = getActivePreset();

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleComplete = async () => {
    if (!croppedAreaPixels) return;

    try {
      // Ensure zoom is valid before processing
      const finalZoom = isNaN(zoom) ? 1.0 : zoom;
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, activePreset);
      onComplete(croppedImage.url, croppedImage.blob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-12 py-6">
      <div className="w-full max-w-lg aspect-square relative bg-zinc-50 border border-zinc-200 overflow-hidden shadow-sm">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={activePreset.aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={(z) => {
              const newZoom = isNaN(z) ? 1.0 : Math.max(1, z);
              setZoom(newZoom);
          }}
          showGrid={false}
          classes={{ containerClassName: 'grayscale-[0.1]' }}
        />
        
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
            <div 
                className="w-[60%] h-[75%] border border-dashed border-zinc-400 rounded-[120px] flex flex-col items-center pt-[15%]"
            >
                <div className="w-1/2 h-[45%] rounded-full border border-zinc-400 mb-2" />
                <div className="w-3/4 h-[40%] border border-zinc-400 rounded-t-[100px]" />
            </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-8 sm:space-y-10 px-0 sm:px-4">
        <div className="space-y-4">
            <h4 className="text-left font-black text-zinc-950 uppercase tracking-[0.2em] text-[10px]">Dimensional Standard</h4>
            <div className="relative">
                <select 
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    className="w-full h-11 bg-white border border-zinc-200 rounded-none px-4 text-[11px] uppercase font-bold tracking-widest appearance-none focus:outline-none focus:border-zinc-950 transition-colors text-zinc-950"
                >
                    {CROP_PRESETS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
            </div>

            {selectedPresetId === 'custom' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Width (px)</label>
                        <input 
                            type="number" 
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="w-full h-9 bg-white border border-zinc-200 rounded-none px-3 text-[11px] font-mono focus:outline-none focus:border-zinc-950"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Height (px)</label>
                        <input 
                            type="number" 
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="w-full h-9 bg-white border border-zinc-200 rounded-none px-3 text-[11px] font-mono focus:outline-none focus:border-zinc-950"
                        />
                    </div>
                </div>
            )}
        </div>

        <div className="space-y-6">
            <div className="flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                <span>Biometric Scaling</span>
                <span className="tabular-nums font-mono text-zinc-950">
                    {Math.round((zoom || 1.0) * 100)}%
                </span>
            </div>
            
            <div className="flex items-center justify-center gap-px bg-zinc-200 border border-zinc-200 shadow-sm">
                <button 
                    onClick={() => setZoom(z => Math.max(0.1, Math.min(3, (z || 1.0) - 0.05)))}
                    className="flex-1 h-11 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white transition-all text-[12px] font-bold flex items-center justify-center"
                >
                    &minus;
                </button>
                <button 
                    onClick={() => setZoom(1.0)}
                    className="flex-[2] h-11 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center border-x border-zinc-200"
                >
                    Reset
                </button>
                <button 
                    onClick={() => setZoom(z => Math.max(0.1, Math.min(3, (z || 1.0) + 0.05)))}
                    className="flex-1 h-11 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white transition-all text-[12px] font-bold flex items-center justify-center"
                >
                    +
                </button>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="rounded-none text-[10px] uppercase tracking-widest text-zinc-600 font-black">
          <ArrowLeft className="w-3 h-3 mr-2" />
          Previous
        </Button>
        <Button onClick={handleComplete} className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-none px-12 h-12 text-[10px] uppercase tracking-[0.2em] font-black shadow-xl shadow-zinc-100">
          Finalize Asset
        </Button>
      </div>
    </div>
  );
}

async function getCroppedImg(imageSrc: string, pixelCrop: any, preset: CropPreset): Promise<{ url: string; blob: Blob }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = preset.width;
  canvas.height = preset.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    preset.width,
    preset.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Canvas is empty');
      const url = URL.createObjectURL(blob);
      resolve({ url, blob });
    }, 'image/jpeg', 1);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}
