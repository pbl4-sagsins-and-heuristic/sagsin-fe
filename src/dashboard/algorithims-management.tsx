import { useEffect, useMemo, useRef, useState } from "react";
import { SocketConnection } from "@/socket/socket";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StepEvent = {
  algo: "astar" | "dijkstra" | "greedy" | string;
  action: "expand" | "consider" | "relax" | "select" | "complete" | string;
  step?: number;
  node?: string;
  from?: string;
  to?: string;
  g?: number;
  f?: number;
  dist?: number;
  path?: string[];
};

export default function AlgorithmsManagement() {
  const socketRef = useRef<typeof import("socket.io-client").io | null>(null);
  const [algo, setAlgo] = useState<"astar" | "dijkstra" | "greedy">("astar");
  const [src, setSrc] = useState<string>("ground_station_hanoi");
  const [dst, setDst] = useState<string>("ship_tokyo");
  const [nodes, setNodes] = useState<string[]>([]);
  const [steps, setSteps] = useState<StepEvent[]>([]);
  const [current, setCurrent] = useState<StepEvent | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const sock = SocketConnection.getInstance();
    socketRef.current = sock as any;

    const onStart = () => {
      setSteps([]);
      setResult(null);
      setCurrent(null);
    };
    const onStep = (ev: StepEvent) => {
      setSteps((prev) => [...prev, ev]);
      setCurrent(ev);
    };
    const onComplete = (payload: any) => {
      setResult(payload.result || null);
    };

    const onNodeUpdated = (node: any) => {
      if (node?.hostname) {
        setNodes((prev) => {
          const exists = prev.includes(node.hostname);
          return exists ? prev : [...prev, node.hostname];
        });
      }
    };

    sock.on("heuristic:run-start", onStart);
    sock.on("heuristic:step", onStep);
    sock.on("heuristic:complete", onComplete);
    sock.on("node-updated", onNodeUpdated);

    return () => {
      sock.off("heuristic:run-start", onStart);
      sock.off("heuristic:step", onStep);
      sock.off("heuristic:complete", onComplete);
      sock.off("node-updated", onNodeUpdated);
    };
  }, []);

  const timeline = useMemo(() => {
    return steps.map((s, i) => ({
      i,
      metric:
        s.f ?? s.g ?? s.dist ?? (s.action === "complete" ? steps.length : i),
      label: `${s.action} ${s.node ?? s.from ?? ""}${s.to ? `→${s.to}` : ""}`,
    }));
  }, [steps]);

  const handleRun = () => {
    const sock = SocketConnection.getInstance();
    sock.emit("heuristic:request-run", { algo, src, dst });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Algorithms Management</h1>
      <p className="text-sm text-muted-foreground">
        Stream live heuristic steps and visualize the search process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <select
            className="border rounded-md p-2 w-full bg-background hover:bg-accent transition-colors"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
          >
            <option value="astar">A* (A-Star)</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="greedy">Greedy Best-First</option>
          </select>
        </div>
        <div className="col-span-1 space-y-2">
          <label className="text-sm font-medium">Source Node</label>
          <select
            className="border rounded-md p-2 w-full bg-background hover:bg-accent transition-colors"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          >
            {nodes.length > 0 ? (
              nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))
            ) : (
              <option value={src}>{src}</option>
            )}
          </select>
        </div>
        <div className="col-span-1 space-y-2">
          <label className="text-sm font-medium">Destination Node</label>
          <select
            className="border rounded-md p-2 w-full bg-background hover:bg-accent transition-colors"
            value={dst}
            onChange={(e) => setDst(e.target.value)}
          >
            {nodes.length > 0 ? (
              nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))
            ) : (
              <option value={dst}>{dst}</option>
            )}
          </select>
        </div>
      </div>

      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm"
        onClick={handleRun}
      >
        ▶ Run {algo.toUpperCase()}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Timeline</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="i" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="metric" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Animation</h2>
          <div className="relative h-64 overflow-hidden bg-muted rounded">
            <AnimatePresence>
              {current && (
                <motion.div
                  key={`${current.action}-${current.node ?? current.to}-${current.step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-x-0 top-4 mx-auto w-[90%] bg-background border rounded p-2 shadow"
                >
                  <div className="text-xs text-muted-foreground">
                    {current.algo.toUpperCase()} — Step {current.step ?? ""}
                  </div>
                  <div className="font-medium">
                    {current.action} {current.node ?? current.from}
                    {current.to ? ` → ${current.to}` : ""}
                  </div>
                  <div className="text-xs grid grid-cols-3 gap-2 mt-1">
                    {current.f !== undefined && <span>f: {current.f?.toFixed?.(2) ?? current.f}</span>}
                    {current.g !== undefined && <span>g: {current.g?.toFixed?.(2) ?? current.g}</span>}
                    {current.dist !== undefined && <span>dist: {current.dist?.toFixed?.(2) ?? current.dist}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Route Found</CardTitle>
            <CardDescription>Optimal path computed by {algo.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Path Length: {result.hop_count} hops</Badge>
              <Badge variant="secondary">Total Weight: {result.total_weight?.toFixed(3)}</Badge>
              <Badge variant="secondary">Stability: {(result.stability_score * 100).toFixed(1)}%</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Path:</div>
              <div className="flex flex-wrap gap-2">
                {result.path?.map((node: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                      {node}
                    </span>
                    {idx < result.path.length - 1 && (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="border rounded-md p-2 space-y-1">
                <div className="text-muted-foreground text-xs">Delay</div>
                <div className="font-semibold">{result.total_delay_ms?.toFixed(2)} ms</div>
              </div>
              <div className="border rounded-md p-2 space-y-1">
                <div className="text-muted-foreground text-xs">Jitter</div>
                <div className="font-semibold">{result.total_jitter_ms?.toFixed(2)} ms</div>
              </div>
              <div className="border rounded-md p-2 space-y-1">
                <div className="text-muted-foreground text-xs">Loss Rate</div>
                <div className="font-semibold">{(result.avg_loss_rate * 100).toFixed(2)}%</div>
              </div>
              <div className="border rounded-md p-2 space-y-1">
                <div className="text-muted-foreground text-xs">Min Bandwidth</div>
                <div className="font-semibold">{result.min_bandwidth_mbps?.toFixed(2)} Mbps</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}