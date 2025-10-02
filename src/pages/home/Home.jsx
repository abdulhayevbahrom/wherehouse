// import React, { useState } from "react";
// import { Card, Spin } from "antd";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   ShoppingCartOutlined,
//   WarningOutlined,
// } from "@ant-design/icons";
// import { useGetDashboardQuery } from "../../context/service/dashboardApi";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";
// const { MonthPicker } = DatePicker;

// function Home() {
//   const [month, setMonth] = useState("2025-09");
//   const { data, isLoading } = useGetDashboardQuery(month);

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <Spin tip="Yuklanmoqda..." size="large" />
//       </div>
//     );
//   }

//   const dashboard = data?.innerData || {};
//   console.log(dashboard);

//   const cards = [
//     {
//       title: "Oylik Harajatlar",
//       value: dashboard?.expenses?.chiqim?.toLocaleString() || 0,
//       color: "#ff4d4f",
//       icon: <ArrowDownOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, #ff4d4f, #ff7875)",
//     },
//     {
//       title: "Oylik Kirim",
//       value: dashboard?.expenses?.kirim?.toLocaleString() || 0,
//       color: "#52c41a",
//       icon: <ArrowUpOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, #52c41a, #95de64)",
//     },
//     {
//       title: "ombordagi mahsulotlar narxi",
//       value: dashboard?.totalStockValue?.toLocaleString() || 0,
//       color: "#52c41a",
//       icon: <ArrowUpOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, green, greenyellow)",
//     },
//     {
//       title: "Oylik Savdo",
//       value: dashboard?.sales?.totalSales?.toLocaleString() || 0,
//       color: "#1890ff",
//       icon: <ShoppingCartOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, #1890ff, #69c0ff)",
//     },
//     {
//       title: "Oylik Qarzdorlik",
//       value: dashboard?.debts?.toLocaleString() || 0,
//       color: "#fa8c16",
//       icon: <WarningOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, #fa8c16, #ffc069)",
//     },
//     {
//       title: "Oylik Qarzdorlik",
//       value: dashboard?.agentsDebt?.toLocaleString() || 0,
//       color: "#fa8c16",
//       icon: <WarningOutlined style={{ fontSize: 24, color: "#fff" }} />,
//       gradient: "linear-gradient(135deg, #fa1616ff, #ff6e69ff)",
//     },
//   ];

//   return (
//     <div style={{ padding: "24px" }}>
//       <div style={{ margin: "0 auto" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "24px",
//           }}
//         >
//           <h1
//             style={{ fontSize: "28px", fontWeight: "bold", color: "#1f1f1f" }}
//           >
//             📊 Dashboard
//           </h1>
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <span
//               style={{ fontSize: "14px", fontWeight: "500", color: "#595959" }}
//             >
//               Oyni tanlang:
//             </span>
//             <MonthPicker
//               value={dayjs(month, "YYYY-MM")}
//               onChange={(date) => {
//                 if (date) {
//                   setMonth(date.format("YYYY-MM"));
//                 }
//               }}
//               format="MMMM YYYY" // Sentyabr 2025 ko'rinishida chiqaradi
//               placeholder="Oyni tanlang"
//               style={{ width: "200px" }}
//             />
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//             gap: "16px",
//           }}
//         >
//           {cards.map((card, index) => (
//             <Card
//               key={index}
//               hoverable
//               style={{
//                 borderRadius: "12px",
//                 background: card.gradient,
//                 color: "#fff",
//                 padding: "16px",
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//               }}
//               bodyStyle={{ padding: "16px" }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <div>
//                   <h3
//                     style={{
//                       fontSize: "18px",
//                       fontWeight: "600",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     {card.title}
//                   </h3>
//                   <p
//                     style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}
//                   >
//                     {card.value}{" "}
//                     <span style={{ fontSize: "14px", fontWeight: "normal" }}>
//                       so‘m
//                     </span>
//                   </p>
//                 </div>
//                 <div
//                   style={{
//                     padding: "8px",
//                     background: "rgba(255, 255, 255, 0.2)",
//                     borderRadius: "50%",
//                   }}
//                 >
//                   {card.icon}
//                 </div>
//               </div>
//               <div
//                 style={{ marginTop: "12px", fontSize: "12px", opacity: 0.8 }}
//               >
//                 Oylik statistika
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useMemo } from "react";
import { Card, Spin, DatePicker } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useGetDashboardQuery } from "../../context/service/dashboardApi";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

