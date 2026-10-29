import React, { useState } from 'react';
import { VendorSidebar } from './VendorSidebar';
import { VendorHeader } from './VendorHeader';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  products: 'My Products',
  'add-product': 'Add New Product',
  inventory: 'Inventory & Stock Management',
  orders: 'All Store Orders',
  'orders-pending': 'Pending Orders',
  'orders-shipped': 'Shipped Orders',
  'orders-delivered': 'Delivered Orders',
  sales: 'Sales & Earnings',
  reports: 'Reports & Analytics',
  profile: 'Store Profile',
  settings: 'Account Settings',
};

export function VendorLayout({ currentTab, onSelectTab, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#202824] flex font-sans-body">
      {/* Sidebar Navigation */}
      <VendorSidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        {/* Top Header */}
        <VendorHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          currentTabName={TAB_TITLES[currentTab] || 'Vendor Studio'}
          onSelectTab={onSelectTab}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
