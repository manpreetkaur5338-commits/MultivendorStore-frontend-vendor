import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  LogOut,
  ExternalLink,
  Store,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function VendorHeader({ onOpenMobileSidebar, currentTabName, onSelectTab }) {
  const { vendor, logout, isApproved } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'VS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6E0D2] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb / title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#202824] hover:bg-[#E8EFE8] border border-[#E6E0D2] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[#174C3C]" />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#68736C]">
            <span>MarketNest</span>
            <span>/</span>
            <span>Studio</span>
            <span>/</span>
            <span className="text-[#174C3C] font-semibold">{currentTabName}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-serif-heading text-[#202824] leading-tight">
            {currentTabName}
          </h1>
        </div>
      </div>

      {/* Right controls: Status, Actions, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Verification Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#F8F5EC]">
          {isApproved ? (
            <>
              <ShieldCheck className="w-4 h-4 text-[#26734D]" />
              <span className="text-[#26734D]">Verified Seller</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-[#A66B12]" />
              <span className="text-[#A66B12]">Pending Approval</span>
            </>
          )}
        </div>

        {/* View Customer Storefront link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#174C3C] hover:bg-[#E8EFE8] border border-[#E6E0D2] transition"
        >
          <span>Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#E8EFE8] transition border border-transparent hover:border-[#E6E0D2] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#174C3C] text-[#D5B779] font-bold text-xs flex items-center justify-center border border-[#D5B779]">
              {getInitials(vendor?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#202824] leading-tight">
                {vendor?.name || 'Seller'}
              </p>
              <p className="text-[10px] text-[#68736C]">Vendor Account</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#68736C] hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E6E0D2] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#E6E0D2]/60">
                <p className="text-xs font-semibold text-[#202824] truncate">
                  {vendor?.name}
                </p>
                <p className="text-[11px] text-[#68736C] truncate">{vendor?.email}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isApproved ? 'bg-[#26734D]' : 'bg-[#D5B779]'}`} />
                  <span className="text-[10px] font-medium text-[#68736C]">
                    {isApproved ? 'Approved for catalog' : 'Verification Pending'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectTab('profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#202824] hover:bg-[#E8EFE8] flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#174C3C]" />
                  Store Profile
                </button>
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#202824] hover:bg-[#E8EFE8] flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#174C3C]" />
                  Account Settings
                </button>
              </div>

              <div className="border-t border-[#E6E0D2]/60 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#C0392B] hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#C0392B]" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
