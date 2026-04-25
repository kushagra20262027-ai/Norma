'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw, CheckCircle, FileWarning } from 'lucide-react';

interface StepExportProps {
  imageUrl: string;
  blob: Blob;
  onReset: () => void;
}

export default function StepExport({ imageUrl, blob, onReset }: StepExportProps) {
  const [quality, setQuality] = useState([85]);
  const [fileSize, setFileSize] = useState(blob.size);
  const [optimizedUrl, setOptimizedUrl] = useState(imageUrl);

  useEffect(() => {
    const optimize = async () => {
      const img = new Image();
      img.src = imageUrl;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((newBlob) => {
        if (newBlob) {
          setFileSize(newBlob.size);
          setOptimizedUrl(URL.createObjectURL(newBlob));
        }
      }, 'image/jpeg', quality[0] / 100);
    };

    optimize();
  }, [quality, imageUrl]);

  const download = () => {
    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = `norma-biometric-${Date.now()}.jpg`;
    link.click();
  };

  const fileSizeKB = Math.round(fileSize / 1024);
  const isOverSize = fileSizeKB > 500;

  return (
    <div className="flex flex-col items-center space-y-12 py-6">
      <div className="flex flex-col md:flex-row gap-12 w-full items-center justify-center">
        <div className="w-full max-w-[260px] aspect-[35/45] bg-white shadow-sm border border-zinc-200 p-1">
          <img src={optimizedUrl} alt="Final Asset" className="w-full h-full object-cover" />
        </div>

        <Card className="w-full max-w-sm rounded-none border-zinc-200 shadow-none">
          <CardContent className="p-8 space-y-10">
            <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-zinc-200 pb-2">
                    <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">NORMA Pipeline</h4>
                    <div className={`text-[10px] font-black tabular-nums ${isOverSize ? 'text-red-600' : 'text-zinc-950'} flex items-center gap-1 uppercase tracking-widest`}>
                        {fileSizeKB} KB
                        {isOverSize ? <FileWarning className="w-3 h-3" /> : <CheckCircle className="w-3 h-3 text-zinc-400" />}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-600 font-black">
                        <span>Compression</span>
                        <span className="font-mono text-zinc-950">{quality[0]}%</span>
                    </div>
                    <Slider
                        value={quality}
                        onValueChange={(val) => setQuality(Array.isArray(val) ? [...val] : [val])}
                        max={100}
                        min={10}
                        step={1}
                        className="py-2"
                    />
                </div>
                
                <p className="text-[10px] text-zinc-600 leading-relaxed font-black border-l-2 border-zinc-200 pl-4 italic">
                    ZERO-DATA COLLECTION • LOCAL ENCRYPTION
                </p>
            </div>

            <div className="space-y-4">
                <Button onClick={download} className="w-full bg-zinc-950 hover:bg-zinc-800 text-white h-12 text-[10px] uppercase tracking-[0.3em] rounded-none font-black shadow-xl shadow-zinc-100">
                <Download className="w-4 h-4 mr-2" />
                Download JPG
                </Button>
                <Button variant="ghost" onClick={onReset} className="w-full text-zinc-600 text-[10px] uppercase tracking-widest rounded-none font-black">
                <RefreshCw className="w-3 h-3 mr-2" />
                Terminate Session
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-zinc-200 pt-12 w-full max-w-xl">
        <div className="grid grid-cols-2 gap-8 text-left">
            <div className="space-y-1">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-950">Biometric Integrity</h5>
                <p className="text-[11px] text-zinc-600 font-black">JPEG 2000 Compatible Scale</p>
            </div>
            <div className="space-y-1">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-950">Security Protocol</h5>
                <p className="text-[11px] text-zinc-600 font-black">Verified Edge-AI Processing</p>
            </div>
        </div>
      </div>
    </div>
  );
}
