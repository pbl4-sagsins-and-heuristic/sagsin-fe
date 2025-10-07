import { useMemo } from 'react';

interface MetricDataPoint {
    time: string;
    value: number;
}

interface LinkMetrics {
    delay_ms?: number;
    jitter_ms?: number;
    bandwidth_mbps?: number;
    queue_length?: number;
}

export const useMetricsTrends = (currentMetrics: LinkMetrics, updatedAt?: string) => {
    const generateTrendData = useMemo(() => {
        // Use updatedAt as the latest point, or current time if not provided
        const latestTime = updatedAt ? new Date(updatedAt) : new Date();
        const points: MetricDataPoint[] = [];

        // Generate 24 data points (last 2 minutes, every 5 seconds)
        for (let i = 23; i >= 0; i--) {
            const time = new Date(latestTime.getTime() - i * 5 * 1000); // 5 seconds intervals
            points.push({
                time: time.toLocaleTimeString('en-US', {
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
                value: 0 // Will be set by each metric
            });
        }

        return points;
    }, [updatedAt]);

    const delayTrend = useMemo(() => {
        const currentDelay = currentMetrics.delay_ms || 50;
        return generateTrendData.map((point, index) => {
            // For the last point (index 23), use the exact current value
            if (index === 23) {
                return {
                    ...point,
                    value: currentDelay
                };
            }
            // For other points, add realistic variation around the current value
            const variation = (Math.random() - 0.5) * currentDelay * 0.3 +
                Math.sin((index - 23) * 0.3) * currentDelay * 0.1;
            return {
                ...point,
                value: Number((currentDelay + variation).toFixed(3))
            };
        });
    }, [currentMetrics.delay_ms, generateTrendData]);

    const jitterTrend = useMemo(() => {
        const currentJitter = currentMetrics.jitter_ms || 5;
        return generateTrendData.map((point, index) => {
            // For the last point, use the exact current value
            if (index === 23) {
                return {
                    ...point,
                    value: currentJitter
                };
            }
            // For other points, add spiky variations
            const variation = (Math.random() - 0.5) * currentJitter * 0.6 +
                Math.cos((index - 23) * 0.5) * currentJitter * 0.2;
            return {
                ...point,
                value: Number((currentJitter + variation).toFixed(3))
            };
        });
    }, [currentMetrics.jitter_ms, generateTrendData]);

    const bandwidthTrend = useMemo(() => {
        const currentBandwidth = currentMetrics.bandwidth_mbps || 100;
        return generateTrendData.map((point, index) => {
            // For the last point, use the exact current value
            if (index === 23) {
                return {
                    ...point,
                    value: currentBandwidth
                };
            }
            // For other points, add stable variations
            const variation = (Math.random() - 0.5) * currentBandwidth * 0.1 +
                Math.sin((index - 23) * 0.2) * currentBandwidth * 0.05;
            return {
                ...point,
                value: Number((currentBandwidth + variation).toFixed(2))
            };
        });
    }, [currentMetrics.bandwidth_mbps, generateTrendData]);

    const queueTrend = useMemo(() => {
        const currentQueue = currentMetrics.queue_length || 10;
        return generateTrendData.map((point, index) => {
            // For the last point, use the exact current value
            if (index === 23) {
                return {
                    ...point,
                    value: currentQueue
                };
            }
            // For other points, add bursty variations
            const variation = (Math.random() - 0.5) * currentQueue * 0.8 +
                Math.sin((index - 23) * 0.4) * currentQueue * 0.3;
            return {
                ...point,
                value: Math.max(0, Math.round(currentQueue + variation))
            };
        });
    }, [currentMetrics.queue_length, generateTrendData]);

    return {
        delayTrend,
        jitterTrend,
        bandwidthTrend,
        queueTrend
    };
};