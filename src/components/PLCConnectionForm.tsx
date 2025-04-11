
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLCConfiguration, usePLC } from "@/context/PlcContext";
import { Switch } from "@/components/ui/switch";
import { Server, Trash2 } from "lucide-react";

const PLCConnectionForm = () => {
  const { 
    plcConfigurations, 
    activePLC, 
    isConnected, 
    isConnecting, 
    connectToPLC, 
    disconnectFromPLC,
    addPLCConfiguration,
    removePLCConfiguration
  } = usePLC();
  
  const [selectedPLC, setSelectedPLC] = useState<string>(activePLC?.id || (plcConfigurations.length > 0 ? plcConfigurations[0].id : ""));
  const [formOpen, setFormOpen] = useState(false);
  const [newPLC, setNewPLC] = useState<Partial<PLCConfiguration>>({
    name: "",
    type: "tcp",
    ipAddress: "192.168.1.10",
    port: 502,
    serialPort: "COM1",
    baudRate: 9600,
    parity: "N",
    unitId: 1,
    registerAddress: 0x6304,
    registerCount: 1,
    description: ""
  });
  
  const handleConnect = async () => {
    const config = plcConfigurations.find(config => config.id === selectedPLC);
    if (config) {
      await connectToPLC(config);
    }
  };
  
  const handleAddPLC = () => {
    // Validate form
    if (!newPLC.name) return;
    
    const config: PLCConfiguration = {
      id: Date.now().toString(),
      name: newPLC.name || "New PLC",
      type: newPLC.type as "tcp" | "rtu",
      ipAddress: newPLC.type === "tcp" ? newPLC.ipAddress : undefined,
      port: newPLC.type === "tcp" ? newPLC.port : undefined,
      serialPort: newPLC.type === "rtu" ? newPLC.serialPort : undefined,
      baudRate: newPLC.type === "rtu" ? newPLC.baudRate : undefined,
      parity: newPLC.type === "rtu" ? newPLC.parity : undefined,
      unitId: newPLC.unitId || 1,
      registerAddress: newPLC.registerAddress || 0,
      registerCount: newPLC.registerCount || 1,
      description: newPLC.description
    };
    
    addPLCConfiguration(config);
    setSelectedPLC(config.id);
    setFormOpen(false);
    
    // Reset form
    setNewPLC({
      name: "",
      type: "tcp",
      ipAddress: "192.168.1.10",
      port: 502,
      serialPort: "COM1",
      baudRate: 9600,
      parity: "N",
      unitId: 1,
      registerAddress: 0x6304,
      registerCount: 1,
      description: ""
    });
  };
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plcConfigurations.map((config) => (
          <Card 
            key={config.id} 
            className={`${config.id === activePLC?.id && isConnected ? 'border-success' : ''}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{config.name}</span>
                {config.id === activePLC?.id && isConnected && (
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                )}
              </CardTitle>
              <CardDescription>
                {config.type === "tcp" 
                  ? `TCP: ${config.ipAddress}:${config.port}` 
                  : `RTU: ${config.serialPort} @ ${config.baudRate}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit ID:</span>
                  <span>{config.unitId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Register:</span>
                  <span>0x{config.registerAddress.toString(16).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Count:</span>
                  <span>{config.registerCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {config.id === activePLC?.id && isConnected ? (
                <Button 
                  variant="outline" 
                  onClick={disconnectFromPLC}
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="default"
                  onClick={() => {
                    setSelectedPLC(config.id);
                    connectToPLC(config);
                  }}
                  disabled={isConnecting}
                >
                  Connect
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removePLCConfiguration(config.id)}
                disabled={config.id === activePLC?.id && isConnected}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center h-full">
              <CardContent className="pt-6 flex flex-col items-center">
                <Server className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Add New PLC</p>
                <p className="text-sm text-muted-foreground">Configure a new PLC connection</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New PLC Configuration</DialogTitle>
              <DialogDescription>
                Enter the connection details for your PLC device.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">PLC Name</Label>
                <Input 
                  id="name" 
                  value={newPLC.name} 
                  onChange={(e) => setNewPLC({ ...newPLC, name: e.target.value })} 
                  placeholder="Factory Floor PLC"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Connection Type</Label>
                <RadioGroup 
                  value={newPLC.type} 
                  onValueChange={(value) => setNewPLC({ ...newPLC, type: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tcp" id="tcp" />
                    <Label htmlFor="tcp">TCP (Ethernet)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rtu" id="rtu" />
                    <Label htmlFor="rtu">RTU (Serial)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {newPLC.type === "tcp" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="ipAddress">IP Address</Label>
                    <Input 
                      id="ipAddress" 
                      value={newPLC.ipAddress} 
                      onChange={(e) => setNewPLC({ ...newPLC, ipAddress: e.target.value })} 
                      placeholder="192.168.1.10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="port">Port</Label>
                    <Input 
                      id="port" 
                      type="number" 
                      value={newPLC.port} 
                      onChange={(e) => setNewPLC({ ...newPLC, port: parseInt(e.target.value) })} 
                      placeholder="502"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="serialPort">Serial Port</Label>
                    <Input 
                      id="serialPort" 
                      value={newPLC.serialPort} 
                      onChange={(e) => setNewPLC({ ...newPLC, serialPort: e.target.value })} 
                      placeholder="COM1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="baudRate">Baud Rate</Label>
                    <Select 
                      value={newPLC.baudRate?.toString()} 
                      onValueChange={(value) => setNewPLC({ ...newPLC, baudRate: parseInt(value) })}
                    >
                      <SelectTrigger id="baudRate">
                        <SelectValue placeholder="Select baud rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9600">9600</SelectItem>
                        <SelectItem value="19200">19200</SelectItem>
                        <SelectItem value="38400">38400</SelectItem>
                        <SelectItem value="57600">57600</SelectItem>
                        <SelectItem value="115200">115200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parity">Parity</Label>
                    <Select 
                      value={newPLC.parity} 
                      onValueChange={(value) => setNewPLC({ ...newPLC, parity: value })}
                    >
                      <SelectTrigger id="parity">
                        <SelectValue placeholder="Select parity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="N">None (N)</SelectItem>
                        <SelectItem value="E">Even (E)</SelectItem>
                        <SelectItem value="O">Odd (O)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unitId">Unit ID</Label>
                  <Input 
                    id="unitId" 
                    type="number" 
                    value={newPLC.unitId} 
                    onChange={(e) => setNewPLC({ ...newPLC, unitId: parseInt(e.target.value) })} 
                    placeholder="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="registerCount">Register Count</Label>
                  <Input 
                    id="registerCount" 
                    type="number" 
                    value={newPLC.registerCount} 
                    onChange={(e) => setNewPLC({ ...newPLC, registerCount: parseInt(e.target.value) })} 
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="registerAddress">Register Address (Hex)</Label>
                <Input 
                  id="registerAddress" 
                  value={`0x${newPLC.registerAddress?.toString(16)}`} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0x/, '');
                    const numVal = parseInt(val, 16);
                    if (!isNaN(numVal)) {
                      setNewPLC({ ...newPLC, registerAddress: numVal });
                    }
                  }} 
                  placeholder="0x6304"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newPLC.description} 
                  onChange={(e) => setNewPLC({ ...newPLC, description: e.target.value })} 
                  placeholder="Factory floor main control PLC"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPLC}>Add PLC</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {plcConfigurations.length > 0 && !isConnected && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect to PLC</CardTitle>
              <CardDescription>
                Select a PLC configuration from the list and connect to start monitoring data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="selectPLC">Select PLC</Label>
                  <Select 
                    value={selectedPLC}
                    onValueChange={setSelectedPLC}
                  >
                    <SelectTrigger id="selectPLC">
                      <SelectValue placeholder="Select a PLC" />
                    </SelectTrigger>
                    <SelectContent>
                      {plcConfigurations.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleConnect}
                disabled={isConnecting || !selectedPLC}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default PLCConnectionForm;
