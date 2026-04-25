import { CropPreset } from './types';

export const CROP_PRESETS: CropPreset[] = [
  {
    id: 'us-india-passport',
    name: 'US/INDIA/PASSPORT (2x2")',
    aspectRatio: 1,
    width: 600,
    height: 600,
    unit: 'px',
  },
  {
    id: 'uk-eu-schengen',
    name: 'UK/EU/SCHENGEN (35x45MM)',
    aspectRatio: 35 / 45,
    width: 350,
    height: 450,
    unit: 'px',
  },
  {
    id: 'china-passport',
    name: 'CHINA (33x48MM)',
    aspectRatio: 33 / 48,
    width: 330,
    height: 480,
    unit: 'px',
  },
  {
    id: 'custom',
    name: 'CUSTOM DIMENSION',
    aspectRatio: 1,
    width: 1000,
    height: 1000,
    unit: 'px',
  },
];

export const BG_COLORS = [
  { id: 'white', color: '#FFFFFF', label: 'WHITE' },
  { id: 'off-white', color: '#FAF9F6', label: 'OFF-WHITE' },
  { id: 'light-grey', color: '#E5E5E5', label: 'GREY' },
  { id: 'light-blue', color: '#B9CFE7', label: 'LIGHT BLUE' },
  { id: 'dark-blue', color: '#003366', label: 'NAVY' },
  { id: 'green', color: '#009739', label: 'GREEN' },
];
