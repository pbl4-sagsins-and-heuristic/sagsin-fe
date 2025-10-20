import React from 'react';

interface TooltipData {
    x: number;
    y: number;
    content: React.ReactNode;
    visible: boolean;
}

interface TimelineTooltipProps {
    tooltip: TooltipData;
}

export function TimelineTooltip({ tooltip }: TimelineTooltipProps) {
    if (!tooltip.visible) return null;

    return (
        <div
            className="fixed z-50 bg-popover border rounded-lg shadow-md p-3 pointer-events-none"
            style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)'
            }}
        >
            {tooltip.content}
        </div>
    );
}