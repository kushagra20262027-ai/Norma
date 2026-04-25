export type Step = 'landing' | 'upload' | 'bg-removal' | 'crop' | 'export';

export interface ImageData {
  originalUrl: string | null;
  noBgUrl: string | null;
  croppedUrl: string | null;
  blob: Blob | null;
}

export interface CropPreset {
  id: string;
  name: string;
  aspectRatio: number;
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'in';
}

export type BgColor = 'white' | 'off-white' | 'light-grey' | 'light-blue' | 'dark-blue' | 'green';
