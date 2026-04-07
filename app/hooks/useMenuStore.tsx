import { usePermissionStore } from '@/hooks';
import { TypeAction, TypeSubject } from '@/models';
import {
  Home,
  Building2 as Branch,
  Users2 as Staff,
  KeyRound as Role,
  ShieldCheck as Permission,
  BookOpenText,
  GraduationCap,
  BarChart3 as ReportIcon,
  UserCog as Users,
  Factory,
  Tag,
  Package,
  ShoppingCart,
  Receipt,
  Users as Customers,
  ClipboardCheck,
  BarChart4,
  ClipboardList,
  MonitorSmartphone,
  CalendarClock,
} from 'lucide-react';

interface MenuItem {
  path?: string;
  title: string;
  icon: React.ReactNode;
  group?: MenuItem[];
  permission?: string;
}

export const useMenu = (): MenuItem[] => {
  const { hasPermission } = usePermissionStore();

  const menuItems: MenuItem[] = [];

  // Dashboard (siempre visible)
  menuItems.push({
    path: '/admin/dashboard',
    title: 'Dashboard',
    icon: <Home size={18} />,
  });

  // Clientes
  if (hasPermission(TypeAction.manage, TypeSubject.customer)) {
    menuItems.push({
      path: '/admin/customer',
      title: 'Clientes',
      icon: <Customers size={18} />,
    });
  }

  // Catálogo
  const catalogoItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.category)) {
    catalogoItems.push({
      path: '/admin/category',
      title: 'Categorías',
      icon: <BookOpenText size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.brand)) {
    catalogoItems.push({
      path: '/admin/brand',
      title: 'Marcas',
      icon: <Tag size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.product)) {
    catalogoItems.push({
      path: '/admin/product',
      title: 'Productos',
      icon: <GraduationCap size={18} />,
    });
  }

  if (catalogoItems.length > 0) {
    menuItems.push({
      title: 'Catálogo',
      icon: <Package size={18} />,
      group: catalogoItems,
    });
  }

  // Operaciones / Inventario
  const operacionesItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.inventory)) {
    operacionesItems.push({
      path: '/admin/inventory',
      title: 'Inventario',
      icon: <ClipboardList size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.purchase)) {
    operacionesItems.push({
      path: '/admin/purchase',
      title: 'Compras',
      icon: <CalendarClock size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.writeoff)) {
    operacionesItems.push({
      path: '/admin/writeoffs',
      title: 'Bajas',
      icon: <CalendarClock size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.transferRequest)) {
    operacionesItems.push({
      path: '/admin/transfer-request',
      title: 'Solicitudes Traspaso',
      icon: <ClipboardList size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.delivery)) {
    operacionesItems.push({
      path: '/admin/delivery',
      title: 'Entregas',
      icon: <CalendarClock size={18} />,
    });
  }

  if (operacionesItems.length > 0) {
    menuItems.push({
      title: 'Operaciones',
      icon: <ClipboardCheck size={18} />,
      group: operacionesItems,
    });
  }

  // Ventas
  const ventasItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.sale)) {
    ventasItems.push({
      path: '/admin/pos',
      title: 'Punto de Venta',
      icon: <MonitorSmartphone size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.sale)) {
    ventasItems.push({
      path: '/admin/sales',
      title: 'Órdenes y Ventas',
      icon: <Receipt size={18} />,
    });
  }

  if (ventasItems.length > 0) {
    menuItems.push({
      title: 'Ventas',
      icon: <ShoppingCart size={18} />,
      group: ventasItems,
    });
  }

  // Administración (Usuarios y Permisos)
  const adminItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.branch)) {
    adminItems.push({
      path: '/admin/branch',
      title: 'Sucursales',
      icon: <Branch size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.staff)) {
    adminItems.push({
      path: '/admin/staff',
      title: 'Personal',
      icon: <Staff size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.role)) {
    adminItems.push({
      path: '/admin/role',
      title: 'Roles',
      icon: <Role size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.permission)) {
    adminItems.push({
      path: '/admin/permission',
      title: 'Permisos',
      icon: <Permission size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.provider)) {
    adminItems.push({
      path: '/admin/provider',
      title: 'Proveedores',
      icon: <Factory size={18} />,
    });
  }


  if (adminItems.length > 0) {
    menuItems.push({
      title: 'Administración',
      icon: <Users size={18} />,
      group: adminItems,
    });
  }
  // Cuentas
  const CuentasYCajasItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.accountsPayable)) {
    CuentasYCajasItems.push({
      path: '/admin/accounts/payables',
      title: 'Cuentas por pagar',
      icon: <BarChart4 size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.accountsReceivable)) {
    CuentasYCajasItems.push({
      path: '/admin/accounts/receivables',
      title: 'Cuentas por cobrar',
      icon: <ClipboardList size={18} />,
    });
  }

  if (CuentasYCajasItems.length > 0) {
    menuItems.push({
      title: 'Cuentas y Cajas',
      icon: <ReportIcon size={18} />,
      group: CuentasYCajasItems,
    });
  }

  // Reportes
  const reportesItems: MenuItem[] = [];

  if (hasPermission(TypeAction.manage, TypeSubject.report)) {
    reportesItems.push({
      path: '/admin/reports/sales',
      title: 'Ventas',
      icon: <BarChart4 size={18} />,
    });
  }

  if (hasPermission(TypeAction.manage, TypeSubject.report)) {
    reportesItems.push({
      path: '/admin/reports/inventory',
      title: 'Inventario',
      icon: <ClipboardList size={18} />,
    });
  }

  if (reportesItems.length > 0) {
    menuItems.push({
      title: 'Reportes',
      icon: <ReportIcon size={18} />,
      group: reportesItems,
    });
  }

  return menuItems;
};