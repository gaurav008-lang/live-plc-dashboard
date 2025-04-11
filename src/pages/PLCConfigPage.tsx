
import Layout from "@/components/Layout";
import PLCConnectionForm from "@/components/PLCConnectionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        
        <Alert variant="default" className="bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800">
          <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <AlertTitle>Configuration Guide</AlertTitle>
          <AlertDescription className="text-sm">
            Set up your PLC connection below by selecting the connection type and entering the appropriate details.
            For Modbus TCP, you'll need the IP address and port. For Modbus RTU, enter the serial port and communication parameters.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                PLC Connection
              </CardTitle>
              <CardDescription>
                Configure and connect to your PLC device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PLCConnectionForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PLCConfigPage;
