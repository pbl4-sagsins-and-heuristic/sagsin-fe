import { Card } from '@/components/ui/card';

interface EmptyStateProps {
    // No specific props needed for now
}

export function EmptyState({}: EmptyStateProps) {
    return (
        <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">No Transfers Found</h3>
            <p className="text-muted-foreground">
                Start a file transfer to see the timeline visualization here.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
                All transfer durations will be shown with millisecond precision.
            </p>
        </Card>
    );
}