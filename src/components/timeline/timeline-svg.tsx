import { useState } from 'react';
import { PointTooltipContent, SegmentTooltipContent } from './tooltip-content';
import { TimelineTooltip } from './timeline-tooltip';
import { formatDurationWithMs } from './timeline-utils';

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

interface TimelineSVGProps {
    timeline: Timeline;
}

interface TooltipData {
    x: number;
    y: number;
    content: React.ReactNode;
    visible: boolean;
}

export function TimelineSVG({ timeline }: TimelineSVGProps) {
    const [tooltip, setTooltip] = useState<TooltipData>({
        x: 0,
        y: 0,
        content: null,
        visible: false
    });

    const entries = timeline.timeline.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (entries.length === 0) return null;

    const svgWidth = 800;
    const svgHeight = 120;
    const lineY = 60;
    const padding = 80;
    const lineWidth = svgWidth - padding * 2;

    // Calculate positions
    const positions = entries.map((entry, index) => {
        const x = padding + (index / Math.max(entries.length - 1, 1)) * lineWidth;
        return { x, entry, index };
    });

    // Calculate segments for hover with improved precision
    const segments = positions.slice(0, -1).map((pos, index) => {
        const nextPos = positions[index + 1];
        const startTime = new Date(pos.entry.timestamp);
        const endTime = new Date(nextPos.entry.timestamp);
        const duration = endTime.getTime() - startTime.getTime();
        
        return {
            x1: pos.x,
            x2: nextPos.x,
            fromNode: pos.entry.hostname,
            toNode: nextPos.entry.hostname,
            duration: duration,
            durationText: formatDurationWithMs(duration)
        };
    });

    const showTooltip = (x: number, y: number, content: React.ReactNode) => {
        setTooltip({ x, y, content, visible: true });
    };

    const hideTooltip = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className="relative">
            <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
                {/* Main timeline line */}
                <line
                    x1={padding}
                    y1={lineY}
                    x2={svgWidth - padding}
                    y2={lineY}
                    stroke="#e2e8f0"
                    strokeWidth="2"
                />

                {/* Hover segments */}
                {segments.map((segment, index) => (
                    <line
                        key={`segment-${index}`}
                        x1={segment.x1}
                        y1={lineY}
                        x2={segment.x2}
                        y2={lineY}
                        stroke="transparent"
                        strokeWidth="8"
                        className="cursor-pointer"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            showTooltip(
                                e.clientX - rect.left + rect.left,
                                e.clientY - rect.top + rect.top - 10,
                                <SegmentTooltipContent 
                                    fromNode={segment.fromNode}
                                    toNode={segment.toNode}
                                    durationText={segment.durationText}
                                />
                            );
                        }}
                        onMouseLeave={hideTooltip}
                    />
                ))}

                {/* Timeline points */}
                {positions.map(({ x, entry, index }) => (
                    <g key={index}>
                        {/* Point circle */}
                        <circle
                            cx={x}
                            cy={lineY}
                            r="8"
                            fill={entry.status === 'DONE' ? '#22c55e' : '#f59e0b'}
                            stroke="white"
                            strokeWidth="2"
                            className="cursor-pointer drop-shadow-sm"
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                showTooltip(
                                    e.clientX - rect.left + rect.left,
                                    e.clientY - rect.top + rect.top - 10,
                                    <PointTooltipContent entry={entry} />
                                );
                            }}
                            onMouseLeave={hideTooltip}
                        />
                        
                        {/* Hostname label */}
                        <text
                            x={x}
                            y={lineY + 25}
                            textAnchor="middle"
                            className="fill-gray-600 text-xs font-medium"
                        >
                            {entry.hostname.length > 12 
                                ? entry.hostname.substring(0, 10) + '...' 
                                : entry.hostname
                            }
                        </text>
                    </g>
                ))}

                {/* Start and end labels */}
                <text x={padding - 20} y={lineY + 5} textAnchor="end" className="fill-gray-400 text-xs">
                    Start
                </text>
                <text x={svgWidth - padding + 20} y={lineY + 5} textAnchor="start" className="fill-gray-400 text-xs">
                    End
                </text>
            </svg>

            <TimelineTooltip tooltip={tooltip} />
        </div>
    );
}