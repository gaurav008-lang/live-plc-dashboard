
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLCDataPoint } from "@/context/PlcContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataChartProps {
  data: PLCDataPoint[];
  title: string;
  dataKey: string;
  color?: string;
  className?: string;
}

const DataChart = ({ data, title, dataKey, color = "#3b82f6", className }: DataChartProps) => {
  // Format data for Recharts
  const chartData = data.map((point) => {
    // Extract hour:minute:second from ISO timestamp
    const time = new Date(point.timestamp).toTimeString().split(' ')[0];
    
    // Handle boolean values from PLC coils
    const value = typeof point.values[0] === "boolean" 
      ? (point.values[0] ? 1 : 0) 
      : point.values[0];
    
    return {
      time,
      [dataKey]: value,
    };
  });
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }} 
              angle={-45} 
              textAnchor="end" 
              height={60}
            />
            <YAxis domain={[0, 1]} ticks={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DataChart;
