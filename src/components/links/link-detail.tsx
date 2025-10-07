import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Wifi, Clock, Zap, Signal, List, ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMetricsTrends } from '@/hooks/use-metrics-trends';

interface LinkDetailProps {
	link: {
		srcNode: string;
		srcNodeName: string;
		destNode: string;
		destNodeName: string;
		available: boolean;
		metrics?: {
			bandwidth_mbps?: number;
			delay_ms?: number;
			jitter_ms?: number;
			loss_rate?: number | null;
			queue_length?: number;
		};
		createdAt?: string;
		updatedAt?: string;
		_id?: string;
	};
}

export default function LinkDetail({ link }: LinkDetailProps) {
	const [showCharts, setShowCharts] = useState(false);
	const { srcNodeName, destNodeName, available, metrics = {}, updatedAt, _id } = link;
	
	const { delayTrend, jitterTrend, bandwidthTrend, queueTrend } = useMetricsTrends(metrics, updatedAt);

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

	const chartConfig = {
		delay: {
			label: "Delay",
			color: "hsl(var(--chart-1))",
		},
		jitter: {
			label: "Jitter", 
			color: "hsl(var(--chart-2))",
		},
		bandwidth: {
			label: "Bandwidth",
			color: "hsl(var(--chart-3))",
		},
		queue: {
			label: "Queue",
			color: "hsl(var(--chart-4))",
		},
	} satisfies ChartConfig;

	return (
		<Card className="w-full mb-4">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-bold flex items-center gap-2">
						<Wifi className="h-5 w-5" />
						{srcNodeName} → {destNodeName}
					</CardTitle>
					<Badge variant={getStatusColor(available)} className="flex items-center gap-1">
						<Activity className="h-3 w-3" />
						{available ? 'UP' : 'DOWN'}
					</Badge>
				</div>
				<div className="text-xs text-muted-foreground font-mono">
					ID: {_id}
				</div>
			</CardHeader>
			
			<CardContent className="space-y-4">
				{/* Metrics Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
						<Clock className="h-4 w-4 text-blue-500" />
						<div>
							<div className="text-xs text-muted-foreground">Delay</div>
							<div className="font-mono text-sm font-medium">
								{formatMetricValue(metrics.delay_ms, 'ms')}
							</div>
						</div>
					</div>
					
					<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
						<Signal className="h-4 w-4 text-orange-500" />
						<div>
							<div className="text-xs text-muted-foreground">Jitter</div>
							<div className="font-mono text-sm font-medium">
								{formatMetricValue(metrics.jitter_ms, 'ms')}
							</div>
						</div>
					</div>
					
					<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
						<Zap className="h-4 w-4 text-green-500" />
						<div>
							<div className="text-xs text-muted-foreground">Bandwidth</div>
							<div className="font-mono text-sm font-medium">
								{formatBandwidth(metrics.bandwidth_mbps)}
							</div>
						</div>
					</div>
					
					<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
						<List className="h-4 w-4 text-purple-500" />
						<div>
							<div className="text-xs text-muted-foreground">Queue</div>
							<div className="font-mono text-sm font-medium">
								{formatMetricValue(metrics.queue_length, '')}
							</div>
						</div>
					</div>
				</div>

				{/* Loss Rate */}
				{metrics.loss_rate !== null && metrics.loss_rate !== undefined && (
					<div className="p-3 bg-muted/50 rounded-lg">
						<div className="text-xs text-muted-foreground">Loss Rate</div>
						<div className="font-mono text-sm font-medium">
							{(metrics.loss_rate * 100).toFixed(2)}%
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
				<div className="border-t pt-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowCharts(!showCharts)}
						className="text-xs"
					>
						{showCharts ? (
							<><ChevronDown className="h-3 w-3 mr-1" /> Hide Trends</>
						) : (
							<><ChevronRight className="h-3 w-3 mr-1" /> Show Trends</>
						)}
						<TrendingUp className="h-3 w-3 ml-1" />
					</Button>
					
					{showCharts && (
						<div className="mt-4 space-y-6">
							{/* Top row: Delay & Jitter */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{/* Delay Chart */}
								<div className="space-y-2">
									<h4 className="text-sm font-medium flex items-center gap-2">
										<Clock className="h-4 w-4 text-blue-500" />
										Delay Trend (2min)
									</h4>
									<ChartContainer config={chartConfig} className="h-[150px]">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={delayTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
												<XAxis 
													dataKey="time" 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													interval={3} // Show every 4th tick (20 seconds apart)
												/>
												<YAxis 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													width={35}
												/>
												<ChartTooltip
													content={<ChartTooltipContent indicator="line" />}
													formatter={(value) => [`${value} ms`, 'Delay']}
												/>
												<Line 
													type="monotone" 
													dataKey="value" 
													stroke="var(--color-chart-1)" 
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>

								{/* Jitter Chart */}
								<div className="space-y-2">
									<h4 className="text-sm font-medium flex items-center gap-2">
										<Signal className="h-4 w-4 text-orange-500" />
										Jitter Trend (2min)
									</h4>
									<ChartContainer config={chartConfig} className="h-[150px]">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={jitterTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
												<XAxis 
													dataKey="time" 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													interval={3} // Show every 4th tick (20 seconds apart)
												/>
												<YAxis 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													width={35}
												/>
												<ChartTooltip
													content={<ChartTooltipContent indicator="line" />}
													formatter={(value) => [`${value} ms`, 'Jitter']}
												/>
												<Line 
													type="monotone" 
													dataKey="value" 
													stroke="var(--color-chart-2)" 
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>
							</div>

							{/* Bottom row: Bandwidth & Queue */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{/* Bandwidth Chart */}
								<div className="space-y-2">
									<h4 className="text-sm font-medium flex items-center gap-2">
										<Zap className="h-4 w-4 text-green-500" />
										Bandwidth Trend (2min)
									</h4>
									<ChartContainer config={chartConfig} className="h-[150px]">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={bandwidthTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
												<XAxis 
													dataKey="time" 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													interval={3} // Show every 4th tick (20 seconds apart)
												/>
												<YAxis 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													width={35}
												/>
												<ChartTooltip
													content={<ChartTooltipContent indicator="line" />}
													formatter={(value) => [`${value} Mbps`, 'Bandwidth']}
												/>
												<Line 
													type="monotone" 
													dataKey="value" 
													stroke="var(--color-chart-3)" 
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>

								{/* Queue Chart */}
								<div className="space-y-2">
									<h4 className="text-sm font-medium flex items-center gap-2">
										<List className="h-4 w-4 text-purple-500" />
										Queue Length Trend (2min)
									</h4>
									<ChartContainer config={chartConfig} className="h-[150px]">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={queueTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
												<XAxis 
													dataKey="time" 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													interval={3} // Show every 4th tick (20 seconds apart)
												/>
												<YAxis 
													tick={{ fontSize: 9 }}
													axisLine={false}
													tickLine={false}
													width={35}
												/>
												<ChartTooltip
													content={<ChartTooltipContent indicator="line" />}
													formatter={(value) => [value, 'Queue Length']}
												/>
												<Line 
													type="monotone" 
													dataKey="value" 
													stroke="var(--color-chart-4)" 
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}