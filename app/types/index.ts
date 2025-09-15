// app/types/index.ts
export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
  }

  
  export interface BusStop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    estimated_arrival: string; 

  }
  
  
  export interface Bus {
    id: number;
    name: string;
    capacity: number;
    route: string;
    current_location: Location;
    bus_stops: BusStop[];
  }
  export interface BusLine {
    id: number;
    name: string;
    capacity: number;
    route: string;
    current_location: Location;
    bus_stops: BusStop[];
  }
  
  export interface BusData {
    bus_lines: BusLine[];
  }


  
  export type BusStatus = 'Active' | 'Maintenance' | 'Out of Service';
  
  export interface BusLine {
    id: number;
    name: string;
    capacity: number;
    route: string; 
    current_location: Location;
    bus_stops: BusStop[];
  

    status?: BusStatus;
    passengers?: {
      utilization_percentage?: number; 
    };
  }
  
  export interface BusData {
    bus_lines: BusLine[];
  }