
import { useState } from "react";
import Layout from "@/components/Layout";
import { usePLC } from "@/context/PlcContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileDown, Share } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const HistoryPage = () => {
  const { liveData } = usePLC();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const exportData = () => {
    // In a real app, this would save the data to a CSV file
    toast({
      title: "Export Started",
      description: "Your data export has been initiated",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your data has been exported successfully",
      });
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data History</h1>
          <p className="text-muted-foreground">
            View and export historical PLC data.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filter History</CardTitle>
            <CardDescription>Select a date range to filter historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filter-type">Filter Type</Label>
                <Select 
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="Select filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="on">ON Values Only</SelectItem>
                    <SelectItem value="off">OFF Values Only</SelectItem>
                    <SelectItem value="changes">State Changes Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Reset Filters
            </Button>
            <Button>
              Apply Filters
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Historical Data</CardTitle>
            <CardDescription>
              Showing {liveData.length} records from your PLC device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent PLC data.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(data.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {typeof data.values[0] === "boolean" 
                        ? (data.values[0] ? "ON" : "OFF") 
                        : data.values[0]}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Share className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {liveData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No historical data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {liveData.length} records total
            </div>
            <Button variant="outline" onClick={exportData}>
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default HistoryPage;
