"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ---------- Static demo data ---------- */

const ordersOverTime = [
  { day: "Mon", orders: 4 },
  { day: "Tue", orders: 6 },
  { day: "Wed", orders: 5 },
  { day: "Thu", orders: 9 },
  { day: "Fri", orders: 12 },
  { day: "Sat", orders: 16 },
  { day: "Sun", orders: 11 },
];

const itemsByCategory = [
  { category: "Classic", items: 4 },
  { category: "Veggie", items: 2 },
  { category: "Meat", items: 3 },
  { category: "Gourmet", items: 2 },
  { category: "Sides", items: 1 },
  { category: "Drinks", items: 0 },
];

const ordersConfig = {
  orders: {
    label: "Orders",
    color: "#E53935",
  },
} satisfies ChartConfig;

const categoryConfig = {
  items: {
    label: "Items",
    color: "#FF8A00",
  },
} satisfies ChartConfig;

/* ---------- Charts ---------- */

/** Weekly orders area chart for the vendor overview. */
export const OrdersAreaChart = () => (
  <ChartContainer config={ordersConfig} className="aspect-auto h-[260px] w-full">
    <AreaChart data={ordersOverTime} margin={{ left: -18, right: 8, top: 8 }}>
      <defs>
        <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.35} />
          <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="day"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tick={{ fontSize: 12 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fontSize: 12 }}
        allowDecimals={false}
      />
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <Area
        dataKey="orders"
        type="monotone"
        fill="url(#fillOrders)"
        stroke="var(--color-orders)"
        strokeWidth={2.5}
      />
    </AreaChart>
  </ChartContainer>
);

/** Menu items per category bar chart for the vendor overview. */
export const CategoryBarChart = () => (
  <ChartContainer config={categoryConfig} className="aspect-auto h-[260px] w-full">
    <BarChart data={itemsByCategory} margin={{ left: -18, right: 8, top: 8 }}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey="category"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tick={{ fontSize: 12 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fontSize: 12 }}
        allowDecimals={false}
      />
      <ChartTooltip cursor={{ fill: "var(--color-muted)" }} content={<ChartTooltipContent />} />
      <Bar
        dataKey="items"
        fill="var(--color-items)"
        radius={[6, 6, 0, 0]}
        barSize={28}
      />
    </BarChart>
  </ChartContainer>
);
