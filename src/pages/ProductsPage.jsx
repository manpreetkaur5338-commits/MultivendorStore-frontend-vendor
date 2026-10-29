import React, { useState, useEffect } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import {
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  LoadingSkeleton,
  EmptyState,
  ConfirmModal,
} from '../components/common/UIComponents';

export function ProductsPage({ onNavigate, onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [prodRes, catRes] = await Promise.all([
        productService.getMyProducts(),
        categoryService.getAll().catch(() => ({ data: [] })),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await productService.deleteProduct(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  // Filter products locally by search, category, and status
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      !search ||
      (prod.name && prod.name.toLowerCase().includes(search.toLowerCase())) ||
      (prod.brand && prod.brand.toLowerCase().includes(search.toLowerCase())) ||
      (prod.category && prod.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      (prod.category && prod.category.toLowerCase() === categoryFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && prod.isApproved) ||
      (statusFilter === 'pending' && !prod.isApproved) ||
      (statusFilter === 'low-stock' && (prod.stock || 0) <= 5);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            My Products
          </h2>
          <p className="text-xs sm:text-sm text-[#68736C]">
            Manage your catalog items, pricing, inventory, and listings.
          </p>
        </div>
        <PrimaryButton
          icon={PlusCircle}
          onClick={() => onNavigate('add-product')}
        >
          Add New Product
        </PrimaryButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E6E0D2] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#68736C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, category, or brand..."
            className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-[#202824] focus:outline-hidden focus:border-[#174C3C]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.slug || c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-[#F8F5EC] border border-[#E6E0D2] rounded-xl text-[#202824] focus:outline-hidden focus:border-[#174C3C]"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved & Live</option>
            <option value="pending">Pending Approval</option>
            <option value="low-stock">Low Stock (≤5)</option>
          </select>

          {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs font-semibold text-[#C0392B] hover:underline px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table or Card List */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-sm font-semibold text-[#C0392B]">{error}</p>
          <SecondaryButton onClick={loadData} className="mt-4">
            Retry Loading
          </SecondaryButton>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={products.length === 0 ? 'No products listed yet' : 'No matching products'}
          description={
            products.length === 0
              ? 'Start listing your artisanal and curated products to display them in MarketNest.'
              : 'Try clearing your search keyword or selected category filter.'
          }
          action={
            products.length === 0 ? (
              <PrimaryButton
                icon={PlusCircle}
                onClick={() => onNavigate('add-product')}
              >
                Add Your First Product
              </PrimaryButton>
            ) : null
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D2]/60 text-xs text-[#202824]">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-[#F8F5EC]/40 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.image ||
                            (Array.isArray(prod.images) && prod.images[0]) ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#F8F5EC] border border-[#E6E0D2] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#202824] truncate max-w-xs group-hover:text-[#174C3C] transition">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-[#68736C]">
                            Brand: {prod.brand || 'Artisan Market'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#68736C]">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <div>
                        <span>₹{(prod.price || 0).toLocaleString('en-IN')}</span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-[#68736C] line-through ml-1.5">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                          prod.stock === 0
                            ? 'bg-rose-50 text-[#C0392B]'
                            : prod.stock <= 5
                            ? 'bg-amber-50 text-[#A66B12]'
                            : 'bg-emerald-50 text-[#26734D]'
                        }`}
                      >
                        {prod.stock === 0 ? 'Out of stock' : `${prod.stock} units`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={prod.isApproved ? prod.status : 'pending'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditProduct(prod)}
                          className="p-1.5 text-[#174C3C] hover:bg-[#E8EFE8] rounded-lg transition cursor-pointer"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 text-[#C0392B] hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#F8F5EC]/50 border-t border-[#E6E0D2] flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <span className="font-semibold text-[#174C3C]">
              MarketNest Live Inventory
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Product Listing?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Product'}
        isDestructive={true}
        onConfirm={handleDelete}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}
