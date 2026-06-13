"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getDashboardStats, getSalesByCategory, getCombinedOrders, CombinedOrder } from "@/lib/dataFetch";
import { formatCurrency, formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";

const SalesChart = dynamic(() => import("@/components/charts/SalesChart").then(mod => mod.SalesChart), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-slate-400">Loading chart...</div> });
import { Package, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { LiveSimulation, SIMULATION_EVENT } from "@/components/dashboard/LiveSimulation";

export default function DashboardPage() {
  const [stats, setStats] = useState(getDashboardStats());
  const [salesData, setSalesData] = useState(getSalesByCategory());
  const [recentOrders, setRecentOrders] = useState(() => 
    getCombinedOrders().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
  );

  useEffect(() => {
    // Load live orders on mount
    const liveOrdersStr = localStorage.getItem('live_orders');
    if (liveOrdersStr) {
      const liveOrders = JSON.parse(liveOrdersStr);
      
      const baseStats = getDashboardStats();
      let totalRev = baseStats.totalRevenue;
      let totalOrd = baseStats.totalOrders;
      let delRev = baseStats.deliveredRevenue;
      
      const baseSales = getSalesByCategory();
      let newSalesData = [...baseSales.map(item => ({...item}))]; // Deep copy

      liveOrders.forEach((o: any) => {
        totalRev += o.total_price;
        totalOrd += 1;
        if (o.status === 'DELIVERED') delRev += o.total_price;

        const category = o.items[0]?.product?.category || "Unknown";
        const existing = newSalesData.find(d => d.name === category);
        if (existing) existing.value += o.total_price;
        else newSalesData.push({ name: category, value: o.total_price });
      });

      setStats({ ...baseStats, totalRevenue: totalRev, totalOrders: totalOrd, deliveredRevenue: delRev });
      setSalesData(newSalesData);

      const combinedOrders = [...liveOrders, ...getCombinedOrders()];
      const unique = Array.from(new Map(combinedOrders.map(item => [item.order_id, item])).values());
      setRecentOrders(unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5));
    }
    const handleNewOrder = (e: Event) => {
      const customEvent = e as CustomEvent<CombinedOrder>;
      const newOrder = customEvent.detail;
      
      // Save to localStorage
      const liveOrders = JSON.parse(localStorage.getItem('live_orders') || '[]');
      localStorage.setItem('live_orders', JSON.stringify([newOrder, ...liveOrders]));

      // Update Stats
      setStats(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + newOrder.total_price,
        totalOrders: prev.totalOrders + 1,
        deliveredRevenue: newOrder.status === 'DELIVERED' ? prev.deliveredRevenue + newOrder.total_price : prev.deliveredRevenue
      }));

      // Update Recent Orders table
      setRecentOrders(prev => [newOrder, ...prev].slice(0, 5));
      
      // Update Sales Data Chart
      setSalesData(prev => {
        const category = newOrder.items[0]?.product?.category || "Unknown";
        const categoryExists = prev.some(d => d.name === category);
        
        if (categoryExists) {
          return prev.map(d => 
            d.name === category 
              ? { ...d, value: d.value + newOrder.total_price } 
              : d
          );
        } else {
          return [...prev, { name: category, value: newOrder.total_price }];
        }
      });
    };

    const handleClear = () => {
      setStats(getDashboardStats());
      setSalesData(getSalesByCategory());
      setRecentOrders(getCombinedOrders().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5));
    };

    window.addEventListener(SIMULATION_EVENT, handleNewOrder);
    window.addEventListener("clear_mock_orders", handleClear);
    return () => {
      window.removeEventListener(SIMULATION_EVENT, handleNewOrder);
      window.removeEventListener("clear_mock_orders", handleClear);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <LiveSimulation />
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="opacity-0 animate-fade-in-up delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-slate-400">
              Includes all orders
            </p>
          </CardContent>
        </Card>
        
        <Card className="opacity-0 animate-fade-in-up delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-500 mb-1">{stats.totalOrders}</div>
            <p className="text-xs text-slate-400">
              Across all time
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-0 animate-fade-in-up delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Delivered Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-1">{formatCurrency(stats.deliveredRevenue)}</div>
            <p className="text-xs text-slate-400">
              Only successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesData} />
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/orders">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">
                      <Link href={`/orders/${order.order_id}`} className="text-blue-600 hover:underline">
                        {order.order_id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.user?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total_price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