// Kartalar konfiguratsiyasi
const CARD_CONFIG = [
  {
    key: "expenses",
    title: "Oylik Harajatlar",
    dataPath: (data) => data?.expenses?.chiqim,
    color: "#ff4d4f",
    icon: ArrowDownOutlined,
    gradient: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
    shadowColor: "rgba(255, 77, 79, 0.3)",
  },
  {
    key: "income",
    title: "Oylik Kirim",
    dataPath: (data) => data?.expenses?.kirim,
    color: "#52c41a",
    icon: ArrowUpOutlined,
    gradient: "linear-gradient(135deg, #52c41a 0%, #95de64 100%)",
    shadowColor: "rgba(82, 196, 26, 0.3)",
  },
  {
    key: "stock",
    title: "Ombordagi Mahsulotlar",
    dataPath: (data) => data?.totalStockValue,
    color: "#13c2c2",
    icon: InboxOutlined,
    gradient: "linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)",
    shadowColor: "rgba(19, 194, 194, 0.3)",
  },
  {
    key: "sales",
    title: "Oylik Savdo",
    dataPath: (data) => data?.sales?.totalSales,
    color: "#1890ff",
    icon: ShoppingCartOutlined,
    gradient: "linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)",
    shadowColor: "rgba(24, 144, 255, 0.3)",
  },
  {
    key: "debts",
    title: "Mijozlar Qarzi",
    dataPath: (data) => data?.debts,
    color: "#fa8c16",
    icon: WarningOutlined,
    gradient: "linear-gradient(135deg, #fa8c16 0%, #ffc069 100%)",
    shadowColor: "rgba(250, 140, 22, 0.3)",
  },
  {
    key: "agentsDebt",
    title: "Dastavchiklar Qarzi",
    dataPath: (data) => data?.agentsDebt,
    color: "#f5222d",
    icon: WarningOutlined,
    gradient: "linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)",
    shadowColor: "rgba(245, 34, 45, 0.3)",
  },
];

// Statistika kartasi komponenti
const StatCard = ({ title, value, icon: Icon, gradient, shadowColor }) => (
  <Card
    hoverable
    style={{
      borderRadius: "16px",
      background: gradient,
      border: "none",
      overflow: "hidden",
      position: "relative",
    }}
    bodyStyle={{ padding: 0 }}
  >
    <div style={{ padding: "24px", position: "relative", zIndex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
              marginBottom: "12px",
              letterSpacing: "0.3px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#fff",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {value}
          </p>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "400",
              color: "rgba(255, 255, 255, 0.75)",
              marginTop: "4px",
              display: "inline-block",
            }}
          >
            so'm
          </span>
        </div>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon style={{ fontSize: "28px", color: "#fff" }} />
        </div>
      </div>
      <div
        style={{
          paddingTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "500",
          }}
        >
          📈 Oylik statistika
        </span>
      </div>
    </div>
    {/* Dekorativ element */}
    <div
      style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.1)",
        filter: "blur(40px)",
        zIndex: 0,
      }}
    />
  </Card>
);

function Home() {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const { data, isLoading } = useGetDashboardQuery(month);

  // Kartalar ma'lumotlarini memoizatsiya qilish
  const cards = useMemo(() => {
    const dashboard = data?.innerData || {};
    return CARD_CONFIG.map((config) => ({
      ...config,
      value: (config.dataPath(dashboard) || 0).toLocaleString("uz-UZ"),
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <Spin size="large" />
        <p
          style={{
            marginTop: "16px",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Ma'lumotlar yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fff 0%, #ffffff 100%)",
      }}
    >
      <div>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#262626",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              {/* Xisobotlar */}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                margin: 0,
              }}
            >
              {/* Biznesingiz uchun umumiy ko'rinish */}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 20px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#595959",
              }}
            ></span>
            <MonthPicker
              value={dayjs(month, "YYYY-MM")}
              onChange={(date) => {
                if (date) {
                  setMonth(date.format("YYYY-MM"));
                }
              }}
              format="MMMM YYYY"
              placeholder="Oyni tanlang"
              style={{ width: "180px" }}
            />
          </div>
        </div>

        {/* Grid kartalar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {cards.map((card) => (
            <StatCard
              key={card.key}
              title={card.title}
              value={card.value}
              icon={card.icon}
              gradient={card.gradient}
              shadowColor={card.shadowColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
