import {
  Home,
  Building2 as Branch,
  Users2 as Staff,
  KeyRound as Role,
  ShieldCheck as Permission,
  BookOpenText as Teacher,
  GraduationCap as Student,
  UserCheck2 as Customer,
  ClipboardList as Inscription,
  CalendarClock as Booking,
  MonitorSmartphone as Room,
  HandCoins as Debt,
  FileBarChart2 as Report,
  GraduationCap,
} from 'lucide-react';

export const menu = () => {
  return [
    {
      path: '/admin/dashboard',
      title: 'Dashboard',
      icon: <Home size={18} />,
    },
    {
      title: 'Administración',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/payment',
          title: 'Pagos',
          icon: <Debt size={18} />,
        },
        {
          path: '/admin/category',
          title: 'Categorias',
          icon: <GraduationCap size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/product',
          title: 'Productos',
          icon: <GraduationCap size={18} />,
          permission: 'show-halls',
        },
      ],
    },
    {
      title: 'Administradores',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/branch',
          title: 'Sucursales',
          icon: <Branch size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/staff',
          title: 'Staff',
          icon: <Staff size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/role',
          title: 'Roles',
          icon: <Role size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/customer',
          title: 'Clientes',
          icon: <Customer size={18} />,
          permission: 'show-halls',
        },
      ],
    },
    {
      title: 'Reportes',
      permission: 'show-rent',
      group: [
      ],
    },
  ];
};
