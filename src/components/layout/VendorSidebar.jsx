import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Boxes,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Store,
  Settings,
  X,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function VendorSidebar({ currentTab, onSelectTab, isOpen, onClose }) {
  const { vendor, logout, isApproved } = useAuth();

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Store Management',
      items: [
        { id: 'products', label: 'My Products', icon: Package },
        { id: 'add-product', label: 'Add New Product', icon: PlusCircle },
        { id: 'inventory', label: 'Inventory', icon: Boxes },
      ],
    },
    {
      title: 'Orders',
      items: [
        { id: 'orders', label: 'All Orders', icon: ShoppingBag },
        { id: 'orders-pending', label: 'Pending Orders', icon: Clock },
        { id: 'orders-shipped', label: 'Shipped', icon: Truck },
        { id: 'orders-delivered', label: 'Delivered', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Business',
      items: [
        { id: 'sales', label: 'Sales & Earnings', icon: TrendingUp },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Store Profile', icon: Store },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (id) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#202824]/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#174C3C] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#0f3429]`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D5B779] text-[#174C3C] flex items-center justify-center font-serif-heading font-black text-xl shadow-md">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-heading text-lg font-bold tracking-tight text-white">
                  MarketNest
                </span>
                <span className="text-[10px] bg-[#D5B779]/20 text-[#D5B779] font-bold px-1.5 py-0.5 rounded border border-[#D5B779]/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#D5B779] tracking-wider uppercase">
                Vendor Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vendor Status Badge */}
        <div className="px-5 py-3.5 bg-[#0f3429]/60 border-b border-white/5 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">
              {vendor?.name || 'Seller Store'}
            </p>
            <p className="text-[11px] text-white/60 truncate">
              {vendor?.email || 'vendor@marketnest.com'}
            </p>
          </div>
          {isApproved ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-400/30 px-2 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3" />
              Approved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D5B779] bg-[#D5B779]/10 border border-[#D5B779]/30 px-2 py-0.5 rounded-full shrink-0">
              <ShieldAlert className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#D5B779] text-[#174C3C] font-semibold shadow-sm'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#174C3C]' : 'text-white/60'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / Sign Out */}
        <div className="p-3 border-t border-white/10 bg-[#0f3429]/40">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-rose-300 hover:bg-rose-900/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Sign Out of Studio</span>
          </button>
        </div>
      </aside>
    </>
  );
}
