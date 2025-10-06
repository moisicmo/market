import {
  Home,
  Building2,
  Users2,
  KeyRound,
  ShieldCheck,
  UserCheck2,
  FileBarChart2,
  GraduationCap,
  ClipboardList,
  HandCoins,
  MonitorSmartphone,
  CalendarClock,
  BookOpenText,
} from 'lucide-react';

export const menu = () => {
  return [
    {
      path: '/admin/dashboard',
      title: 'Dashboard',
      icon: <Home size={18} />,
    },
    {
      title: 'Sucursales',
      permission: 'show-branches',
      group: [
        {
          path: '/admin/branch',
          title: 'Sucursales',
          icon: <Building2 size={18} />,
          permission: 'show-branches',
        },
      ],
    },
    {
      title: 'Catálogo',
      permission: 'show-catalog',
      group: [
        {
          path: '/admin/category',
          title: 'Categorías',
          icon: <BookOpenText size={18} />,
          permission: 'show-categories',
        },
        {
          path: '/admin/product',
          title: 'Productos',
          icon: <GraduationCap size={18} />,
          permission: 'show-products',
        },
      ],
    },
    {
      title: 'Operaciones',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/inventory',
          title: 'Inventario',
          icon: <ClipboardList size={18} />,
          permission: 'show-inventory',
        },
        {
          path: '/admin/deliveries',
          title: 'Entregas',
          icon: <CalendarClock size={18} />,
          permission: 'show-deliveries',
        },
      ],
    },
    {
      title: 'Ventas',
      permission: 'show-sales',
      group: [
        {
          path: '/admin/pos',
          title: 'Punto de Venta',
          icon: <MonitorSmartphone size={18} />,
          permission: 'use-pos',
        },
        {
          path: '/admin/orders',
          title: 'Órdenes y Ventas',
          icon: <FileBarChart2 size={18} />,
          permission: 'show-orders',
        },
      ],
    },
    {
      title: 'Usuarios y Permisos',
      permission: 'show-users',
      group: [
        {
          path: '/admin/staff',
          title: 'Personal',
          icon: <Users2 size={18} />,
          permission: 'show-staff',
        },
        {
          path: '/admin/role',
          title: 'Roles',
          icon: <KeyRound size={18} />,
          permission: 'show-roles',
        },
        {
          path: '/admin/permission',
          title: 'Permisos',
          icon: <ShieldCheck size={18} />,
          permission: 'show-permissions',
        },
        {
          path: '/admin/customer',
          title: 'Clientes',
          icon: <UserCheck2 size={18} />,
          permission: 'show-customers',
        },
      ],
    },
    {
      title: 'Reportes',
      permission: 'show-reports',
      group: [
        {
          path: '/admin/reports/sales',
          title: 'Ventas',
          icon: <FileBarChart2 size={18} />,
          permission: 'show-sales-report',
        },
        {
          path: '/admin/reports/inventory',
          title: 'Inventario',
          icon: <ClipboardList size={18} />,
          permission: 'show-inventory-report',
        },
        // otros reportes si deseas
      ],
    },
  ];
};
