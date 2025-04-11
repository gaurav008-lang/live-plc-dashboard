
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { usePLC } from "@/context/PlcContext";

const CloudSyncConfig = () => {
  const { cloudSyncStatus } = usePLC();
  
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("5");
  const [apiKey, setApiKey] = useState("");
  const [cloudProvider, setCloudProvider] = useState("aws");
  const [isConfigured, setIsConfigured] = useState(false);
  
  const handleSaveConfig = () => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter a valid API key to configure cloud sync",
      });
      return;
    }
    
    // Simulate saving configuration
    setIsConfigured(true);
    
    toast({
      title: "Cloud Sync Configured",
      description: "Your data will now be synchronized with the cloud service",
    });
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Testing Cloud Connection",
      description: "Please wait while we test the connection...",
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "Your cloud configuration is working correctly",
      });
    }, 2000);
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Cloud Sync Configuration
          </CardTitle>
          <CardDescription>
            Configure how your PLC data is synchronized with the cloud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-sync">Automatic Synchronization</Label>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, data will be automatically uploaded to the cloud service
            </p>
          </div>
          
          {autoSync && (
            <div className="grid gap-2">
              <Label htmlFor="sync-interval">Sync Interval (seconds)</Label>
              <Select 
                value={syncInterval} 
                onValueChange={setSyncInterval}
              >
                <SelectTrigger id="sync-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 second</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="cloud-provider">Cloud Service Provider</Label>
            <Select 
              value={cloudProvider} 
              onValueChange={setCloudProvider}
            >
              <SelectTrigger id="cloud-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">AWS IoT Core</SelectItem>
                <SelectItem value="azure">Azure IoT Hub</SelectItem>
                <SelectItem value="gcp">Google Cloud IoT</SelectItem>
                <SelectItem value="custom">Custom API Endpoint</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key / Connection String</Label>
            <Input 
              id="api-key" 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Enter your API key or connection string"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This key will be used to authenticate with the cloud service
            </p>
          </div>
          
          {cloudProvider === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="api-endpoint">API Endpoint URL</Label>
              <Input 
                id="api-endpoint" 
                placeholder="https://your-api-endpoint.com/data"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={!apiKey}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
          <Button onClick={handleSaveConfig} disabled={!apiKey}>
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            {isConfigured ? (
              <Cloud className="mr-2 h-5 w-5 text-success" />
            ) : (
              <CloudOff className="mr-2 h-5 w-5 text-muted-foreground" />
            )}
            Cloud Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-medium">Status</span>
              <div className="flex items-center">
                {isConfigured ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-success mr-2"></span>
                    <span>Configured</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-muted mr-2"></span>
                    <span>Not Configured</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-medium">Last Sync</span>
              <span>{cloudSyncStatus === 'synced' ? 'Just now' : 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-medium">Sync Frequency</span>
              <span>{autoSync ? `Every ${syncInterval} second(s)` : 'Manual'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Service</span>
              <span>
                {cloudProvider === 'aws' && 'AWS IoT Core'}
                {cloudProvider === 'azure' && 'Azure IoT Hub'}
                {cloudProvider === 'gcp' && 'Google Cloud IoT'}
                {cloudProvider === 'custom' && 'Custom API Endpoint'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="outline"
            disabled={!isConfigured}
          >
            Sync Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CloudSyncConfig;
