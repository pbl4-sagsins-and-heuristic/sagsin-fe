import { useEffect, useState } from "react";
import { SocketConnection } from "@/socket/socket";
import type { Socket } from "socket.io-client";
import { NodeDetail } from "./node-detail";

export default function NodeManagement() {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const socket: Socket = SocketConnection.getInstance();
    const handleNodeUpdate = (data: any[]) => {
      setNodes(data);
    };
    socket.on("node-updated", handleNodeUpdate);
    socket.emit("get-nodes");
    return () => {
      socket.off("node-updated", handleNodeUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-muted/50 rounded-xl p-6 min-h-[300px]">
        <h2 className="text-xl font-bold mb-4">Nodes Management</h2>
        {nodes.length === 0 ? (
          <div className="text-muted-foreground">No nodes found.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {nodes.map((node) => (
              <NodeDetail key={node._id || node.ip} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
