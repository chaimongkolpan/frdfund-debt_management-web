import {
  ShoppingBag,
  Plus,
  List,
  Home
} from "react-feather";
export default [
  {
    id: "Dashboard",
    title: "แดชบอร์ด",
    icon: <img src="/assets/images/icons/dashboard.svg" width={20} height={20} style={{ marginRight: '1.1rem' }}/>,
    navLink: "/dashboard",
  },
  {
    id: "Shop",
    title: "ร้านค้า",
    icon: <img src="/assets/images/icons/shop.svg" width={20} height={20} style={{ marginRight: '1.1rem' }}/>,
    navLink: "/shops",
  },
  {
    id: "Products",
    title: "สินค้า",
    icon: <img src="/assets/images/icons/product.svg" width={20} height={20} style={{ marginRight: '1.1rem' }}/>,
    navLink: "/products",
  },
  {
    id: "AddProducts",
    title: "เพิ่มสินค้า",
    icon: <Plus size={20} />,
    navLink: "/product-create",
  },
  {
    id: "Cart",
    title: "ตะกร้าสินค้า",
    icon: <ShoppingBag size={20} />,
    navLink: "/cart",
  },
  {
    id: "Orders",
    title: "รายการสั่งซื้อ",
    icon: <List size={20} />,
    navLink: "/orders",
  },
];
