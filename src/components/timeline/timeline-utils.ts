export function formatDurationWithMs(ms: number): string {
    const totalSeconds = ms / 1000;

    if (ms < 1000) {
        return `${ms}ms`;
    } else if (ms < 60000) {
        const seconds = Math.floor(totalSeconds);
        const remainingMs = ms % 1000;
        return `${seconds}s ${remainingMs}ms`;
    } else if (ms < 3600000) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const remainingMs = ms % 1000;
        return `${minutes}m ${seconds}s ${remainingMs}ms`;
    } else {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
}

export function formatTimestampWithMs(timestamp: string): string {
    const date = new Date(timestamp).toLocaleString().split(' ');
    return date[0] + '.' + String(new Date(timestamp).getMilliseconds()).padStart(3, '0') + ' ' + date[1]
}

export function calculateTimelineStats(timeline: any[]) {
    const sortedEntries = timeline.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sortedEntries.length < 2) {
        return {
            totalDuration: 0,
            totalDurationText: '0ms',
            averageHopDuration: 0,
            averageHopDurationText: '0ms',
            completedHops: 0,
            totalHops: sortedEntries.length
        };
    }

    const startTime = new Date(sortedEntries[0].timestamp).getTime();
    const endTime = new Date(sortedEntries[sortedEntries.length - 1].timestamp).getTime();
    const totalDuration = endTime - startTime;

    const completedHops = sortedEntries.filter(entry => entry.status === 'DONE').length;
    const hopCount = Math.max(sortedEntries.length - 1, 1);
    const averageHopDuration = totalDuration / hopCount;

    return {
        totalDuration,
        totalDurationText: formatDurationWithMs(totalDuration),
        averageHopDuration,
        averageHopDurationText: formatDurationWithMs(averageHopDuration),
        completedHops,
        totalHops: sortedEntries.length
    };
}