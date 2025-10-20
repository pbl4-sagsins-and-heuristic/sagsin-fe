import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TimelineHeaderProps {
    timelineCount: number;
    onRefresh: () => void;
    refreshing: boolean;
}

export function TimelineHeader({ timelineCount, onRefresh, refreshing }: TimelineHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">📊 Timelines Management</h1>
                <p className="text-muted-foreground mt-1">
                    Track file transfers across network nodes with millisecond precision
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    {timelineCount} transfer{timelineCount !== 1 ? 's' : ''} tracked
                </div>
                <Button 
                    onClick={onRefresh} 
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
        </div>
    );
}