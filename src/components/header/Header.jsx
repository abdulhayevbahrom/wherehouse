// import React, { useState, useEffect } from "react";
// import "./Header.css";
// import { toggleSidebar } from "../../context/sidebarSlice";
// import { useDispatch } from "react-redux";
// import { LuSquareArrowRight } from "react-icons/lu";
// import { menuItems } from "../sidebar/SidebarMenu";

// function Header() {
//   const dispatch = useDispatch();

//   let pageTitle = menuItems.find(
//     (item) => item.path === window.location.pathname
//   )?.label;

//   const [dollarRate, setDollarRate] = useState(null);
//   let one_usd = sessionStorage.getItem("one_usd");

//   // API orqali kursni olish (bu yerda kursni olish uchun masalan, yandex yoki boshqa manba ishlatiladi)
//   useEffect(() => {
//     fetch("https://api.exchangerate-api.com/v4/latest/USD")
//       .then((response) => response.json())
//       .then((data) => {
//         setDollarRate(data.rates.UZS); // USD/UZS kursini oling
//         sessionStorage.setItem("one_usd", data.rates.UZS);
//       })
//       .catch((error) => console.error("API xatolik: ", error));
//   }, []);

//   return (
//     <header>
//       <div className="header_left">
//         <LuSquareArrowRight onClick={() => dispatch(toggleSidebar())} />
//         <span>{pageTitle}</span>
//       </div>
//       <h4>{}</h4>
//       <div className="dollarRate">
//         <p>
//           1$ ={" "}
//           <input
//             type="number"
//             min={0}
//             step="any"
//             value={+one_usd || +dollarRate || 0}
//             onChange={(e) => {
//               const val = +e.target.value;
//               sessionStorage.setItem("one_usd", val);
//               setDollarRate(val);
//             }}
//             style={{ width: 120, padding: 4, fontSize: 16 }}
//             placeholder="Kurs"
//           />{" "}
//           so'm
//         </p>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import "./Header.css";
import { toggleSidebar } from "../../context/sidebarSlice";
import { useDispatch } from "react-redux";
import { LuSquareArrowRight } from "react-icons/lu";
import { menuItems } from "../sidebar/SidebarMenu";

function Header() {
  const dispatch = useDispatch();

  const pageTitle = menuItems.find(
    (item) => item.path === window.location.pathname
  )?.label;

  return (
    <header>
      <div className="header_left">
        <LuSquareArrowRight onClick={() => dispatch(toggleSidebar())} />
        <span>{pageTitle}</span>
      </div>
    </header>
  );
}

export default Header;
