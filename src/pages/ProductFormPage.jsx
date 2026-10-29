import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

export function ProductFormPage({ productToEdit, onNavigate }) {
  const { vendor, isApproved } = useAuth();
  const isEditing = Boolean(productToEdit);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [name, setName] = useState(productToEdit?.name || productToEdit?.title || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice || '');
  const [category, setCategory] = useState(productToEdit?.category || '');
  const [brand, setBrand] = useState(productToEdit?.brand || vendor?.name || 'MarketNest Artisan');
  const [stock, setStock] = useState(productToEdit?.stock !== undefined ? productToEdit.stock : 10);
  const [description, setDescription] = useState(
    productToEdit?.description || 'Authentic curated handicraft crafted with precision.'
  );
  const [image, setImage] = useState(
    productToEdit?.image ||
    (Array.isArray(productToEdit?.images) && productToEdit.images[0]) ||
    ''
  );
  const [status, setStatus] = useState(productToEdit?.status || 'active');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getAll();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          if (!category) {
            setCategory(res.data[0].slug || res.data[0].name);
          }
        }
      } catch (err) {
        console.warn('Categories load error:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Product title / name is required');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('A valid selling price is required');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setError('Stock cannot be negative');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        title: name.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
        category,
        brand: brand.trim() || vendor?.name || 'Artisan Market',
        stock: Number(stock),
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        images: image.trim() ? [image.trim()] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
        status,
      };

      if (isEditing) {
        await productService.updateProduct(productToEdit._id, payload);
        setSuccess('Product listing updated successfully!');
      } else {
        await productService.createProduct(payload);
        setSuccess('Product created successfully! Awaiting verification.');
      }

      setTimeout(() => {
        onNavigate('products');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#174C3C] hover:text-[#0f3429] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Products</span>
        </button>
        <span className="text-xs text-[#68736C]">
          {isEditing ? 'Editing ID: ' + productToEdit._id : 'New Listing Submission'}
        </span>
      </div>

      <div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#202824]">
          {isEditing ? 'Edit Product Listing' : 'Add New Marketplace Product'}
        </h2>
        <p className="text-xs sm:text-sm text-[#68736C] mt-1">
          Provide accurate specifications, high-res photography, and stock quantity for your listing.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C0392B]">
          ⚠ {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#26734D] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            1. Basic Information
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Product Title / Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Handcrafted Kashmiri Pashmina Shawl"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Marketplace Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C]"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id || c.name} value={c.slug || c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="clothing">Ethnic Wear & Textiles</option>
                    <option value="home">Home Decor & Artisanal Crafts</option>
                    <option value="jewelry">Fine Jewelry</option>
                    <option value="wellness">Ayurveda & Wellness</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Brand / Artisan Label
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Royal Heritage"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight craftsmanship, materials, dimensions, and care instructions..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            2. Pricing & Live Inventory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Original MRP (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2999"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="15"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Product Photography */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            3. Product Imagery
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Image URL *
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
            />
            <p className="text-[11px] text-[#68736C] mt-1">
              Provide an authentic, high-quality image URL. Recommended resolution: 800x800 or higher.
            </p>
          </div>

          {/* Live Image Preview */}
          {image && (
            <div className="mt-3 p-3 bg-[#F8F5EC] rounded-xl border border-[#E6E0D2] flex items-center gap-4">
              <img
                src={image}
                alt="Product preview"
                className="w-20 h-20 rounded-lg object-cover bg-white border border-[#E6E0D2]"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div>
                <p className="text-xs font-semibold text-[#202824]">Image Preview</p>
                <p className="text-[11px] text-[#68736C]">Verified display on listing card</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Publishing Status */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            4. Listing Visibility
          </h3>

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#202824] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === 'active'}
                onChange={() => setStatus('active')}
                className="accent-[#174C3C]"
              />
              <span>Active (Live on marketplace)</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#202824] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="accent-[#174C3C]"
              />
              <span>Save as Draft</span>
            </label>
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <SecondaryButton onClick={() => onNavigate('products')}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            loading={loading}
            icon={Save}
            className="px-6 py-3 font-bold"
          >
            {isEditing ? 'Save Changes' : 'Submit Product for Approval'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
