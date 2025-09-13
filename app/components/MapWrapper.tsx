'use client';

import dynamic from 'next/dynamic';
import { Bus } from '../types';

interface MapWrapperProps {
  bus: Bus;
}

// Dynamically import the Map component to disable SSR
const Map = dynamic(() => import('./Map'), { ssr: false });

export default function MapWrapper({ bus }: MapWrapperProps) {
  return <Map bus={bus} />;
}
