import { getOrderById } from "@/lib/dataFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { AiAdvisorCard } from "@/components/ai/AiAdvisorCard";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Order {order.order_id}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold
          ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="opacity-0 animate-fade-in-up delay-100">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <img src={item.product?.image} alt={item.product?.name} className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                          <span>{item.product?.name || item.product_id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.product?.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.product?.price || 0)}</TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-right">{formatCurrency((item.product?.price || 0) * item.qty)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-6 pt-4 border-t">
                <div className="text-right">
                  <div className="text-slate-500 text-sm mb-1">Total Amount</div>
                  <div className="text-2xl font-bold">{formatCurrency(order.total_price)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="opacity-0 animate-fade-in-up delay-200">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-500">Name</div>
                <div className="font-medium">{order.user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div className="font-medium">{order.user?.email}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Phone</div>
                <div className="font-medium">{order.user?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Role & Points</div>
                <div className="font-medium flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{order.user?.role}</span>
                  <span>{order.user?.loyalty_points} pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <AiAdvisorCard order={order} />
      </div>
    </div>
  );
}
