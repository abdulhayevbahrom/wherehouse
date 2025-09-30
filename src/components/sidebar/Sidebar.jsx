// import React from "react";
// import "./Sidebar.css";
// import { NavLink } from "react-router-dom";
// import { MdLogout } from "react-icons/md";
// import { Modal } from "antd";
// import { useNavigate } from "react-router-dom";
// import { menuItems } from "./SidebarMenu";
// import { useDispatch } from "react-redux";
// import { LuSquareArrowLeft } from "react-icons/lu";
// import { toggleSidebar } from "../../context/sidebarSlice";

// const { confirm } = Modal;

// function Sidebar() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // const permissions =
//   //   JSON.parse(localStorage.getItem("permissions") || "[]") || [];
//   const permissionsRaw = localStorage.getItem("permissions");
//   let permissions = [];
//   try {
//     if (permissionsRaw && permissionsRaw !== "undefined") {
//       permissions = JSON.parse(permissionsRaw);
//     }
//   } catch {
//     permissions = [];
//   }

//   const filteredMenuItems = menuItems.filter((item) =>
//     permissions?.includes(item.path)
//   );

//   const logOut = () => {
//     confirm({
//       title: "Tizimdan chiqmoqchimisiz?",
//       okText: "Ha",
//       okType: "danger",
//       cancelText: "Yo'q",
//       onOk() {
//         ["token", "full_name", "permissions"].forEach((item) =>
//           localStorage.removeItem(item)
//         );
//         navigate("/login");
//       },
//     });
//   };
//   let companyName;
//   try {
//     const storedCompany = localStorage.getItem("company");
//     companyName = storedCompany ? JSON.parse(storedCompany) : {};
//   } catch (error) {
//     companyName = {};
//   }

//   return (
//     <aside>
//       <div className="sidebar_logo">
//         <h3>{companyName?.name || "Kompaniya nomi"}</h3>
//         <LuSquareArrowLeft onClick={() => dispatch(toggleSidebar())} />
//       </div>

//       <div className="sidebar_links">
//         {filteredMenuItems?.map((item) => (
//           <NavLink
//             onClick={() => dispatch(toggleSidebar())}
//             key={item.path}
//             to={item.path}
//             className="sidebar_menu_item"
//           >
//             {item.icon} <span>{item.label}</span>
//           </NavLink>
//         ))}
//         <div className="sidebar_logout_container">
//           <button onClick={logOut}>
//             Tizimdan chiqish <MdLogout />
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;

import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./SidebarMenu";
import { useDispatch } from "react-redux";
import { LuSquareArrowLeft } from "react-icons/lu";
import { toggleSidebar } from "../../context/sidebarSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const permissionsRaw = localStorage.getItem("permissions");
  let permissions = [];
  try {
    if (permissionsRaw && permissionsRaw !== "undefined") {
      permissions = JSON.parse(permissionsRaw);
    }
  } catch {
    permissions = [];
  }

  const filteredMenuItems = menuItems.filter((item) =>
    permissions?.includes(item.path)
  );

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    // kerakli itemlarni olib tashlash
    ["token", "full_name", "permissions"].forEach((item) =>
      localStorage.removeItem(item)
    );
    setIsLogoutModalOpen(false);
    // sidebarni ham yopish kerak bo'lsa:
    try {
      dispatch(toggleSidebar());
    } catch (e) {
      // ignore if dispatch not available
    }
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  let companyName;
  try {
    const storedCompany = localStorage.getItem("company");
    companyName = storedCompany ? JSON.parse(storedCompany) : {};
  } catch (error) {
    companyName = {};
  }

  return (
    <aside>
      <div className="sidebar_logo">
        <h3>{companyName?.name || "Kompaniya nomi"}</h3>
        <LuSquareArrowLeft onClick={() => dispatch(toggleSidebar())} />
      </div>

      <div className="sidebar_links">
        {filteredMenuItems?.map((item) => (
          <NavLink
            onClick={() => dispatch(toggleSidebar())}
            key={item.path}
            to={item.path}
            className="sidebar_menu_item"
          >
            {item.icon} <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="sidebar_logout_container">
          <button onClick={openLogoutModal}>
            Tizimdan chiqish <MdLogout />
          </button>
        </div>
      </div>

      {/* Logout uchun boshqariladigan modal */}
      <Modal
        open={isLogoutModalOpen}
        title="Tizimdan chiqmoqchimisiz?"
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Ha"
        cancelText="Yo'q"
        okType="danger"
      >
        {/* <p>Siz tizimdan chiqmoqchisiz?</p> */}
      </Modal>
    </aside>
  );
}

export default Sidebar;
