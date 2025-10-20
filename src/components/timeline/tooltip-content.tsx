import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { formatTimestampWithMs } from './timeline-utils';

interface TimelineEntry {
    hostname: string;
    timestamp: string;
    status: 'PENDING' | 'DONE';
}

interface PointTooltipContentProps {
    entry: TimelineEntry;
}

export function PointTooltipContent({ entry }: PointTooltipContentProps) {
    return (
        <div className="text-sm">
            <div className="font-semibold flex items-center gap-2">
                <MapPin size={14} />
                {entry.hostname}
            </div>
            <div className="flex items-center gap-2 mt-1">
                <Clock size={14} />
                {formatTimestampWithMs(entry.timestamp)}
            </div>
            <div className="mt-1">
                <Badge 
                    variant={entry.status === 'DONE' ? 'default' : 'secondary'}
                    className={entry.status === 'DONE' ? 'bg-green-500' : 'bg-amber-500'}
                >
                    {entry.status}
                </Badge>
            </div>
        </div>
    );
}

interface SegmentTooltipContentProps {
    fromNode: string;
    toNode: string;
    durationText: string;
}

export function SegmentTooltipContent({ fromNode, toNode, durationText }: SegmentTooltipContentProps) {
    return (
        <div className="text-sm">
            <div className="font-semibold">
                {fromNode} → {toNode}
            </div>
            <div className="text-muted-foreground">
                Duration: {durationText}
            </div>
        </div>
    );
}

