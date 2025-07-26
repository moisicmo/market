import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";


export default [
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  ...prefix("admin", [
    layout("./layouts/admin/admin.layout.tsx", [
      route("dashboard", "routes/admin/dashboard.view.tsx"),
      route("branch", "routes/admin/branch/branch.view.tsx"),
      route("role", "routes/admin/role/role.view.tsx"),
      route("category", "routes/admin/category/category.view.tsx"),
      route("product", "routes/admin/product/product.view.tsx"),
      route("staff", "routes/admin/staff/staff.view.tsx"),
      route("customer", "routes/admin/customer/customer.view.tsx"),
      route("payment", "routes/admin/payment/payment.view.tsx"),
    ]),
  ]),


  route("deep-link-redirect", "routes/deep-link-redirect.tsx"),

] satisfies RouteConfig;
