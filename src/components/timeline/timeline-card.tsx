import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';
import { TimelineSVG } from './timeline-svg';
import { TimelineSummary } from './timeline-summary';

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

interface TimelineCardProps {
    timeline: Timeline;
}

export function TimelineCard({ timeline }: TimelineCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Transfer ID: 
                        <span className="font-mono text-sm ml-2 text-muted-foreground">
                            {timeline._id}
                        </span>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {timeline.timeline.length} hop{timeline.timeline.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(timeline.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <TimelineSVG timeline={timeline} />
                    <TimelineSummary timeline={timeline} />
                </div>
            </CardContent>
        </Card>
    );
}