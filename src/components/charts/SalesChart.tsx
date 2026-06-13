"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type ChartData = {
  name: string;
  value: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  const total = payload.reduce((acc: number, entry: any) => acc + entry.payload.value, 0);

  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
      {payload.map((entry: any, index: number) => {
        const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(0) : 0;
        return (
          <li key={`item-${index}`} className="flex items-center font-medium" style={{ color: entry.color }}>
            {percent}% {entry.value}
          </li>
        );
      })}
    </ul>
  );
};

export function SalesChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(Number(value))}
          />
          <Legend content={renderCustomLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
