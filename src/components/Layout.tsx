
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Settings, 
  Cloud, 
  Server, 
  History, 
  ChevronRight,
  LayoutDashboard 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePLC } from "@/context/PlcContext";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { activePLC, isConnected, cloudSyncStatus } = usePLC();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center py-6">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">PLC Dashboard</h1>
            </div>
            {isConnected && activePLC && (
              <div className="flex items-center mt-3">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse mr-2"></span>
                <span className="text-sm font-medium text-muted-foreground">
                  {activePLC.name}
                </span>
              </div>
            )}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                      <Link to="/" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Home className="mr-2 h-4 w-4" />
                          <span>Home</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                      <Link to="/dashboard" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/plc-config"}>
                      <Link to="/plc-config" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Server className="mr-2 h-4 w-4" />
                          <span>PLC Config</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/cloud-sync"}>
                      <Link to="/cloud-sync" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Cloud className="mr-2 h-4 w-4" />
                          <span>Cloud Sync</span>
                        </div>
                        <div className="flex items-center">
                          {cloudSyncStatus === 'syncing' && (
                            <Badge variant="outline" className="mr-2 bg-warning text-white">
                              Syncing
                            </Badge>
                          )}
                          {cloudSyncStatus === 'synced' && (
                            <Badge variant="outline" className="mr-2 bg-success text-white">
                              Synced
                            </Badge>
                          )}
                          {cloudSyncStatus === 'failed' && (
                            <Badge variant="outline" className="mr-2 bg-danger text-white">
                              Failed
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/history"}>
                      <Link to="/history" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <History className="mr-2 h-4 w-4" />
                          <span>History</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                      <Link to="/settings" className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
            <div>
              <p>Live PLC Dashboard</p>
              <p className="mt-1">© 2025 Industrial IoT</p>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <SidebarTrigger />
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Badge variant="outline" className="bg-success text-white">
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted">
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
          
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
