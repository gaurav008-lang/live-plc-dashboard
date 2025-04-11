
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { usePLC } from "@/context/PlcContext";
import { Server, Cloud, History, Settings, ChevronRight, ArrowRight } from "lucide-react";

const Home = () => {
  const { plcConfigurations, isConnected, activePLC } = usePLC();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PLC Monitoring Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and control your PLC devices
            </p>
          </div>
          
          {isConnected && activePLC && (
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
              <span className="text-sm font-medium">Connected to {activePLC.name}</span>
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">PLC Status</CardTitle>
                <Server className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                {isConnected 
                  ? `Connected to ${activePLC?.name}`
                  : "Not connected to any PLC"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">
                {isConnected ? (
                  <span className="text-success">Connected</span>
                ) : (
                  <span className="text-muted-foreground">Disconnected</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected 
                  ? `${activePLC?.type.toUpperCase()} connection active`
                  : `${plcConfigurations.length} PLC configurations available`}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/plc-config" className="flex items-center justify-between">
                  <span>Configure PLC</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Cloud Sync</CardTitle>
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                {isConnected && activePLC?.cloudSync?.enabled 
                  ? `Syncing to ${activePLC.cloudSync.provider}`
                  : "Cloud sync status"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">
                {isConnected && activePLC?.cloudSync?.enabled ? (
                  <span className="text-success">Enabled</span>
                ) : (
                  <span className="text-muted-foreground">Disabled</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected && activePLC?.cloudSync?.enabled
                  ? `Syncing every ${activePLC.cloudSync.interval} seconds`
                  : "Configure cloud synchronization settings"}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cloud-sync" className="flex items-center justify-between">
                  <span>Cloud Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Data History</CardTitle>
                <History className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                {isConnected 
                  ? "View historical PLC data"
                  : "No data available"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">
                {isConnected ? (
                  <span className="text-primary">Available</span>
                ) : (
                  <span className="text-muted-foreground">Not Available</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected 
                  ? "View and analyze historical data"
                  : "Connect to a PLC to view data history"}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full" disabled={!isConnected}>
                <Link to="/history" className="flex items-center justify-between">
                  <span>View History</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Settings</CardTitle>
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Configure application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold">
                <span className="text-primary">System</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust general application settings and preferences
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings" className="flex items-center justify-between">
                  <span>App Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {isConnected && activePLC && (
          <Button asChild variant="default" className="mt-4 w-full sm:w-auto">
            <Link to="/" className="flex items-center">
              <span>Go to Live Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        
        {!isConnected && (
          <div className="mt-8 flex flex-col items-center justify-center text-center p-6 border rounded-lg bg-muted/20">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Active PLC Connection</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connect to a PLC device to start monitoring data in real-time. Configure your PLC connection settings to get started.
            </p>
            <Button asChild>
              <Link to="/plc-config">Configure PLC Connection</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
