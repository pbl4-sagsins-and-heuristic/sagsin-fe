import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface MetricChartProps {
  data: Array<{ time: string; value: number }>;
  title: string;
  color: string; // ví dụ: "var(--color-chart-1)"
  unit: string;
  height?: number;
}

export default function MetricChart({
  data,
  title,
  color,
  unit,
  height = 150,
}: MetricChartProps) {
  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color,
    },
  };

  // ✅ Tính 6 mốc thời gian chia đều theo độ dài dữ liệu
  const tickCount = 6;
  const tickInterval = Math.max(1, Math.floor(data.length / (tickCount - 1)));
  const xTicks = data
    .filter((_, index) => index % tickInterval === 0)
    .map((d) => d.time);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>

      <ChartContainer config={chartConfig} style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis
              dataKey="time"
              ticks={xTicks}
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString('en-US', {
                  hour12: false,
                  minute: '2-digit',
                  second: '2-digit',
                })
              }
            />
            <YAxis
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              formatter={(v) => [`${v}${unit}`, title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
