import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService, orderService } from '../services/api';
import {
  StatCard,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  LoadingSkeleton,
  EmptyState,
} from '../components/common/UIComponents';

export function DashboardPage({ onNavigate }) {
  const { vendor, isApproved } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, orderRes] = await Promise.all([
          productService.getMyProducts().catch(() => ({ data: [] })),
          orderService.getMyOrders().catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setProducts(prodRes.data || []);
          setOrders(orderRes.data || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute actual metrics from live backend data
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'active' && p.isApproved).length;
  const pendingApprovalProducts = products.filter((p) => !p.isApproved).length;
  const lowStockCount = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['placed', 'processing'].includes(o.vendorFulfilmentStatus || o.status)
  ).length;

  const deliveredOrders = orders.filter((o) =>
    (o.vendorFulfilmentStatus || o.status) === 'delivered'
  ).length;

  // Real Gross Revenue for this vendor's items
  const totalEarnings = orders
    .filter((o) => o.status !== 'cancelled' && (o.vendorFulfilmentStatus || '') !== 'cancelled')
    .reduce((sum, o) => sum + (o.vendorSubtotal || 0), 0);

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#174C3C] to-[#0f3429] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-[#0f3429]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D5B779]/20 text-[#D5B779] border border-[#D5B779]/30 mb-3">
              <span>✦</span>
              <span>MarketNest Vendor Studio</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              Welcome back, {vendor?.name || 'Seller'}!
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Here&apos;s a live overview of your catalog, order fulfilment pipeline, and store performance on MarketNest.
            </p>

            {!isApproved && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#D5B779] shrink-0" />
                <p className="text-xs text-amber-200">
                  Your vendor store is currently awaiting administrator verification. Once approved, your products will be visible to all customers on the marketplace.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <PrimaryButton
              icon={PlusCircle}
              onClick={() => onNavigate('add-product')}
              className="bg-[#D5B779] text-[#174C3C] hover:bg-[#ecdcb9] border-[#D5B779] font-bold shadow-md"
            >
              Add New Product
            </PrimaryButton>
            <SecondaryButton
              onClick={() => onNavigate('inventory')}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20 shadow-none"
            >
              Check Stock
            </SecondaryButton>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D5B779]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description={`${activeProducts} live on store • ${pendingApprovalProducts} pending`}
          accent="emerald"
        />
        <StatCard
          title="Orders for Fulfilment"
          value={totalOrders}
          icon={ShoppingBag}
          description={`${pendingOrders} awaiting shipment`}
          accent="gold"
        />
        <StatCard
          title="Pending Action"
          value={pendingOrders}
          icon={Clock}
          description={`${deliveredOrders} completed orders`}
          accent="emerald"
        />
        <StatCard
          title="Gross Sales"
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          description="Calculated from real order items"
          accent="gold"
        />
      </div>

      {/* Low Stock Warning Banner if any */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-[#A66B12] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202824]">
                Inventory Attention Required
              </h4>
              <p className="text-xs text-[#68736C]">
                You have {lowStockCount} item(s) running low on stock and {outOfStockCount} out of stock. Update your inventory to avoid order cancellations.
              </p>
            </div>
          </div>
          <PrimaryButton
            onClick={() => onNavigate('inventory')}
            className="text-xs py-2 whitespace-nowrap"
          >
            Manage Stock
          </PrimaryButton>
        </div>
      )}

      {/* Two Column Section: Recent Orders & Quick Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#202824]">
                Recent Orders
              </h3>
              <p className="text-xs text-[#68736C]">
                Recent purchases containing items from your store
              </p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#174C3C] hover:text-[#0f3429] flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-[#68736C]">
                No customer orders received yet. When a customer purchases your items, orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E0D2] text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                    <th className="pb-3 pl-1">Order #</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Subtotal</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E0D2]/50 text-xs text-[#202824]">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#F8F5EC]/60 transition">
                      <td className="py-3 pl-1 font-semibold text-[#174C3C]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-[#68736C]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3">
                        {order.shippingAddress?.name || 'Customer'}
                      </td>
                      <td className="py-3 text-[#68736C]">
                        {order.vendorItems ? order.vendorItems.length : order.items?.length || 0} item(s)
                      </td>
                      <td className="py-3 font-semibold">
                        ₹{(order.vendorSubtotal || order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={order.vendorFulfilmentStatus || order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top/Active Products Card (1 col) */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-heading text-lg font-bold text-[#202824]">
                  My Catalog
                </h3>
                <p className="text-xs text-[#68736C]">
                  Quick inventory snapshot
                </p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs font-semibold text-[#174C3C] hover:text-[#0f3429] flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {products.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[#68736C] mb-4">
                  You haven&apos;t added any products yet.
                </p>
                <PrimaryButton
                  icon={PlusCircle}
                  onClick={() => onNavigate('add-product')}
                  className="w-full text-xs"
                >
                  Create First Product
                </PrimaryButton>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 4).map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E6E0D2]/70 hover:border-[#D5B779] transition"
                  >
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                      alt={prod.name}
                      className="w-11 h-11 rounded-lg object-cover bg-[#F8F5EC] border border-[#E6E0D2]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#202824] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-[#68736C]">
                        ₹{(prod.price || 0).toLocaleString('en-IN')} • Stock: {prod.stock || 0}
                      </p>
                    </div>
                    <StatusBadge status={prod.isApproved ? prod.status : 'pending'} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#E6E0D2] flex justify-between items-center text-xs text-[#68736C]">
            <span>Total Catalog Value</span>
            <span className="font-bold text-[#174C3C] text-sm">
              ₹
              {products
                .reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0)
                .toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
