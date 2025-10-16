import { useEffect, useState } from "react";
import { SocketConnection } from "@/socket/socket";
import type { StepEvent } from "../components/StepAnimation";

export function useAlgorithmSocket() {
    const [nodes, setNodes] = useState<string[]>([]);
    const [steps, setSteps] = useState<StepEvent[]>([]);
    const [current, setCurrent] = useState<StepEvent | null>(null);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const sock = SocketConnection.getInstance();

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

    return { nodes, steps, current, result };
}
