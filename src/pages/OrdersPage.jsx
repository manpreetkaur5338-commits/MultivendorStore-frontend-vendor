import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Truck,
  Clock,
  MapPin,
  Phone,
  User,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';
import { orderService } from '../services/api';
import {
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  LoadingSkeleton,
  EmptyState,
} from '../components/common/UIComponents';

export function OrdersPage({ statusFilter = 'all' }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await orderService.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch vendor orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`);
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          vendorFulfilmentStatus: newStatus,
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders by tab status and search keyword
  const filteredOrders = orders.filter((o) => {
    const currentStatus = o.vendorFulfilmentStatus || o.status;

    let matchesTab = true;
    if (statusFilter === 'pending') {
      matchesTab = ['placed', 'processing'].includes(currentStatus);
    } else if (statusFilter === 'shipped') {
      matchesTab = currentStatus === 'shipped';
    } else if (statusFilter === 'delivered') {
      matchesTab = currentStatus === 'delivered';
    }

    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.shippingAddress?.name &&
        o.shippingAddress.name.toLowerCase().includes(search.toLowerCase())) ||
      (o.shippingAddress?.city &&
        o.shippingAddress.city.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#174C3C] text-white px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl border border-[#D5B779] animate-in fade-in slide-in-from-bottom duration-300">
          <span className="text-[#D5B779]">✦</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
          {statusFilter === 'pending'
            ? 'Pending Orders'
            : statusFilter === 'shipped'
            ? 'Shipped Shipments'
            : statusFilter === 'delivered'
            ? 'Delivered Orders'
            : 'Store Orders'}
        </h2>
        <p className="text-xs sm:text-sm text-[#68736C]">
          Manage and fulfil customer orders containing products from your store.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E6E0D2] p-4 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#68736C]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, customer name, or destination city..."
          className="w-full bg-transparent text-xs sm:text-sm text-[#202824] focus:outline-hidden"
        />
      </div>

      {/* Main Order List */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={
            statusFilter !== 'all'
              ? `There are currently no orders with "${statusFilter}" status.`
              : 'You have not received any orders containing your products yet.'
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer & City</th>
                  <th className="py-3.5 px-4">Vendor Items</th>
                  <th className="py-3.5 px-4">Your Revenue</th>
                  <th className="py-3.5 px-4">Fulfilment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D2]/60 text-xs text-[#202824]">
                {filteredOrders.map((order) => {
                  const currentStatus = order.vendorFulfilmentStatus || order.status;
                  const myItems = order.vendorItems || order.items || [];

                  return (
                    <tr key={order._id} className="hover:bg-[#F8F5EC]/40 transition">
                      <td className="py-3.5 px-4 font-bold text-[#174C3C]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#68736C]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#202824]">
                          {order.shippingAddress?.name}
                        </p>
                        <p className="text-[11px] text-[#68736C]">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {myItems.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                              alt={item.title}
                              title={`${item.title} (Qty: ${item.quantity})`}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-[#F8F5EC]"
                            />
                          ))}
                          {myItems.length > 3 && (
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8EFE8] text-[10px] font-bold text-[#174C3C] ring-2 ring-white">
                              +{myItems.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm text-[#202824]">
                        ₹{(order.vendorSubtotal || order.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={currentStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <SecondaryButton
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Details
                          </SecondaryButton>

                          {/* Quick Workflow Transitions */}
                          {currentStatus === 'placed' && (
                            <PrimaryButton
                              onClick={() => handleUpdateStatus(order._id, 'processing')}
                              loading={updatingOrderId === order._id}
                              className="px-2.5 py-1.5 text-xs"
                            >
                              Process
                            </PrimaryButton>
                          )}
                          {currentStatus === 'processing' && (
                            <PrimaryButton
                              onClick={() => handleUpdateStatus(order._id, 'shipped')}
                              loading={updatingOrderId === order._id}
                              className="px-2.5 py-1.5 text-xs bg-[#D5B779] text-[#174C3C] border-[#D5B779]"
                            >
                              Dispatch
                            </PrimaryButton>
                          )}
                          {currentStatus === 'shipped' && (
                            <PrimaryButton
                              onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              loading={updatingOrderId === order._id}
                              className="px-2.5 py-1.5 text-xs bg-[#26734D] border-[#26734D]"
                            >
                              Delivered
                            </PrimaryButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Slide-in Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202824]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E6E0D2] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E0D2] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#D5B779]">
                  Order Details
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#202824]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#68736C] hover:text-[#202824] rounded-lg hover:bg-[#E8EFE8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fulfilment Status Stepper */}
            <div className="p-4 bg-[#F8F5EC] rounded-2xl border border-[#E6E0D2] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#68736C]">Current Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.vendorFulfilmentStatus || selectedOrder.status} />
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.vendorFulfilmentStatus || selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  disabled={updatingOrderId === selectedOrder._id}
                  className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#E6E0D2] text-[#202824] focus:outline-hidden"
                >
                  <option value="placed">Placed (New)</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Customer Shipping Info */}
            <div className="bg-white rounded-2xl border border-[#E6E0D2] p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                Customer Shipping Destination
              </h4>
              <p className="text-sm font-semibold text-[#202824]">
                {selectedOrder.shippingAddress?.name}
              </p>
              <p className="text-xs text-[#68736C]">
                {selectedOrder.shippingAddress?.line1}
                {selectedOrder.shippingAddress?.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ''}
              </p>
              <p className="text-xs text-[#68736C]">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
              {selectedOrder.shippingAddress?.phone && (
                <p className="text-xs text-[#202824] font-medium pt-1">
                  📞 Contact: {selectedOrder.shippingAddress.phone}
                </p>
              )}
            </div>

            {/* Items for this seller */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                Your Products in this Order
              </h4>
              <div className="divide-y divide-[#E6E0D2] border border-[#E6E0D2] rounded-2xl overflow-hidden">
                {(selectedOrder.vendorItems || selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-[#F8F5EC] border border-[#E6E0D2]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#202824]">{item.title}</p>
                        <p className="text-[11px] text-[#68736C]">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#174C3C]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#E6E0D2] flex justify-between items-center text-sm font-bold">
              <span>Your Net Items Subtotal</span>
              <span className="text-[#174C3C] text-base">
                ₹{(selectedOrder.vendorSubtotal || selectedOrder.total || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
