"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { getCombinedOrders } from "@/lib/dataFetch";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const allOrders = getCombinedOrders().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const filteredOrders = allOrders.filter(order => 
    order.order_id.toLowerCase().includes(search.toLowerCase()) ||
    (order.user?.name && order.user.name.toLowerCase().includes(search.toLowerCase())) ||
    order.status.toLowerCase().includes(search.toLowerCase()) ||
    formatDate(order.timestamp).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
      </div>

      <Card className="opacity-0 animate-fade-in-up delay-100">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <div className="mt-4">
            <Input 
              placeholder="Search by Order ID, Customer Name, or Status..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
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
