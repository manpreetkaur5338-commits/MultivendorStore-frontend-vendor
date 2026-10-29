import React, { useState, useEffect } from 'react';
import {
  Store,
  Save,
  Check,
  ShieldCheck,
  ShieldAlert,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

export function ProfilePage() {
  const { vendor, updateProfile, isApproved } = useAuth();

  const [name, setName] = useState(vendor?.name || '');
  const [email, setEmail] = useState(vendor?.email || '');
  const [phone, setPhone] = useState(vendor?.phone || '');
  const [address, setAddress] = useState(vendor?.address || '');
  const [city, setCity] = useState(vendor?.city || '');
  const [state, setState] = useState(vendor?.state || '');
  const [zip, setZip] = useState(vendor?.zip || '');
  const [country, setCountry] = useState(vendor?.country || 'India');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vendor) {
      setName(vendor.name || '');
      setEmail(vendor.email || '');
      setPhone(vendor.phone || '');
      setAddress(vendor.address || '');
      setCity(vendor.city || '');
      setState(vendor.state || '');
      setZip(vendor.zip || '');
      setCountry(vendor.country || 'India');
    }
  }, [vendor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      await updateProfile({
        name,
        phone,
        address,
        city,
        state,
        zip,
        country,
      });
      setSuccess('Store profile and business credentials saved successfully!');
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.message || 'Failed to update store profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#202824]">
          Store Profile & Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#68736C] mt-1">
          Manage your verified store name, dispatch address, and seller contact details.
        </p>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isApproved
                ? 'bg-emerald-50 text-[#26734D] border border-emerald-200'
                : 'bg-amber-50 text-[#A66B12] border border-amber-200'
            }`}
          >
            {isApproved ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-serif-heading text-base font-bold text-[#202824]">
              {isApproved ? 'Verified MarketNest Seller' : 'Store Verification In Progress'}
            </h4>
            <p className="text-xs text-[#68736C]">
              {isApproved
                ? 'Your business profile is fully authenticated. Your products are accessible to all marketplace buyers.'
                : 'Your profile has been submitted and is currently being reviewed by MarketNest administrators.'}
            </p>
          </div>
        </div>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            Business & Store Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Registered Store Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Login / Contact Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 border border-[#E6E0D2] text-[#68736C] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#68736C] mt-1 block">
                Email address is linked to your authentication token and cannot be changed here.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Dispatch & Warehouse Location */}
        <div className="bg-white rounded-2xl border border-[#E6E0D2] p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] border-b border-[#E6E0D2]/60 pb-3">
            Dispatch Warehouse & Origin Address
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Warehouse / Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop 14, Heritage Artisan Center"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jaipur"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Rajasthan"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="302001"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <PrimaryButton
            type="submit"
            loading={loading}
            icon={Save}
            className="px-6 py-3 font-bold"
          >
            Save Profile Details
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
