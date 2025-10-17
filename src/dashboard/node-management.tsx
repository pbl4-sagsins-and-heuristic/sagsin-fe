import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useNodes } from "@/contexts/network-context";
import { NodeDetail } from "../components/nodes/node-detail";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function NodeManagement() {
  const { nodes, loading, error, searchNodes, refreshNodes } = useNodes();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  // Lấy search query từ URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return searchNodes(query);
  }, [query, searchNodes]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-muted/50 rounded-xl p-6 min-h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Nodes Management</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNodes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by hostname, IP, or name..."
            className="w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>

        {error && (
          <div className="text-destructive mb-4 p-3 bg-destructive/10 rounded-md">
            Error: {error}
          </div>
        )}

        {loading && nodes.length === 0 ? (
          <div className="text-muted-foreground">Loading nodes...</div>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground">No nodes found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((node) => (
              <NodeDetail 
                key={node._id || node.ip} 
                node={{
                  _id: node._id || node.ip,
                  ip: node.ip,
                  hostname: node.hostname || 'Unknown',
                  name: node.name || node.hostname || 'Unknown Node',
                  status: node.status || 'UP',
                  type: node.type || 'unknown',
                  metrics: node.metrics,
                  createdAt: node.createdAt,
                  updatedAt: node.updatedAt,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
