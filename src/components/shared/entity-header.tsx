import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EntityHeaderProps {
	icon: LucideIcon;
	iconColor?: string;
	title: string;
	titlePrefix?: React.ReactNode;
	status: string;
	statusVariant: 'default' | 'destructive';
	id: string;
}

export default function EntityHeader({
	icon: Icon,
	iconColor = 'text-blue-500',
	title,
	titlePrefix,
	status,
	statusVariant,
	id,
}: EntityHeaderProps) {
	return (
		<CardHeader className="pb-3">
			<div className="flex items-center justify-between">
				<CardTitle className="text-lg font-bold flex items-center gap-2">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					{titlePrefix}
					{title}
				</CardTitle>
				<Badge variant={statusVariant} className="flex items-center gap-1">
					<Activity className="h-3 w-3" />
					{status}
				</Badge>
			</div>
			<div className="text-xs text-muted-foreground font-mono">
				ID: {id}
			</div>
		</CardHeader>
	);
}
