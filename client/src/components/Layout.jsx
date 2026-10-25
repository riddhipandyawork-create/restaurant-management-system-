import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  ConciergeBell,
  ChefHat,
  Receipt,
  Users,
  LineChart,
  LogOut,
  Menu as MenuIcon
} from 'lucide-react';

const ROLES = {
  admin: ['dashboard', 'menu', 'orders', 'tables', 'kitchen', 'reservations', 'billing', 'staff', 'reports'],
  manager: ['dashboard', 'menu', 'orders', 'tables', 'kitchen', 'reservations', 'billing', 'staff', 'reports'],
  cashier: ['dashboard', 'billing', 'orders'],
  waiter: ['dashboard', 'orders', 'tables', 'menu'],
  chef: ['dashboard', 'kitchen', 'menu'],
};

const ROUTES = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { path: '/menu', name: 'Menu', icon: UtensilsCrossed, id: 'menu' },
  { path: '/orders', name: 'Orders', icon: ClipboardList, id: 'orders' },
  { path: '/tables', name: 'Tables', icon: ConciergeBell, id: 'tables' },
  { path: '/kitchen', name: 'Kitchen', icon: ChefHat, id: 'kitchen' },
  { path: '/reservations', name: 'Reservations', icon: ClipboardList, id: 'reservations' },
  { path: '/billing', name: 'Billing', icon: Receipt, id: 'billing' },
  { path: '/staff', name: 'Staff', icon: Users, id: 'staff' },
  { path: '/reports', name: 'Reports', icon: LineChart, id: 'reports' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) return <Outlet />;

  const allowedRoutes = ROUTES.filter(r => ROLES[user.role]?.includes(r.id));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 bg-card/60 backdrop-blur-xl border-r border-border h-full flex flex-col z-20"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <ChefHat className="text-primary w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">RMS<span className="text-primary">.</span></h1>
              </div>
            </div>
            
            <div className="px-6 py-2 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              {allowedRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                return (
                  <Link key={route.path} to={route.path}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                        isActive 
                          ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(245,158,11,0.15)] border border-primary/20' 
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10"
                        />
                      )}
                      <route.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                      <span className="font-medium text-sm">{route.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="font-bold text-primary text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
        
        {/* Header */}
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center px-8 z-10 sticky top-0 gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {ROUTES.find(r => r.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <p className="text-xs text-muted-foreground">Manage your restaurant operations efficiently.</p>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
