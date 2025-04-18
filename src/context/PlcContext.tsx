import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { savePLCDataToFirebase, isFirebaseConfigured } from "@/services/firebase";

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
  cloudSync?: {
    enabled: boolean;
    interval: number;
    provider: string;
  };
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
    description: 'Main factory floor PLC monitoring system',
    cloudSync: {
      enabled: true,
      interval: 5,
      provider: 'firebase'
    }
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
    description: 'Assembly line control system',
    cloudSync: {
      enabled: true,
      interval: 10,
      provider: 'firebase'
    }
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
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  
  const connectToPLC = useCallback(async (config: PLCConfiguration) => {
    setIsConnecting(true);
    
    try {
      console.log(`Attempting to connect to ${config.type === 'tcp' ? `${config.ipAddress}:${config.port}` : config.serialPort}`);
      
      if (config.type === 'tcp') {
        const standardPorts = [502, 102, 44818];
        const validIP = /^(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(config.ipAddress || '');
        
        if (!validIP || !standardPorts.includes(config.port || 0)) {
          console.log('Invalid IP or non-standard PLC port detected');
          if (Math.random() > 0.1) {
            throw new Error("Connection failed: Cannot reach device");
          }
        }
      }
      
      if (config.type === 'rtu') {
        const validCOMPort = /^COM[1-9][0-9]?$/.test(config.serialPort || '');
        if (!validCOMPort) {
          console.log('Invalid COM port format');
          if (Math.random() > 0.1) {
            throw new Error("Connection failed: Invalid serial port");
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const connectionSuccess = Math.random() > 0.3;
      
      if (!connectionSuccess) {
        throw new Error("Connection timeout or device not responding");
      }
      
      setActivePLC({ ...config, connectedAt: new Date() });
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "Connected to PLC",
        description: `Successfully connected to ${config.name}`,
      });
      
      startDataSimulation();
      
      return true;
    } catch (error) {
      setIsConnecting(false);
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : `Could not connect to ${config.name}`,
      });
      
      return false;
    }
  }, []);
  
  const disconnectFromPLC = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    
    setIsConnected(false);
    setActivePLC(null);
    setLiveData([]);
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from PLC",
    });
  }, [simulationInterval]);
  
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);
  
  const addPLCConfiguration = useCallback((config: PLCConfiguration) => {
    setPlcConfigurations(prev => [...prev, config]);
  }, []);
  
  const removePLCConfiguration = useCallback((id: string) => {
    setPlcConfigurations(prev => prev.filter(config => config.id !== id));
    
    if (activePLC?.id === id) {
      disconnectFromPLC();
    }
  }, [activePLC, disconnectFromPLC]);
  
  const updatePLCConfiguration = useCallback((config: PLCConfiguration) => {
    setPlcConfigurations(prev => 
      prev.map(item => item.id === config.id ? config : item)
    );
    
    if (activePLC?.id === config.id) {
      setActivePLC(config);
    }
  }, [activePLC]);
  
  const startDataSimulation = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    
    if (!isConnected) {
      console.log("Not starting data simulation because not connected");
      return null;
    }
    
    console.log("Starting data simulation for connected PLC");
    
    const intervalId = setInterval(() => {
      if (!isConnected) {
        console.log("Stopping simulation as connection was lost");
        clearInterval(intervalId);
        return;
      }
      
      const now = new Date();
      setLastUpdated(now);
      
      const simulatedCoils = [Math.random() > 0.5];
      
      const newDataPoint: PLCDataPoint = {
        timestamp: now.toISOString(),
        values: simulatedCoils,
        rawData: { bits: simulatedCoils }
      };
      
      setLiveData(prev => {
        const newData = [...prev, newDataPoint].slice(-100);
        return newData;
      });
      
      if (activePLC?.cloudSync?.enabled) {
        simulateCloudSync(newDataPoint);
      }
    }, 5000);
    
    setSimulationInterval(intervalId);
    
    return () => clearInterval(intervalId);
  }, [activePLC, isConnected]);
  
  const simulateCloudSync = useCallback((dataPoint: PLCDataPoint) => {
    if (!activePLC?.cloudSync?.enabled) return;
    
    if (activePLC.cloudSync.provider === 'firebase' && !isFirebaseConfigured()) {
      setCloudSyncStatus('failed');
      
      toast({
        variant: "destructive",
        title: "Cloud Sync Failed",
        description: "Firebase is not properly configured. Please update your credentials.",
      });
      
      setTimeout(() => {
        setCloudSyncStatus('idle');
      }, 3000);
      
      return;
    }
    
    setCloudSyncStatus('syncing');
    
    setTimeout(async () => {
      try {
        if (activePLC) {
          let success = false;
          
          if (activePLC.cloudSync.provider === 'firebase') {
            success = await savePLCDataToFirebase(activePLC.id, dataPoint);
          } else {
            success = true;
            console.log(`Mocking sync to ${activePLC.cloudSync.provider}`);
          }
          
          if (success) {
            setCloudSyncStatus('synced');
            
            setTimeout(() => {
              setCloudSyncStatus('idle');
            }, 1000);
          } else {
            throw new Error("Failed to sync");
          }
        }
      } catch (error) {
        setCloudSyncStatus('failed');
        
        toast({
          variant: "destructive",
          title: "Cloud Sync Failed",
          description: `Unable to upload data to ${activePLC?.cloudSync?.provider}. Will retry automatically.`,
        });
        
        setTimeout(() => {
          setCloudSyncStatus('idle');
        }, 3000);
      }
    }, 1000);
  }, [activePLC]);
  
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
