import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
	icon: LucideIcon;
	iconColor: string;
	label: string;
	value: string | React.ReactNode;
}

export default function MetricCard({ icon: Icon, iconColor, label, value }: MetricCardProps) {
	return (
		<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
			<Icon className={`h-4 w-4 ${iconColor}`} />
			<div>
				<div className="text-xs text-muted-foreground">{label}</div>
				<div className="font-mono text-sm font-medium">
					{value}
				</div>
			</div>
		</div>
	);
}
