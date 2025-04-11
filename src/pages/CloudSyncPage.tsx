
import Layout from "@/components/Layout";
import CloudSyncConfig from "@/components/CloudSyncConfig";

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
        
        <CloudSyncConfig />
      </div>
    </Layout>
  );
};

export default CloudSyncPage;
