import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Server,
  Globe,
  Clock,
  Cpu,
  Activity,
  Signal,
  Zap,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import MetricChart from '@/components/charts/metric-chart';

interface NodeDetailProps {
  node: {
    _id: string;
    ip: string;
    hostname: string;
    name: string;
    status: 'UP' | 'DOWN';
    type: string;
    metrics?: {
      cpuLoad: number;
      jitterMs: number;
      queueLen: number;
      throughputMbps: number;
    };
    createdAt?: string;
    updatedAt?: string;
  };
}

export const NodeDetail: React.FC<NodeDetailProps> = ({ node }) => {
  const [showCharts, setShowCharts] = useState(false);
  const { name, ip, hostname, status, type, metrics, updatedAt, _id } = node;

  const formatMetricWithTrend = (
    value: number | null | undefined,
    unit: string,
    trend?: number
  ) => {
    if (value === null || value === undefined) return { display: '-', icon: null };
    const display = `${value} ${unit}`;
    let icon = null;

    if (trend !== undefined) {
      if (trend > 0.05) icon = <ArrowUp className="h-3 w-3 text-green-500 ml-1" />;
      else if (trend < -0.05) icon = <ArrowDown className="h-3 w-3 text-red-500 ml-1" />;
    }
    return { display, icon };
  };

  const formatThroughputWithTrend = (value: number | undefined, trend?: number) => {
    if (!value) return { display: '-', icon: null };
    const display = value >= 1000 ? `${(value / 1000).toFixed(2)} Gbps` : `${value} Mbps`;
    let icon = null;

    if (trend !== undefined) {
      if (trend > 0.05) icon = <ArrowUp className="h-3 w-3 text-green-500 ml-1" />;
      else if (trend < -0.05) icon = <ArrowDown className="h-3 w-3 text-red-500 ml-1" />;
    }
    return { display, icon };
  };

  const getStatusColor = (status: string) => (status === 'UP' ? 'default' : 'destructive');

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'drone':
        return '🚁';
      case 'ship':
        return '🚢';
      case 'ground_station':
        return '📡';
      case 'mobile_device':
      case 'mobile':
        return '📱';
      case 'satellite':
        return '🛰️';
      default:
        return '💻';
    }
  };

  const [cpuTrend, setCpuTrend] = useState<Array<{ time: string; value: number }>>([]);
  const [jitterTrend, setJitterTrend] = useState<Array<{ time: string; value: number }>>([]);
  const [throughputTrend, setThroughputTrend] = useState<Array<{ time: string; value: number }>>([]);
  const [queueTrend, setQueueTrend] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    if (!metrics) return;
    const now = new Date().toISOString();

    setCpuTrend(prev => [...prev, { time: now, value: metrics.cpuLoad }].slice(-10));
    setJitterTrend(prev => [...prev, { time: now, value: metrics.jitterMs }].slice(-10));
    setThroughputTrend(prev => [...prev, { time: now, value: metrics.throughputMbps }].slice(-10));
    setQueueTrend(prev => [...prev, { time: now, value: metrics.queueLen }].slice(-10));
  }, [metrics]);

  const getTrend = (data: any[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3);
    if (recent.length < 2) return 0;
    return (recent[recent.length - 1].value - recent[0].value) / recent[0].value;
  };

  const cpuTrendValue = getTrend(cpuTrend);
  const jitterTrendValue = getTrend(jitterTrend);
  const throughputTrendValue = getTrend(throughputTrend);
  const queueTrendValue = getTrend(queueTrend);

  return (
    <Card className="w-full mb-3 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <span className="mr-1">{getTypeIcon(type)}</span>
            {name}
          </CardTitle>
          <Badge variant={getStatusColor(status)} className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-green-500" />
            {status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground font-mono">ID: {_id}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Globe className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-xs text-muted-foreground">IP Address</div>
              <div className="font-mono text-sm font-medium">{ip}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">
                {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Cpu className="h-4 w-4 text-red-500" />
                <div>
                  <div className="text-xs text-muted-foreground">CPU Load</div>
                  <div className="font-mono text-sm font-medium flex items-center">
                    {formatMetricWithTrend(metrics.cpuLoad, '%', cpuTrendValue).display}
                    {formatMetricWithTrend(metrics.cpuLoad, '%', cpuTrendValue).icon}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Signal className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Jitter</div>
                  <div className="font-mono text-sm font-medium flex items-center">
                    {formatMetricWithTrend(metrics.jitterMs, 'ms', jitterTrendValue).display}
                    {formatMetricWithTrend(metrics.jitterMs, 'ms', jitterTrendValue).icon}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Throughput</div>
                  <div className="font-mono text-sm font-medium flex items-center">
                    {formatThroughputWithTrend(metrics.throughputMbps, throughputTrendValue).display}
                    {formatThroughputWithTrend(metrics.throughputMbps, throughputTrendValue).icon}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Queue Length</div>
                  <div className="font-mono text-sm font-medium flex items-center">
                    {formatMetricWithTrend(metrics.queueLen, '', queueTrendValue).display}
                    {formatMetricWithTrend(metrics.queueLen, '', queueTrendValue).icon}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <div>
                Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
              </div>
            </div>

            <div className="border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCharts(!showCharts)}
                className="text-xs"
              >
                {showCharts ? (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" /> Hide Trends
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-3 w-3 mr-1" /> Show Trends
                  </>
                )}
                <TrendingUp className="h-3 w-3 ml-1" />
              </Button>

              {showCharts && (
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-red-500" />
                        CPU Load Trend (5min)
                      </h4>
                      <MetricChart
                        data={cpuTrend}
                        title="CPU Load"
                        color="#ef4444"
                        unit="%"
                        height={150}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Signal className="h-4 w-4 text-orange-500" />
                        Jitter Trend (5min)
                      </h4>
                      <MetricChart
                        data={jitterTrend}
                        title="Jitter"
                        color="#f97316"
                        unit="ms"
                        height={150}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        Throughput Trend (5min)
                      </h4>
                      <MetricChart
                        data={throughputTrend}
                        title="Throughput"
                        color="#22c55e"
                        unit=" Mbps"
                        height={150}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        Queue Length Trend (5min)
                      </h4>
                      <MetricChart
                        data={queueTrend}
                        title="Queue Length"
                        color="#a855f7"
                        unit=""
                        height={150}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
