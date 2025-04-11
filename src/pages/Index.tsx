
import { useEffect, useState } from "react";
import { usePLC } from "@/context/PlcContext";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import DataChart from "@/components/DataChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUpRight, Clock, CloudUpload, Server } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { 
    activePLC, 
    isConnected, 
    lastUpdated, 
    liveData, 
    cloudSyncStatus 
  } = usePLC();
  
  // Format time display
  const formatTime = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleTimeString();
  };
  
  // Current coil value (most recent data point)
  const getCurrentValue = () => {
    if (liveData.length === 0) return false;
    
    // Get the last data point
    const lastDataPoint = liveData[liveData.length - 1];
    
    // Return the first value (could be an array of values)
    return lastDataPoint.values[0];
  };
  
  // If not connected, show connection prompt
  if (!isConnected || !activePLC) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">Not Connected</CardTitle>
              <CardDescription>
                Connect to a PLC to start monitoring data
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Server className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="mb-6">
                You need to connect to a PLC device before you can view the dashboard.
              </p>
              <Button asChild>
                <Link to="/plc-config">Configure PLC Connection</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard: {activePLC.name}
            </h1>
            <p className="text-muted-foreground">
              Monitoring PLC data in real-time.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${isConnected ? 'border-success/40 bg-success/10' : 'border-muted/40 bg-muted/10'}`}
            >
              <span 
                className={`h-2 w-2 rounded-full animate-pulse mr-2 ${isConnected ? 'bg-success' : 'bg-muted'}`}
              ></span>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Badge 
              variant="outline"
              className={`${cloudSyncStatus === 'synced' ? 'border-success/40 bg-success/10' : 
                cloudSyncStatus === 'syncing' ? 'border-warning/40 bg-warning/10' : 
                cloudSyncStatus === 'failed' ? 'border-danger/40 bg-danger/10' : 
                'border-muted/40 bg-muted/10'}`}
            >
              <CloudUpload className="h-3 w-3 mr-1" />
              {cloudSyncStatus === 'synced' ? "Synced" : 
                cloudSyncStatus === 'syncing' ? "Syncing" : 
                cloudSyncStatus === 'failed' ? "Failed" : 
                "Idle"}
            </Badge>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard 
            title="Coil Status" 
            value={getCurrentValue()}
            type={getCurrentValue() ? "success" : "warning"} 
            description={`Register 0x${activePLC.registerAddress.toString(16).toUpperCase()}`}
          />
          
          <StatusCard 
            title="Last Updated" 
            value={formatTime(lastUpdated)}
            type="info" 
            icon={<Clock className="h-5 w-5 text-info" />}
            description="Time of last data update"
          />
          
          <StatusCard 
            title="Connection Type" 
            value={activePLC.type.toUpperCase()}
            type="info" 
            icon={<Server className="h-5 w-5 text-info" />}
            description={activePLC.type === "tcp" ? 
              `IP: ${activePLC.ipAddress}:${activePLC.port}` : 
              `Port: ${activePLC.serialPort}`}
          />
          
          <StatusCard 
            title="Cloud Status" 
            value={cloudSyncStatus === 'synced' ? "Synced" : 
              cloudSyncStatus === 'syncing' ? "Syncing" : 
              cloudSyncStatus === 'failed' ? "Failed" : 
              "Idle"}
            type={cloudSyncStatus === 'synced' ? "success" : 
              cloudSyncStatus === 'syncing' ? "warning" : 
              cloudSyncStatus === 'failed' ? "danger" : 
              "info"}
            icon={<CloudUpload className="h-5 w-5 text-info" />}
            description="Status of cloud data synchronization"
          />
        </div>
        
        <div>
          <DataChart 
            data={liveData} 
            title="Live PLC Data (Coil Status)" 
            dataKey="coilStatus"
            color="#3b82f6"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>PLC Details</CardTitle>
              <CardDescription>Current PLC connection information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Name:</span>
                  <span>{activePLC.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Type:</span>
                  <span>{activePLC.type.toUpperCase()}</span>
                </div>
                {activePLC.type === "tcp" ? (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">IP Address:</span>
                      <span>{activePLC.ipAddress}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Port:</span>
                      <span>{activePLC.port}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Serial Port:</span>
                      <span>{activePLC.serialPort}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Baud Rate:</span>
                      <span>{activePLC.baudRate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Parity:</span>
                      <span>{activePLC.parity}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Unit ID:</span>
                  <span>{activePLC.unitId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Register Address:</span>
                  <span>0x{activePLC.registerAddress.toString(16).toUpperCase()}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-medium">Register Count:</span>
                  <span>{activePLC.registerCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 5 data points from PLC</CardDescription>
            </CardHeader>
            <CardContent>
              {liveData.length > 0 ? (
                <div className="space-y-4">
                  {liveData.slice(-5).reverse().map((data, index) => (
                    <div key={index} className="flex justify-between border-b pb-2 last:border-0">
                      <span className="font-medium">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </span>
                      <span>
                        {typeof data.values[0] === "boolean" 
                          ? (data.values[0] ? "ON" : "OFF") 
                          : data.values[0]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Monitoring Active</AlertTitle>
          <AlertDescription>
            PLC monitoring is active and data is being recorded. Data is automatically synchronized with the cloud service.
          </AlertDescription>
        </Alert>
      </div>
    </Layout>
  );
};

export default Dashboard;
