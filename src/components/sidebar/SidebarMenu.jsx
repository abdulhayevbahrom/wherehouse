// import { IoMdHome } from "react-icons/io";
// import { MdMoneyOff } from "react-icons/md";
// import { UserOutlined } from "@ant-design/icons";

// export const menuItems = [
//   {
//     icon: <IoMdHome size={20} />,
//     path: "/",
//     label: "Bosh sahifa",
//   },
//   {
//     icon: <IoMdHome size={20} />,
//     path: "/agents",
//     label: "Agentlar",
//   },
//   {
//     icon: <IoMdHome size={20} />,
//     path: "/ombor",
//     label: "Ombor",
//   },
//   {
//     icon: <IoMdHome size={20} />,
//     path: "/sale",
//     label: "Sotuv bo'limi",
//   },
//   {
//     icon: <MdMoneyOff size={20} />,
//     path: "/expense",
//     label: "Xarajatlar",
//   },
//   {
//     icon: <MdMoneyOff size={20} />,
//     path: "/debt",
//     label: "Qarzlar",
//   },
//   {
//     icon: <MdMoneyOff size={20} />,
//     path: "/products",
//     label: "Mahsulotlar",
//   },
//   {
//     path: "/suppliers",
//     label: "Taminotchilar",
//     icon: <UserOutlined />, // ant design ikonkasi
//   },
//   {
//     path: "/debtors",
//     label: "Qarzdorlar",
//     icon: <UserOutlined />, // ant design ikonkasi
//   },
// ];

import { IoMdHome } from "react-icons/io";
import {
  MdMoneyOff,
  MdInventory,
  MdPointOfSale,
  MdShoppingCart,
} from "react-icons/md";
import { FaUsers, FaTruck, FaUserTie, FaMoneyBillWave } from "react-icons/fa";
import { HiOutlineUserGroup, HiOutlineCreditCard } from "react-icons/hi";

export const menuItems = [
  {
    icon: <IoMdHome size={20} />,
    path: "/",
    label: "Bosh sahifa",
  },
  {
    icon: <FaUserTie size={20} />,
    path: "/agents",
    label: "Dastavchik",
  },
  {
    icon: <MdInventory size={20} />,
    path: "/ombor",
    label: "Ombor",
  },
  {
    icon: <MdPointOfSale size={20} />,
    path: "/sale",
    label: "Sotuv bo'limi",
  },
  {
    icon: <MdMoneyOff size={20} />,
    path: "/expense",
    label: "Xarajatlar",
  },
  {
    icon: <HiOutlineCreditCard size={20} />,
    path: "/debt",
    label: "Qarzlar",
  },
  {
    icon: <MdShoppingCart size={20} />,
    path: "/products",
    label: "Mahsulotlar",
  },
  {
    path: "/suppliers",
    label: "Taminotchilar",
    icon: <FaTruck size={20} />,
  },
  {
    path: "/debtors",
    label: "Qarzdorlar",
    icon: <FaMoneyBillWave size={20} />,
  },
];
