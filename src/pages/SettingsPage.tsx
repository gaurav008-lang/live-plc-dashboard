
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsPage = () => {
  const [dataInterval, setDataInterval] = useState("5");
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="plc">PLC Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the application interface
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="24">
                    <SelectTrigger id="time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="plc" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>PLC Connection Settings</CardTitle>
                <CardDescription>
                  Configure how the application interacts with PLC devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="data-interval">Data Polling Interval (seconds)</Label>
                  <Select 
                    value={dataInterval}
                    onValueChange={setDataInterval}
                  >
                    <SelectTrigger id="data-interval">
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
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-reconnect">Auto-Reconnect</Label>
                    <Switch
                      id="auto-reconnect"
                      checked={autoReconnect}
                      onCheckedChange={setAutoReconnect}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically attempt to reconnect if the PLC connection is lost
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reconnect-attempts">Max Reconnect Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="reconnect-attempts">
                      <SelectValue placeholder="Select number of attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                      <SelectItem value="-1">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="timeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 second</SelectItem>
                      <SelectItem value="3">3 seconds</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications about PLC events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <Switch
                      id="enable-notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about important PLC events
                  </p>
                </div>
                
                {notifications && (
                  <>
                    <div className="grid gap-2">
                      <Label>Notify On</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="notify-connection" defaultChecked />
                          <Label htmlFor="notify-connection">Connection Changes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="notify-errors" defaultChecked />
                          <Label htmlFor="notify-errors">Errors</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="notify-value-change" defaultChecked />
                          <Label htmlFor="notify-value-change">Value Changes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="notify-cloud-sync" defaultChecked />
                          <Label htmlFor="notify-cloud-sync">Cloud Sync Status</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notification-email">Email Notifications</Label>
                      <Input 
                        id="notification-email" 
                        type="email" 
                        placeholder="your-email@example.com" 
                      />
                      <p className="text-sm text-muted-foreground">
                        Receive critical alerts via email (optional)
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
