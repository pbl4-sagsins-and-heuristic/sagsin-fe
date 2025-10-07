import { useEffect, useMemo, useState } from "react";
import { SocketConnection } from "@/socket/socket";
import type { Socket } from "socket.io-client";
import { NodeDetail } from "../components/nodes/node-detail";

export default function NodeManagement() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter((n) =>
      (n.hostname || "").toLowerCase().includes(q) || (n.ip || "").toLowerCase().includes(q)
    );
  }, [nodes, query]);

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
        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by hostname or IP..."
            className="w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        {filtered.length === 0 ? (
          <div className="text-muted-foreground">No nodes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filtered.map((node) => (
              <NodeDetail key={node._id || node.ip} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
