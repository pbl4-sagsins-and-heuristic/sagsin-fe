import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { calculateTimelineStats, formatTimestampWithMs } from './timeline-utils';

interface TimelineEntry {
    hostname: string;
    timestamp: string;
    status: 'PENDING' | 'DONE';
}

interface Timeline {
    _id: string;
    timeline: TimelineEntry[];
    createdAt: string;
    updatedAt: string;
}

interface TimelineSummaryProps {
    timeline: Timeline;
}

export function TimelineSummary({ timeline }: TimelineSummaryProps) {
    const stats = calculateTimelineStats(timeline.timeline);

    return (
        <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        Started:
                    </span>
                    <div className="font-medium">
                        {formatTimestampWithMs(timeline.createdAt)}
                    </div>
                </div>
                <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        Last Update:
                    </span>
                    <div className="font-medium">
                        {formatTimestampWithMs(timeline.updatedAt)}
                    </div>
                </div>
                <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp size={12} />
                        Total Duration:
                    </span>
                    <div className="font-medium font-mono">
                        {stats.totalDurationText}
                    </div>
                </div>
                <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div>
                        <Badge 
                            variant={
                                timeline.timeline.some(t => t.status === 'DONE') 
                                    ? 'default' 
                                    : 'secondary'
                            }
                            className={
                                timeline.timeline.some(t => t.status === 'DONE')
                                    ? 'bg-green-500'
                                    : 'bg-amber-500'
                            }
                        >
                            {timeline.timeline.some(t => t.status == 'DONE') 
                                ? 'Completed' 
                                : 'In Progress'
                            }
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}