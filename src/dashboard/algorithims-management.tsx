import { useMemo, useState } from "react";
import { SocketConnection } from "@/socket/socket";
import AlgorithmSelector from "./components/AlgorithmSelector";
import TimelineChart from "./components/TimelineChart";
import StepAnimation from "./components/StepAnimation";
import RouteResultCard from "./components/RouteResultCard";
import { useAlgorithmSocket } from "./hooks/useAlgorithmSocket";

export default function AlgorithmsManagement() {
  const [algo, setAlgo] = useState<"astar" | "dijkstra" | "greedy">("astar");
  const [src, setSrc] = useState<string>("ground_station_hanoi");
  const [dst, setDst] = useState<string>("ship_tokyo");
  
  const { nodes, steps, current, result } = useAlgorithmSocket();

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

      <AlgorithmSelector
        algo={algo}
        setAlgo={setAlgo}
        src={src}
        setSrc={setSrc}
        dst={dst}
        setDst={setDst}
        nodes={nodes}
        onRun={handleRun}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimelineChart data={timeline} />
        <StepAnimation current={current} />
      </div>

      <RouteResultCard result={result} algo={algo} />
    </div>
  );
}