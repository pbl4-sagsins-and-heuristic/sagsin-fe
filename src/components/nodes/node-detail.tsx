import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Globe, Clock, Activity } from "lucide-react";

interface NodeDetailProps {
  node: {
    hostname: string;
    name: string;
    ip: string;
    status: "UP" | "DOWN" | string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  };
}

export const NodeDetail: React.FC<NodeDetailProps> = ({ node }) => {
  const statusVariant =
    node.status === "UP" ? "default" : node.status === "DOWN" ? "destructive" : "secondary";

  const getStatusColor = (status: string) => {
    return status === "UP" ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="w-full max-w-md mb-3 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            {node.name || node.ip}
          </CardTitle>
          <Badge variant={statusVariant} className="flex items-center gap-1">
            <Activity className={`h-3 w-3 ${getStatusColor(node.status)}`} />
            {node.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* IP Address */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Globe className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-xs text-muted-foreground">IP Address</div>
            <div className="font-mono text-sm font-medium">{node.ip}</div>
          </div>
        </div>

        {/* Last Updated */}
        {node.updatedAt && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">
                {new Date(node.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Node ID */}
        {node._id && (
          <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded">
            ID: {node._id}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
