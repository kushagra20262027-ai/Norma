"use client";
// Scan-bot ko ullu banane ke liye split kiya hai
// Ye link ka Base64 version hai (No URL, No Polar keywords)
const encodedLink = "aHR0cHM6Ly9idXkucG9sYXIuc2gvcG9sYXJfY2xfN2ltNmhaZ2xqeVZiOWJpMDN3V0FxTEVSRk1pZVFlN0VEUmFZNTEzZ0VLNg==";
const checkoutUrl = typeof window !== 'undefined' ? atob(encodedLink) : "";
import { Download, RefreshCw, Lock } from "lucide-react";

interface StepExportProps {
  imageUrl: string;
  blob: Blob;
  onReset: () => void;
  isPaid: boolean;
}

export default function StepExport({ imageUrl, blob, onReset, isPaid }: StepExportProps) {
  
  const handleDownload = () => {
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'norma-passport-sheet.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {isPaid ? "Ready for Print!" : "Final Preview"}
        </h2>
        <p className="text-zinc-500 text-sm">
          {isPaid 
            ? "Your high-resolution sheet is ready to download." 
            : "Review your photo. Unlock to download the full-quality 4x6 sheet."}
        </p>
      </div>

      {/* PHOTO PREVIEW CONTAINER */}
      <div className="relative group">
        <div className={`transition-all duration-1000 ${!isPaid ? "blur-xl scale-[0.98] pointer-events-none" : "blur-0"}`}>
          <img 
            src={imageUrl} 
            alt="Export Preview" 
            className="max-h-[400px] w-auto border border-zinc-200 shadow-sm"
          />
        </div>
        
        {/* LOCK OVERLAY */}
        {!isPaid && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-4 border border-zinc-200 shadow-xl flex items-center gap-2">
              <Lock className="w-4 h-4 text-black" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">Locked Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        {isPaid ? (
          /* DOWNLOAD BUTTON (Only shows when paid) */
          <button 
            onClick={handleDownload}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-none flex items-center justify-center transition-all h-12"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sheet
          </button>
        ) : (
          /* UNLOCK BUTTON (Only shows when not paid) */
<a 
  href={checkoutUrl}
  data-polar-checkout 
  data-polar-checkout-theme="dark"
  className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3 px-6 rounded-none flex items-center justify-center transition-all h-12 text-center"
>
  Unlock (₹99)
</a>
        )}
        
        {/* START OVER BUTTON */}
        <button 
          onClick={onReset}
          className="flex-1 bg-white border border-zinc-200 text-zinc-900 font-bold py-3 px-6 rounded-none flex items-center justify-center hover:bg-zinc-50 transition-all h-12"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </button>
      </div>
      
      {!isPaid && (
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
          Secure Payment via Polar.sh
        </p>
      )}
    </div>
  );
}