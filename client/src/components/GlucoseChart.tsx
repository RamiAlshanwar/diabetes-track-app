import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Reading = {
  id: string;
  value: number;
  status: string;
  readingTime: string;
  note?: string;
};

type GlucoseChartProps = {
  readings: Reading[];
  loading: boolean;
  error: boolean;
};

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const GlucoseChart = ({ readings, loading, error }: GlucoseChartProps) => {
  if (loading) {
    return <p className="dashboard-chart-state">Loading chart...</p>;
  }

  if (error) {
    return <p className="dashboard-chart-state">Could not load chart data</p>;
  }

  if (readings.length === 0) {
    return <p className="dashboard-chart-state">No readings yet</p>;
  }

  const chartData = [...readings]
    .slice()
    .reverse()
    .map((reading) => ({
      id: reading.id,
      value: reading.value,
      status: reading.status,
      readingTime: reading.readingTime,
      shortDate: formatShortDate(reading.readingTime),
    }));

  return (
    <div className="dashboard-chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="shortDate"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
            tickFormatter={(value: number) => `${value}`}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "10px",
              color: "#f9fafb",
            }}
            formatter={(value: number) => [`${value.toFixed(1)} mmol/L`, "Glucose"]}
            labelFormatter={(
              _label: string,
              payload: Array<{ payload?: { readingTime?: string } }>,
            ) => {
              const item = payload?.[0]?.payload;
              return item?.readingTime ? formatFullDate(item.readingTime) : "";
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ fill: "#93c5fd", r: 4 }}
            activeDot={{ r: 6, fill: "#bfdbfe" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlucoseChart;
