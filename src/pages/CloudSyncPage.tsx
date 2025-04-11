
import Layout from "@/components/Layout";
import CloudSyncConfig from "@/components/CloudSyncConfig";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cloud, Info } from "lucide-react";

const CloudSyncPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cloud Synchronization</h1>
          <p className="text-muted-foreground">
            Configure how PLC data is synchronized with cloud services.
          </p>
        </div>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Free Cloud Services Available</AlertTitle>
          <AlertDescription className="text-sm">
            This application uses Firebase Realtime Database to sync your PLC data to the cloud.
            The free tier allows up to 1GB of storage and 10GB of monthly transfers, perfect for most industrial monitoring needs.
          </AlertDescription>
        </Alert>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="h-7 w-7 text-blue-500" />
            <h2 className="text-xl font-semibold">Firebase Realtime Database</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your PLC data is automatically synchronized with Firebase, providing real-time access and visualization from anywhere.
            The free tier is suitable for small to medium-sized industrial applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Storage</p>
              <p className="text-2xl font-bold mt-1">1GB</p>
              <p className="text-xs text-muted-foreground mt-1">Free Tier</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Transfer</p>
              <p className="text-2xl font-bold mt-1">10GB/mo</p>
              <p className="text-xs text-muted-foreground mt-1">Free Tier</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Connections</p>
              <p className="text-2xl font-bold mt-1">100</p>
              <p className="text-xs text-muted-foreground mt-1">Simultaneous</p>
            </div>
          </div>
        </div>
        
        <CloudSyncConfig />
      </div>
    </Layout>
  );
};

export default CloudSyncPage;
