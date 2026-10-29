import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { VendorLayout } from './components/layout/VendorLayout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { SalesPage } from './pages/SalesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingSkeleton } from './components/common/UIComponents';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [productToEdit, setProductToEdit] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-[#174C3C] text-[#D5B779] flex items-center justify-center font-serif-heading font-black text-2xl shadow-xl border border-[#D5B779] animate-bounce mb-4">
          M
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#174C3C]">
          Initializing MarketNest Vendor Studio...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setCurrentTab('edit-product');
  };

  const handleNavigate = (tab) => {
    if (tab !== 'edit-product') {
      setProductToEdit(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <VendorLayout currentTab={currentTab} onSelectTab={handleNavigate}>
      {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}

      {currentTab === 'products' && (
        <ProductsPage
          onNavigate={handleNavigate}
          onEditProduct={handleEditProduct}
        />
      )}

      {currentTab === 'add-product' && (
        <ProductFormPage onNavigate={handleNavigate} />
      )}

      {currentTab === 'edit-product' && (
        <ProductFormPage
          productToEdit={productToEdit}
          onNavigate={handleNavigate}
        />
      )}

      {currentTab === 'inventory' && <InventoryPage />}

      {currentTab === 'orders' && <OrdersPage statusFilter="all" />}

      {currentTab === 'orders-pending' && <OrdersPage statusFilter="pending" />}

      {currentTab === 'orders-shipped' && <OrdersPage statusFilter="shipped" />}

      {currentTab === 'orders-delivered' && <OrdersPage statusFilter="delivered" />}

      {currentTab === 'sales' && <SalesPage />}

      {currentTab === 'reports' && <SalesPage />}

      {currentTab === 'profile' && <ProfilePage />}

      {currentTab === 'settings' && <ProfilePage />}
    </VendorLayout>
  );
}
