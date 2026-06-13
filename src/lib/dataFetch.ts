import usersData from '../../data/users.json';
import productsData from '../../data/products.json';
import ordersData from '../../data/ecommerce_orders.json';

export type User = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
  role: string;
};

export type Product = {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

export type OrderItem = {
  product_id: string;
  qty: number;
};

export type Order = {
  order_id: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  timestamp: string;
};

export type CombinedOrderItem = OrderItem & {
  product?: Product;
};

export type CombinedOrder = Omit<Order, 'items'> & {
  user?: User;
  items: CombinedOrderItem[];
};

export const getUsers = (): User[] => usersData as User[];
export const getProducts = (): Product[] => productsData as Product[];
export const getOrders = (): Order[] => ordersData as Order[];

export const getCombinedOrders = (): CombinedOrder[] => {
  const users = getUsers();
  const products = getProducts();
  const orders = getOrders();

  return orders.map((order) => {
    const user = users.find((u) => u.user_id === order.user_id);
    const items = order.items.map((item) => ({
      ...item,
      product: products.find((p) => p.product_id === item.product_id),
    }));

    return {
      ...order,
      user,
      items,
    };
  });
};

export const getOrderById = (id: string): CombinedOrder | undefined => {
  const orders = getCombinedOrders();
  return orders.find((o) => o.order_id === id);
};

export const getDashboardStats = () => {
  const orders = getCombinedOrders();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalOrders = orders.length;
  
  // Delivered only revenue
  const deliveredRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.total_price, 0);
    
  return {
    totalRevenue,
    totalOrders,
    deliveredRevenue,
  };
};

export const getSalesByCategory = () => {
  const orders = getCombinedOrders();
  const categorySales: Record<string, number> = {};

  orders.forEach((order) => {
    if (order.status !== 'CANCELLED') {
      order.items.forEach((item) => {
        const category = item.product?.category || 'Unknown';
        const itemTotal = (item.product?.price || 0) * item.qty;
        
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += itemTotal;
      });
    }
  });

  return Object.keys(categorySales).map((name) => ({
    name,
    value: categorySales[name],
  }));
};
