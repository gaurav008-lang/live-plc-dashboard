import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

export interface PLCConfiguration {
  id: string;
  name: string;
  type: "tcp" | "rtu";
  ipAddress?: string;
  port?: number;
  serialPort?: string;
  baudRate?: number;
  parity?: string;
  unitId: number;
  registerAddress: number;
  registerCount: number;
  description?: string;
  connectedAt?: Date;
}

export interface PLCDataPoint {
  timestamp: string;
  values: boolean[] | number[];
  rawData: any;
}

interface PLCContextType {
  plcConfigurations: PLCConfiguration[];
  activePLC: PLCConfiguration | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastUpdated: Date | null;
  liveData: PLCDataPoint[];
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'failed';
  connectToPLC: (config: PLCConfiguration) => Promise<boolean>;
  disconnectFromPLC: () => void;
  addPLCConfiguration: (config: PLCConfiguration) => void;
  removePLCConfiguration: (id: string) => void;
  updatePLCConfiguration: (config: PLCConfiguration) => void;
}

const defaultPLCConfigs: PLCConfiguration[] = [
  {
    id: '1',
    name: 'Factory Floor PLC',
    type: 'tcp',
    ipAddress: '192.168.1.10',
    port: 502,
    unitId: 1,
    registerAddress: 0x6304,
    registerCount: 1,
    description: 'Main factory floor PLC monitoring system'
  },
  {
    id: '2',
    name: 'Assembly Line PLC',
    type: 'rtu',
    serialPort: 'COM8',
    baudRate: 9600,
    parity: 'O',
    unitId: 1,
    registerAddress: 0x6304,
    registerCount: 1,
    description: 'Assembly line control system'
  }
];

const PLCContext = createContext<PLCContextType | undefined>(undefined);

export const PLCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plcConfigurations, setPlcConfigurations] = useState<PLCConfiguration[]>(defaultPLCConfigs);
  const [activePLC, setActivePLC] = useState<PLCConfiguration | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveData, setLiveData] = useState<PLCDataPoint[]>([]);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  
  // Simulated connection to PLC
  const connectToPLC = useCallback(async (config: PLCConfiguration) => {
    setIsConnecting(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setActivePLC({ ...config, connectedAt: new Date() });
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "Connected to PLC",
        description: `Successfully connected to ${config.name}`,
      });
      
      // Start data simulation for connected PLC
      startDataSimulation();
      
      return true;
    } catch (error) {
      setIsConnecting(false);
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: `Could not connect to ${config.name}`,
      });
      
      return false;
    }
  }, []);
  
  const disconnectFromPLC = useCallback(() => {
    setIsConnected(false);
    setActivePLC(null);
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from PLC",
    });
  }, []);
  
  const addPLCConfiguration = useCallback((config: PLCConfiguration) => {
    setPlcConfigurations(prev => [...prev, config]);
  }, []);
  
  const removePLCConfiguration = useCallback((id: string) => {
    setPlcConfigurations(prev => prev.filter(config => config.id !== id));
    
    // If removing the active PLC, disconnect first
    if (activePLC?.id === id) {
      disconnectFromPLC();
    }
  }, [activePLC, disconnectFromPLC]);
  
  const updatePLCConfiguration = useCallback((config: PLCConfiguration) => {
    setPlcConfigurations(prev => 
      prev.map(item => item.id === config.id ? config : item)
    );
    
    // If updating the active PLC, update the active reference
    if (activePLC?.id === config.id) {
      setActivePLC(config);
    }
  }, [activePLC]);
  
  // Simulate PLC data streaming
  const startDataSimulation = useCallback(() => {
    // Clear any existing interval
    const intervalId = setInterval(() => {
      const now = new Date();
      setLastUpdated(now);
      
      // Generate simulated boolean value (coil) based on real example
      const simulatedCoils = [Math.random() > 0.5];
      
      const newDataPoint: PLCDataPoint = {
        timestamp: now.toISOString(),
        values: simulatedCoils,
        rawData: { bits: simulatedCoils }
      };
      
      setLiveData(prev => {
        // Keep only the last 100 data points to prevent memory issues
        const newData = [...prev, newDataPoint].slice(-100);
        return newData;
      });
      
      // Simulate cloud sync
      simulateCloudSync(newDataPoint);
    }, 5000); // Update every 5 seconds
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Simulate cloud synchronization
  const simulateCloudSync = useCallback((dataPoint: PLCDataPoint) => {
    setCloudSyncStatus('syncing');
    
    // Simulate network request
    setTimeout(() => {
      // 90% chance of success to simulate occasional network issues
      if (Math.random() < 0.9) {
        setCloudSyncStatus('synced');
        
        // Reset after a delay
        setTimeout(() => {
          setCloudSyncStatus('idle');
        }, 1000);
      } else {
        setCloudSyncStatus('failed');
        
        toast({
          variant: "destructive",
          title: "Cloud Sync Failed",
          description: "Unable to upload data to cloud. Will retry automatically.",
        });
        
        // Reset after a delay
        setTimeout(() => {
          setCloudSyncStatus('idle');
        }, 3000);
      }
    }, 1000);
  }, []);
  
  return (
    <PLCContext.Provider
      value={{
        plcConfigurations,
        activePLC,
        isConnected,
        isConnecting,
        lastUpdated,
        liveData,
        cloudSyncStatus,
        connectToPLC,
        disconnectFromPLC,
        addPLCConfiguration,
        removePLCConfiguration,
        updatePLCConfiguration
      }}
    >
      {children}
    </PLCContext.Provider>
  );
};

export const usePLC = () => {
  const context = useContext(PLCContext);
  
  if (context === undefined) {
    throw new Error('usePLC must be used within a PLCProvider');
  }
  
  return context;
};
