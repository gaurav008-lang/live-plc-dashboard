
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number | boolean;
  type: "success" | "warning" | "danger" | "info";
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

const StatusCard = ({ 
  title, 
  value, 
  type, 
  icon, 
  description,
  className 
}: StatusCardProps) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "danger":
        return <AlertCircle className="h-5 w-5 text-danger" />;
      case "info":
      default:
        return <Clock className="h-5 w-5 text-info" />;
    }
  };
  
  const getBgClass = () => {
    switch (type) {
      case "success":
        return "bg-success/10 border-success/20";
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "danger":
        return "bg-danger/10 border-danger/20";
      case "info":
      default:
        return "bg-info/10 border-info/20";
    }
  };
  
  return (
    <Card className={cn("border", getBgClass(), className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "boolean" ? (value ? "ON" : "OFF") : value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
