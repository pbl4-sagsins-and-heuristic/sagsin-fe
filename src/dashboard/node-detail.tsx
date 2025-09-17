import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NodeDetailProps {
  node: {
    hostname: string;
    ip: string;
    status: "UP" | "DOWN" | string;
    links: any[];
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  };
}

export const NodeDetail: React.FC<NodeDetailProps> = ({ node }) => {
  const statusVariant =
    node.status === "UP" ? "default" : node.status === "DOWN" ? "destructive" : "secondary";

  return (
    <Card className="w-full mb-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">
          {node.hostname || node.ip}
        </CardTitle>
        <Badge variant={statusVariant}>{node.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>IP: <span className="font-mono">{node.ip}</span></div>
        <div>
          Last updated:{" "}
          {node.updatedAt
            ? new Date(node.updatedAt).toLocaleString()
            : "-"}
        </div>
        <div>Links: {node.links?.length ?? 0}</div>
      </CardContent>
    </Card>
  );
};
