import { Card, CardContent } from '@/components/ui/card';

interface TimelineLegendProps {
    // No specific props needed for now
}

export function TimelineLegend({}: TimelineLegendProps) {
    return (
        <Card>
            <CardContent className="pt-4">
                <div className="flex items-center justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500" />
                        <span>Pending Transfer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <span>Completed Transfer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-0.5 h-4 bg-gray-300" />
                        <span>Transfer Path (hover for duration)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}