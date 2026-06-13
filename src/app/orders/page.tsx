"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { getCombinedOrders } from "@/lib/dataFetch";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allOrders, setAllOrders] = useState(() => getCombinedOrders().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

  const STATUS_OPTIONS = [
    { value: "ALL", label: "All Statuses" },
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  useEffect(() => {
    const liveOrdersStr = localStorage.getItem('live_orders');
    if (liveOrdersStr) {
      const liveOrders = JSON.parse(liveOrdersStr);
      setAllOrders(prev => {
        const combined = [...liveOrders, ...getCombinedOrders()];
        const unique = Array.from(new Map(combined.map(item => [item.order_id, item])).values());
        return unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    }
  }, []);
  
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(search.toLowerCase())) ||
      order.status.toLowerCase().includes(search.toLowerCase()) ||
      formatDate(order.timestamp).toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
      </div>

      <Card className="opacity-0 animate-fade-in-up delay-100">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Search by Order ID, Customer Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-[160px] h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none hover:border-blue-400 hover:bg-slate-50 transition-all text-slate-700 shadow-sm"
              >
                <span>{STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-12 left-0 w-[160px] bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-700 flex items-center justify-between transition-colors"
                      >
                        <span className={statusFilter === opt.value ? "font-medium text-blue-600" : ""}>{opt.label}</span>
                        {statusFilter === opt.value && <Check size={14} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">
                    <Link href={`/orders/${order.order_id}`} className="text-blue-600 hover:underline">
                      {order.order_id}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(order.timestamp)}</TableCell>
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
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                    No orders found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
