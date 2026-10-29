import React, { useState } from 'react';
import { Store, ShieldCheck, ArrowRight, Lock, Mail, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

export function AuthPage() {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name || !email || !password) {
          throw new Error('Please fill all required fields');
        }
        await register({
          name,
          email,
          password,
          phone,
          address,
          city,
          state,
          zip,
          country: 'India',
        });
        setSuccessMsg('Vendor account created successfully! Please log in now.');
        setIsRegisterMode(false);
        setPassword('');
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#174C3C] text-[#D5B779] font-serif-heading font-black text-2xl shadow-lg border border-[#D5B779] mb-4">
          M
        </div>
        <h1 className="font-serif-heading text-3xl font-bold text-[#174C3C] tracking-tight">
          MarketNest
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D5B779] mt-1">
          Vendor Studio Portal
        </p>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E6E0D2] shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            {isRegisterMode ? 'Join as a MarketNest Seller' : 'Sign in to Vendor Studio'}
          </h2>
          <p className="text-xs sm:text-sm text-[#68736C] mt-1">
            {isRegisterMode
              ? 'Start listing your artisanal and curated collections.'
              : 'Enter your verified seller credentials to access your dashboard.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C0392B] flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#26734D] flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                Store / Vendor Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Heritage Handicrafts"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@marketnest.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
              />
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jaipur"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202824] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Rajasthan"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
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
                    className="w-full px-3 py-2 rounded-xl text-sm bg-[#F8F5EC] border border-[#E6E0D2] text-[#202824] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              loading={loading}
              className="w-full py-3 text-sm shadow-md"
            >
              {isRegisterMode ? 'Register Seller Studio' : 'Sign In to Vendor Studio'}
            </PrimaryButton>
          </div>
        </form>

        {/* Toggle Register/Login */}
        <div className="mt-6 pt-5 border-t border-[#E6E0D2] text-center">
          <p className="text-xs text-[#68736C]">
            {isRegisterMode ? 'Already registered as a vendor?' : "Don't have a seller account?"}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setSuccessMsg('');
              }}
              className="ml-1.5 font-semibold text-[#174C3C] hover:text-[#0f3429] underline cursor-pointer"
            >
              {isRegisterMode ? 'Sign In here' : 'Register your Store'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
