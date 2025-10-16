import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';
import MetricChart from '@/components/charts/metric-chart';
import type { LucideIcon } from 'lucide-react';

interface TrendData {
	time: string;
	value: number;
}

interface MetricTrendSection {
	icon: LucideIcon;
	iconColor: string;
	label: string;
	data: TrendData[];
	color: string;
	unit: string;
}

interface TrendsToggleProps {
	showCharts: boolean;
	onToggle: () => void;
	sections: MetricTrendSection[];
	duration?: string;
}

export default function TrendsToggle({ 
	showCharts, 
	onToggle, 
	sections,
	duration = '5min'
}: TrendsToggleProps) {
	return (
		<div className="border-t pt-3">
			<Button
				variant="ghost"
				size="sm"
				onClick={onToggle}
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
						{sections.slice(0, 2).map((section, index) => (
							<div key={index} className="space-y-2">
								<h4 className="text-sm font-medium flex items-center gap-2">
									<section.icon className={`h-4 w-4 ${section.iconColor}`} />
									{section.label} Trend ({duration})
								</h4>
								<MetricChart
									data={section.data}
									title={section.label}
									color={section.color}
									unit={section.unit}
									height={150}
								/>
							</div>
						))}
					</div>

					{sections.length > 2 && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{sections.slice(2).map((section, index) => (
								<div key={index} className="space-y-2">
									<h4 className="text-sm font-medium flex items-center gap-2">
										<section.icon className={`h-4 w-4 ${section.iconColor}`} />
										{section.label} Trend ({duration})
									</h4>
									<MetricChart
										data={section.data}
										title={section.label}
										color={section.color}
										unit={section.unit}
										height={150}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
