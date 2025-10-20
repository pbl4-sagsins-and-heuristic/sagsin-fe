import { useEffect, useState } from 'react';
import { TimelineHeader } from '@/components/timeline/timeline-header';
import { TimelineLegend } from '@/components/timeline/timeline-legend';
import { TimelineCard } from '@/components/timeline/timeline-card';
import { LoadingState } from '@/components/timeline/loading-state';
import { EmptyState } from '@/components/timeline/empty-state';

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

export default function TimelinesManagement() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTimelines = async () => {
        try {
            setRefreshing(true);
            const response = await fetch('http://localhost:3000/timeline');
            if (!response.ok) throw new Error('Failed to fetch timelines');
            const data = await response.json();
            setTimelines(data);
        } catch (error) {
            console.error('Failed to fetch timelines:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTimelines();
        const interval = setInterval(fetchTimelines, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <TimelineHeader 
                    timelineCount={0}
                    onRefresh={fetchTimelines}
                    refreshing={refreshing}
                />
                <LoadingState />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <TimelineHeader 
                timelineCount={timelines.length}
                onRefresh={fetchTimelines}
                refreshing={refreshing}
            />

            <TimelineLegend />

            {timelines.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-6">
                    {timelines.map((timeline) => (
                        <TimelineCard key={timeline._id} timeline={timeline} />
                    ))}
                </div>
            )}
        </div>
    );
}