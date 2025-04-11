
import Layout from "@/components/Layout";
import PLCConnectionForm from "@/components/PLCConnectionForm";

const PLCConfigPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PLC Configuration</h1>
          <p className="text-muted-foreground">
            Manage your PLC connections and settings.
          </p>
        </div>
        
        <PLCConnectionForm />
      </div>
    </Layout>
  );
};

export default PLCConfigPage;
