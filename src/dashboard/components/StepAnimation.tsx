import { motion, AnimatePresence } from "framer-motion";

export type StepEvent = {
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

type StepAnimationProps = {
  current: StepEvent | null;
};

export default function StepAnimation({ current }: StepAnimationProps) {
  return (
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
  );
}
