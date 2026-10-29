import React from 'react';
import { Loader2 } from 'lucide-react';

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-[#174C3C] hover:bg-[#0f3429] active:scale-[0.99] transition-all shadow-sm border border-[#174C3C] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#D5B779] focus:ring-offset-2 ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" /> : Icon && <Icon className="w-4 h-4 text-[#D5B779]" />}
      <span>{children}</span>
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-[#202824] bg-white hover:bg-[#E8EFE8] active:scale-[0.99] transition-all border border-[#E6E0D2] shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#174C3C] ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#174C3C]" /> : Icon && <Icon className="w-4 h-4 text-[#68736C]" />}
      <span>{children}</span>
    </button>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  accent = 'emerald',
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E6E0D2] shadow-xs hover:border-[#D5B779] hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#68736C] mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#202824] tracking-tight font-sans-body">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${accent === 'gold' ? 'bg-[#D5B779]/15 text-[#A66B12]' : 'bg-[#E8EFE8] text-[#174C3C]'} group-hover:scale-105 transition-transform`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      
      {(description || trend !== undefined) && (
        <div className="mt-4 pt-3 border-t border-[#E6E0D2]/50 flex items-center justify-between text-xs text-[#68736C]">
          <span>{description}</span>
          {trend !== undefined && (
            <span className={`font-semibold ${trend >= 0 ? 'text-[#26734D]' : 'text-[#C0392B]'}`}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`} {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, type = 'default' }) {
  const norm = String(status || '').toLowerCase();
  
  let styles = 'bg-[#E8EFE8] text-[#174C3C] border-[#174C3C]/20';
  let label = status;

  if (norm === 'active' || norm === 'delivered' || norm === 'approved' || norm === 'completed') {
    styles = 'bg-emerald-50 text-[#26734D] border-emerald-200';
    label = norm === 'approved' ? 'Approved' : norm === 'active' ? 'Active' : norm === 'delivered' ? 'Delivered' : 'Completed';
  } else if (norm === 'pending' || norm === 'placed' || norm === 'draft' || norm === 'low stock') {
    styles = 'bg-amber-50 text-[#A66B12] border-amber-200';
    label = norm === 'pending' ? 'Pending Approval' : norm === 'placed' ? 'New Order' : norm === 'draft' ? 'Draft' : 'Low Stock';
  } else if (norm === 'processing' || norm === 'shipped') {
    styles = 'bg-blue-50 text-[#1E40AF] border-blue-200';
    label = norm === 'processing' ? 'Processing' : 'Shipped';
  } else if (norm === 'cancelled' || norm === 'out of stock' || norm === 'failed' || norm === 'archived') {
    styles = 'bg-rose-50 text-[#C0392B] border-rose-200';
    label = norm === 'cancelled' ? 'Cancelled' : norm === 'out of stock' ? 'Out of Stock' : norm === 'archived' ? 'Archived' : 'Failed';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {label}
    </span>
  );
}

export function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-[#E8EFE8]/70 rounded-xl w-full"></div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E0D2] p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-16 h-16 bg-[#F8F5EC] border border-[#E6E0D2] rounded-2xl flex items-center justify-center mx-auto text-[#174C3C] mb-4">
        {Icon ? <Icon className="w-8 h-8 text-[#174C3C]" /> : <span className="text-2xl">📦</span>}
      </div>
      <h3 className="font-serif-heading text-xl font-bold text-[#202824] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#68736C] max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

export function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose, isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202824]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E6E0D2] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="font-serif-heading text-lg font-bold text-[#202824] mb-2">{title}</h3>
        <p className="text-sm text-[#68736C] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={onClose}>{cancelText}</SecondaryButton>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm text-white transition-all cursor-pointer ${
              isDestructive ? 'bg-[#C0392B] hover:bg-[#a93226]' : 'bg-[#174C3C] hover:bg-[#0f3429]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
