import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Server,
  Globe,
  Clock,
  Cpu,
  Signal,
  Zap,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import EntityHeader from '@/components/shared/entity-header';
import MetricCard from '@/components/shared/metric-card';
import TrendsToggle from '@/components/shared/trends-toggle';

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
  const { name, ip, status, type, metrics, updatedAt, _id } = node;

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

  const trendSections = [
    {
      icon: Cpu,
      iconColor: 'text-red-500',
      label: 'CPU Load',
      data: cpuTrend,
      color: '#ef4444',
      unit: '%',
    },
    {
      icon: Signal,
      iconColor: 'text-orange-500',
      label: 'Jitter',
      data: jitterTrend,
      color: '#f97316',
      unit: 'ms',
    },
    {
      icon: Zap,
      iconColor: 'text-green-500',
      label: 'Throughput',
      data: throughputTrend,
      color: '#22c55e',
      unit: ' Mbps',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-purple-500',
      label: 'Queue Length',
      data: queueTrend,
      color: '#a855f7',
      unit: '',
    },
  ];

  return (
    <Card className="w-full mb-3 hover:shadow-md transition-shadow">
      <EntityHeader
        icon={Server}
        iconColor="text-blue-500"
        title={name}
        titlePrefix={<span className="mr-1">{getTypeIcon(type)}</span>}
        status={status}
        statusVariant={getStatusColor(status)}
        id={_id}
      />

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            icon={Globe}
            iconColor="text-blue-500"
            label="IP Address"
            value={ip}
          />

          <MetricCard
            icon={Clock}
            iconColor="text-orange-500"
            label="Last Updated"
            value={updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
          />
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                icon={Cpu}
                iconColor="text-red-500"
                label="CPU Load"
                value={
                  <span className="flex items-center">
                    {formatMetricWithTrend(metrics.cpuLoad, '%', cpuTrendValue).display}
                    {formatMetricWithTrend(metrics.cpuLoad, '%', cpuTrendValue).icon}
                  </span>
                }
              />

              <MetricCard
                icon={Signal}
                iconColor="text-orange-500"
                label="Jitter"
                value={
                  <span className="flex items-center">
                    {formatMetricWithTrend(metrics.jitterMs, 'ms', jitterTrendValue).display}
                    {formatMetricWithTrend(metrics.jitterMs, 'ms', jitterTrendValue).icon}
                  </span>
                }
              />

              <MetricCard
                icon={Zap}
                iconColor="text-green-500"
                label="Throughput"
                value={
                  <span className="flex items-center">
                    {formatThroughputWithTrend(metrics.throughputMbps, throughputTrendValue).display}
                    {formatThroughputWithTrend(metrics.throughputMbps, throughputTrendValue).icon}
                  </span>
                }
              />

              <MetricCard
                icon={TrendingUp}
                iconColor="text-purple-500"
                label="Queue Length"
                value={
                  <span className="flex items-center">
                    {formatMetricWithTrend(metrics.queueLen, '', queueTrendValue).display}
                    {formatMetricWithTrend(metrics.queueLen, '', queueTrendValue).icon}
                  </span>
                }
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <div>
                Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
              </div>
            </div>

            <TrendsToggle
              showCharts={showCharts}
              onToggle={() => setShowCharts(!showCharts)}
              sections={trendSections}
              duration="5min"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
