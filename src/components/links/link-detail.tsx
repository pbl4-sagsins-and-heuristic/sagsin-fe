import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, Clock, Zap, Signal, List } from 'lucide-react';
import EntityHeader from '@/components/shared/entity-header';
import MetricCard from '@/components/shared/metric-card';
import TrendsToggle from '@/components/shared/trends-toggle';

interface LinkDetailProps {
	link: {
		srcNode: string;
		srcNodeName: string;
		destNode: string;
		destNodeName: string;
		available: boolean;
		metrics?: {
			bandwidthMbps?: number;
			delayMs?: number;
			jitterMs?: number;
			lossRate?: number | null;
			queueLength?: number;
		};
		createdAt?: string;
		updatedAt?: string;
		_id?: string;
	};
}

export default function LinkDetail({ link }: LinkDetailProps) {
	const [showCharts, setShowCharts] = useState(false);
	const { srcNodeName, destNodeName, available, metrics = {}, updatedAt, _id } = link;
	
	// Trend data states - similar to node-detail.tsx
	const [delayTrend, setDelayTrend] = useState<Array<{ time: string; value: number }>>([]);
	const [jitterTrend, setJitterTrend] = useState<Array<{ time: string; value: number }>>([]);
	const [bandwidthTrend, setBandwidthTrend] = useState<Array<{ time: string; value: number }>>([]);
	const [queueTrend, setQueueTrend] = useState<Array<{ time: string; value: number }>>([]);

	// Update trends when metrics change
	useEffect(() => {
		if (!metrics) return;
		const now = new Date().toISOString();

		if (metrics.delayMs !== undefined) {
			setDelayTrend(prev => {
				const lastValue = prev[prev.length - 1]?.value;
				if (lastValue !== metrics.delayMs) {
					return [...prev, { time: now, value: metrics.delayMs! }].slice(-24);
				}
				return prev;
			});
		}
		if (metrics.jitterMs !== undefined) {
			setJitterTrend(prev => {
				const lastValue = prev[prev.length - 1]?.value;
				if (lastValue !== metrics.jitterMs) {
					return [...prev, { time: now, value: metrics.jitterMs! }].slice(-24);
				}
				return prev;
			});
		}
		if (metrics.bandwidthMbps !== undefined) {
			setBandwidthTrend(prev => {
				const lastValue = prev[prev.length - 1]?.value;
				if (lastValue !== metrics.bandwidthMbps) {
					return [...prev, { time: now, value: metrics.bandwidthMbps! }].slice(-24);
				}
				return prev;
			});
		}
		if (metrics.queueLength !== undefined) {
			setQueueTrend(prev => {
				const lastValue = prev[prev.length - 1]?.value;
				if (lastValue !== metrics.queueLength) {
					return [...prev, { time: now, value: metrics.queueLength! }].slice(-24);
				}
				return prev;
			});
		}
	}, [metrics]);

	const formatMetricValue = (value: number | null | undefined, unit: string) => {
		if (value === null || value === undefined) return '-';
		return `${value} ${unit}`;
	};

	const getStatusColor = (available: boolean) => {
		return available ? 'default' : 'destructive';
	};

	const formatBandwidth = (value: number | undefined) => {
		if (!value) return '-';
		if (value >= 1000) {
			return `${(value / 1000).toFixed(2)} Gbps`;
		}
		return `${value.toFixed(2)} Mbps`;
	};

	const trendSections = [
		{
			icon: Clock,
			iconColor: 'text-blue-500',
			label: 'Delay',
			data: delayTrend,
			color: '#3b82f6',
			unit: ' ms',
		},
		{
			icon: Signal,
			iconColor: 'text-orange-500',
			label: 'Jitter',
			data: jitterTrend,
			color: '#f97316',
			unit: ' ms',
		},
		{
			icon: Zap,
			iconColor: 'text-green-500',
			label: 'Bandwidth',
			data: bandwidthTrend,
			color: '#22c55e',
			unit: ' Mbps',
		},
		{
			icon: List,
			iconColor: 'text-purple-500',
			label: 'Queue Length',
			data: queueTrend,
			color: '#a855f7',
			unit: '',
		},
	];

	return (
		<Card className="w-full mb-4">
			<EntityHeader
				icon={Wifi}
				title={`${srcNodeName} → ${destNodeName}`}
				status={available ? 'UP' : 'DOWN'}
				statusVariant={getStatusColor(available)}
				id={_id || 'N/A'}
			/>
			
			<CardContent className="space-y-4">
				{/* Metrics Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<MetricCard
						icon={Clock}
						iconColor="text-blue-500"
						label="Delay"
						value={formatMetricValue(metrics.delayMs, 'ms')}
					/>
					
					<MetricCard
						icon={Signal}
						iconColor="text-orange-500"
						label="Jitter"
						value={formatMetricValue(metrics.jitterMs, 'ms')}
					/>
					
					<MetricCard
						icon={Zap}
						iconColor="text-green-500"
						label="Bandwidth"
						value={formatBandwidth(metrics.bandwidthMbps)}
					/>
					
					<MetricCard
						icon={List}
						iconColor="text-purple-500"
						label="Queue"
						value={formatMetricValue(metrics.queueLength, '')}
					/>
				</div>

				{/* Loss Rate */}
				{metrics.lossRate !== null && metrics.lossRate !== undefined && (
					<div className="p-3 bg-muted/50 rounded-lg">
						<div className="text-xs text-muted-foreground">Loss Rate</div>
						<div className="font-mono text-sm font-medium">
							{(metrics.lossRate * 100).toFixed(2)}%
						</div>
					</div>
				)}

				{/* Timestamps */}
				<div className="flex justify-between text-xs text-muted-foreground">
					<div>
						Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
					</div>
				</div>

				{/* Charts Toggle */}
				<TrendsToggle
					showCharts={showCharts}
					onToggle={() => setShowCharts(!showCharts)}
					sections={trendSections}
					duration="2min"
				/>
			</CardContent>
		</Card>
	);
}