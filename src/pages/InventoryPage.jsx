import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  Check,
  AlertTriangle,
  RotateCw,
  TrendingDown,
  Package,
} from 'lucide-react';
import { productService } from '../services/api';
import {
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  LoadingSkeleton,
  EmptyState,
} from '../components/common/UIComponents';

export function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stockUpdates, setStockUpdates] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await productService.getMyProducts();
      setProducts(res.data || []);
      // Pre-fill editable stock state
      const initial = {};
      (res.data || []).forEach((p) => {
        initial[p._id] = p.stock || 0;
      });
      setStockUpdates(initial);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (id, val) => {
    setStockUpdates((prev) => ({
      ...prev,
      [id]: val === '' ? '' : Math.max(0, parseInt(val) || 0),
    }));
  };

  const handleSaveStock = async (id) => {
    const newStock = stockUpdates[id];
    if (newStock === '' || isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative stock count');
      return;
    }

    try {
      setUpdatingId(id);
      await productService.updateStock(id, newStock);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: Number(newStock) } : p))
      );
      showToast('Stock quantity updated in real-time');
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#174C3C] text-white px-5 py-3 text-xs sm:text-sm font-semibold shadow-2xl border border-[#D5B779] animate-in fade-in slide-in-from-bottom duration-300">
          <span className="text-[#D5B779]">✦</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Inventory Management
          </h2>
          <p className="text-xs sm:text-sm text-[#68736C]">
            Monitor current warehouse levels and instantly adjust available inventory.
          </p>
        </div>
        <SecondaryButton
          icon={RotateCw}
          onClick={loadProducts}
          loading={loading}
          className="text-xs"
        >
          Refresh Stock
        </SecondaryButton>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E6E0D2] p-4 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#68736C]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inventory by product name or category..."
          className="w-full bg-transparent text-xs sm:text-sm text-[#202824] focus:outline-hidden"
        />
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No products in inventory"
          description="Add items to your catalog to track live stock."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Status Indicator</th>
                  <th className="py-3.5 px-4">Adjust Stock Level</th>
                  <th className="py-3.5 px-4 text-right">Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D2]/60 text-xs text-[#202824]">
                {filteredProducts.map((p) => {
                  const currentStock = p.stock || 0;
                  const isModified = stockUpdates[p._id] !== undefined && stockUpdates[p._id] !== currentStock;

                  return (
                    <tr key={p._id} className="hover:bg-[#F8F5EC]/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F8F5EC] border border-[#E6E0D2] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#202824] truncate max-w-xs">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#68736C]">₹{p.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#68736C]">{p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-sm text-[#202824]">
                        {currentStock} units
                      </td>
                      <td className="py-3.5 px-4">
                        {currentStock === 0 ? (
                          <StatusBadge status="Out of Stock" />
                        ) : currentStock <= 5 ? (
                          <StatusBadge status="Low Stock" />
                        ) : (
                          <StatusBadge status="Active" />
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          min="0"
                          value={stockUpdates[p._id] !== undefined ? stockUpdates[p._id] : currentStock}
                          onChange={(e) => handleStockChange(p._id, e.target.value)}
                          className="w-24 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <PrimaryButton
                          onClick={() => handleSaveStock(p._id)}
                          loading={updatingId === p._id}
                          disabled={!isModified || updatingId === p._id}
                          className="text-xs px-3 py-1.5"
                        >
                          Save
                        </PrimaryButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
