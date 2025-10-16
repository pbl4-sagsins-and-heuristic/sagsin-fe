import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TimelineData = {
  i: number;
  metric: number;
  label: string;
};

type TimelineChartProps = {
  data: TimelineData[];
};

export default function TimelineChart({ data }: TimelineChartProps) {
  return (
    <div className="border rounded p-3">
      <h2 className="font-semibold mb-2">Timeline</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="i" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="metric" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
