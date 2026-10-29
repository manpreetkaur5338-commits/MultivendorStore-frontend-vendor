import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  Percent,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { orderService } from '../services/api';
import { StatCard, LoadingSkeleton, EmptyState } from '../components/common/UIComponents';

export function SalesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.warn('Orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Compute real metrics
  const activeOrders = orders.filter(
    (o) => o.status !== 'cancelled' && (o.vendorFulfilmentStatus || '') !== 'cancelled'
  );

  const grossSales = activeOrders.reduce(
    (sum, o) => sum + (o.vendorSubtotal || 0),
    0
  );

  // Standard marketplace commission rule (10% platform fee)
  const marketplaceFeeRate = 0.10;
  const platformFee = Math.round(grossSales * marketplaceFeeRate);
  const netSellerEarnings = grossSales - platformFee;

  const deliveredOrders = activeOrders.filter(
    (o) => (o.vendorFulfilmentStatus || o.status) === 'delivered'
  );
  const completedEarnings = deliveredOrders.reduce(
    (sum, o) => sum + Math.round((o.vendorSubtotal || 0) * (1 - marketplaceFeeRate)),
    0
  );

  const pendingSettlement = netSellerEarnings - completedEarnings;

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
          Sales & Earnings
        </h2>
        <p className="text-xs sm:text-sm text-[#68736C]">
          Track gross sales volume, platform commissions, and verified seller net payouts.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Gross Order Value"
          value={`₹${grossSales.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          description="Total value of vendor items purchased"
          accent="gold"
        />
        <StatCard
          title="Platform Commission (10%)"
          value={`₹${platformFee.toLocaleString('en-IN')}`}
          icon={Percent}
          description="Standard marketplace operational fee"
          accent="emerald"
        />
        <StatCard
          title="Net Seller Earnings"
          value={`₹${netSellerEarnings.toLocaleString('en-IN')}`}
          icon={DollarSign}
          description="Total accrued revenue after commission"
          accent="gold"
        />
        <StatCard
          title="Settled Payouts"
          value={`₹${completedEarnings.toLocaleString('en-IN')}`}
          icon={CheckCircle2}
          description={`₹${pendingSettlement.toLocaleString('en-IN')} pending delivery`}
          accent="emerald"
        />
      </div>

      {/* Payout & Settlement Information Notice */}
      <div className="p-5 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[#E8EFE8] text-[#174C3C] shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#202824]">
            MarketNest Settlement Protocol
          </h4>
          <p className="text-xs text-[#68736C] leading-relaxed">
            Earnings for fulfilled orders become eligible for direct deposit 7 days following customer delivery confirmation. Payouts are transferred automatically to your registered vendor bank account every Monday.
          </p>
        </div>
      </div>

      {/* Transaction / Order Breakup Table */}
      <div className="bg-white rounded-2xl border border-[#E6E0D2] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E6E0D2]">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824]">
            Order Earnings Breakdown
          </h3>
          <p className="text-xs text-[#68736C]">
            Live breakdown calculated directly from individual customer shipments
          </p>
        </div>

        {activeOrders.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#68736C]">
            No sales recorded yet. Once customers purchase your items, real settlement data will be displayed here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Item Amount</th>
                  <th className="py-3 px-4">Commission (10%)</th>
                  <th className="py-3 px-4">Your Net Share</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D2]/60 text-xs text-[#202824]">
                {activeOrders.map((o) => {
                  const val = o.vendorSubtotal || 0;
                  const fee = Math.round(val * 0.1);
                  const net = val - fee;
                  const isDelivered = (o.vendorFulfilmentStatus || o.status) === 'delivered';

                  return (
                    <tr key={o._id} className="hover:bg-[#F8F5EC]/40 transition">
                      <td className="py-3.5 px-4 font-bold text-[#174C3C]">
                        {o.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#68736C]">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        ₹{val.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-[#C0392B]">
                        - ₹{fee.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#26734D]">
                        ₹{net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            isDelivered
                              ? 'bg-emerald-50 text-[#26734D]'
                              : 'bg-amber-50 text-[#A66B12]'
                          }`}
                        >
                          {isDelivered ? 'Settlement Ready' : 'In Transit'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
