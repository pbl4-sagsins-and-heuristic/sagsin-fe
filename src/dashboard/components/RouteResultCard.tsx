import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RouteResult = {
  path: string[];
  total_weight: number;
  total_delay_ms: number;
  total_jitter_ms: number;
  avg_loss_rate: number;
  min_bandwidth_mbps: number;
  hop_count: number;
  stability_score: number;
};

type RouteResultCardProps = {
  result: RouteResult | null;
  algo: string;
};

export default function RouteResultCard({ result, algo }: RouteResultCardProps) {
  if (!result) return null;

  return (
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
  );
}
