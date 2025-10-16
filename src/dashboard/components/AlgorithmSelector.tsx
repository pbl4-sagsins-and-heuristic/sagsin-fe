type AlgorithmSelectorProps = {
  algo: "astar" | "dijkstra" | "greedy";
  setAlgo: (algo: "astar" | "dijkstra" | "greedy") => void;
  src: string;
  setSrc: (src: string) => void;
  dst: string;
  setDst: (dst: string) => void;
  nodes: string[];
  onRun: () => void;
};

export default function AlgorithmSelector({
  algo,
  setAlgo,
  src,
  setSrc,
  dst,
  setDst,
  nodes,
  onRun,
}: AlgorithmSelectorProps) {
  return (
    <div className="space-y-4">
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
        onClick={onRun}
      >
        ▶ Run {algo.toUpperCase()}
      </button>
    </div>
  );
}
