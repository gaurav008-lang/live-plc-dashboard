
import { useState, useEffect } from "react";
import { usePLC } from "@/context/PlcContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Cloud, CloudOff, RefreshCw, Save, AlertTriangle } from "lucide-react";
import { savePLCConfiguration, isFirebaseConfigured } from "@/services/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CloudSyncConfig = () => {
  const { 
    activePLC, 
    cloudSyncStatus, 
    plcConfigurations,
    updatePLCConfiguration
  } = usePLC();
  
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState("5");
  const [cloudProvider, setCloudProvider] = useState("firebase");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  
  useEffect(() => {
    // Check if Firebase is configured
    setIsFirebaseReady(isFirebaseConfigured());
    
    // Initialize state from active PLC if available
    if (activePLC?.cloudSync) {
      setSyncEnabled(activePLC.cloudSync.enabled);
      setSyncInterval(activePLC.cloudSync.interval.toString());
      setCloudProvider(activePLC.cloudSync.provider);
    }
  }, [activePLC]);
  
  const handleSaveConfig = async () => {
    if (!activePLC) {
      toast({
        variant: "destructive",
        title: "No Active PLC",
        description: "Please connect to a PLC first.",
      });
      return;
    }
    
    if (cloudProvider === "firebase" && !isFirebaseReady) {
      toast({
        variant: "destructive",
        title: "Firebase Not Configured",
        description: "Please configure your Firebase credentials in the firebase.ts file.",
      });
      return;
    }
    
    setIsConfiguring(true);
    
    try {
      // Update PLC configuration with cloud sync settings
      const updatedConfig = {
        ...activePLC,
        cloudSync: {
          enabled: syncEnabled,
          interval: parseInt(syncInterval),
          provider: cloudProvider,
        }
      };
      
      // Save to context
      updatePLCConfiguration(updatedConfig);
      
      // Save to Firebase
      const success = cloudProvider === "firebase" && isFirebaseReady ? 
        await savePLCConfiguration(updatedConfig) : true;
      
      if (success) {
        toast({
          title: "Configuration Saved",
          description: "Cloud synchronization settings have been updated.",
        });
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save cloud sync configuration.",
      });
    } finally {
      setIsConfiguring(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {!isFirebaseReady && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Firebase Not Configured</AlertTitle>
          <AlertDescription>
            Your Firebase credentials are not properly configured. Please update the credentials in 
            <code className="mx-1 px-1 py-0.5 bg-muted rounded text-sm">src/services/firebase.ts</code> 
            file with your own Firebase project details.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Cloud Synchronization Settings
          </CardTitle>
          <CardDescription>
            Configure how PLC data is synchronized with cloud services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync-toggle">Enable Cloud Synchronization</Label>
              <p className="text-sm text-muted-foreground">
                Automatically upload PLC data to cloud services
              </p>
            </div>
            <Switch
              id="sync-toggle"
              checked={syncEnabled}
              onCheckedChange={setSyncEnabled}
            />
          </div>
          
          {syncEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cloud-provider">Cloud Provider</Label>
                <Select
                  value={cloudProvider}
                  onValueChange={setCloudProvider}
                >
                  <SelectTrigger id="cloud-provider">
                    <SelectValue placeholder="Select a cloud provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firebase">Firebase Realtime Database</SelectItem>
                    <SelectItem value="azure">Azure IoT Hub</SelectItem>
                    <SelectItem value="aws">AWS IoT Core</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sync-interval">Sync Interval (seconds)</Label>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    id="sync-interval"
                    type="number"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    min="1"
                    max="3600"
                  />
                  <span className="shrink-0">seconds</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  How frequently PLC data is uploaded to the cloud
                </p>
              </div>
              
              <div className="space-y-2 rounded-lg border p-4 bg-muted/50">
                <h3 className="font-medium">Current Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    {cloudSyncStatus === 'syncing' && (
                      <div className="flex items-center text-warning">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        <span>Syncing to {cloudProvider}...</span>
                      </div>
                    )}
                    {cloudSyncStatus === 'synced' && (
                      <div className="flex items-center text-success">
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>Synchronized with {cloudProvider}</span>
                      </div>
                    )}
                    {cloudSyncStatus === 'failed' && (
                      <div className="flex items-center text-destructive">
                        <CloudOff className="mr-2 h-4 w-4" />
                        <span>Sync failed - will retry automatically</span>
                      </div>
                    )}
                    {cloudSyncStatus === 'idle' && (
                      <div className="flex items-center text-muted-foreground">
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>Waiting for next sync cycle</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveConfig} disabled={isConfiguring}>
            {isConfiguring ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {syncEnabled && cloudProvider === "firebase" && (
        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration</CardTitle>
            <CardDescription>
              Connect to Firebase Realtime Database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isFirebaseReady ? (
              <div className="space-y-4">
                <p className="text-sm text-destructive">
                  Firebase is not properly configured. Please update the credentials in the firebase.ts file.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">How to Configure Firebase:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-500 hover:underline">Firebase Console</a></li>
                    <li>Add a web app to your project and register it</li>
                    <li>Enable the Realtime Database in your project</li>
                    <li>Copy the configuration from Firebase and update the <code className="px-1 py-0.5 bg-muted-foreground/20 rounded">src/services/firebase.ts</code> file</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm">
                  Your PLC data is being automatically synchronized with Firebase Realtime Database. You can view your data in the Firebase console.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-md text-xs font-mono">
                  <div>Database Path: <span className="text-green-600">plc-data/{activePLC?.id || 'none'}</span></div>
                  <div className="mt-1">Status: <span className="text-blue-600">Connected</span></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CloudSyncConfig;
