// import React, { useState } from "react";
// import { Button, Table, Tag, Modal, Input, message, Form } from "antd";
// import {
//   useUpdateSupplierMutation,
//   useGetSupplierDebtQuery,
//   usePayToSupplierMutation,
// } from "../../context/service/supplierApi";
// import { useGetOmborBySupplierQuery } from "../../context/service/omborApi";
// import { EditOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";

// function Suppliers() {
//   const [form] = Form.useForm();

//   const [updateSupplier] = useUpdateSupplierMutation();
//   const [payToSupplier] = usePayToSupplierMutation();

//   const { data: supplierDebtData } = useGetSupplierDebtQuery();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [supplierId, setSupplierId] = useState(null);
//   const [isPayModalOpen, setIsPayModalOpen] = useState(false);
//   const [payAmount, setPayAmount] = useState("");
//   const [openEditModal, setOpenEditModal] = useState(false);

//   const [getSupplierSales, setGetSupplierSales] = useState(null);
//   const {
//     data: omborData,
//     isFetching,
//     refetch,
//   } = useGetOmborBySupplierQuery(getSupplierSales, {
//     skip: !getSupplierSales,
//   });

//   const suppliers = supplierDebtData?.innerData || [];

//   const handlePayment = async () => {
//     if (!payAmount || isNaN(payAmount)) {
//       return toast.error("To'lov summasini kiriting");
//     }
//     try {
//       await payToSupplier({
//         supplierId: supplierId?.supplierId,
//         amount: Number(payAmount),
//       }).unwrap();

//       toast.success("To'lov muvaffaqiyatli bajarildi");
//       setIsPayModalOpen(false);
//       setPayAmount("");
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Xatolik yuz berdi");
//     }
//   };

//   const columns = [
//     {
//       title: "Ism Familya",
//       dataIndex: "fullname",
//       key: "fullname",
//     },
//     {
//       title: "Telefon",
//       dataIndex: "phone",
//       key: "phone",
//     },
//     {
//       title: "Umumiy qarz",
//       render: (status, record) => {
//         return <span style={{ color: "red" }}>{record?.debt}</span>;
//       },
//     },
//     {
//       title: "Ko'rish",
//       render: (_, record) => (
//         <Button
//           onClick={() => {
//             setGetSupplierSales(record.supplierId);
//             setIsModalOpen(true);
//           }}
//           type="primary"
//         >
//           Ko‘rish
//         </Button>
//       ),
//     },
//     {
//       title: "To'lash",
//       render: (_, record) => (
//         <Button
//           type="primary"
//           onClick={() => {
//             setSupplierId(record);
//             setIsPayModalOpen(true);
//           }}
//         >
//           To‘lov qilish
//         </Button>
//       ),
//     },
//     {
//       title: "amallar",
//       render: (_, record) => (
//         <Button
//           type="primary"
//           onClick={() => {
//             setOpenEditModal(record);
//             form.setFieldsValue(record);
//           }}
//           icon={<EditOutlined />}
//         ></Button>
//       ),
//     },
//   ];

//   const omborColumns = [
//     {
//       title: "Mahsulot",
//       dataIndex: "title",
//       key: "title",
//       render: (_, record) =>
//         record.products.map((p) => <div key={p._id}>{p.title}</div>),
//     },
//     {
//       title: "narxi",
//       dataIndex: "price",
//       key: "price",
//       render: (_, record) =>
//         record.products.map((p) => <div key={p._id}>{p.price}</div>),
//     },
//     {
//       title: "Miqdori",
//       dataIndex: "quantity",
//       key: "quantity",
//       render: (_, record) =>
//         record.products.map((p) => <div key={p._id}>{p.quantity}</div>),
//     },
//     {
//       title: "Umumiy summa",
//       dataIndex: "totalPrice",
//       key: "totalPrice",
//       render: (v, record) => v.toLocaleString(),
//     },
//     {
//       title: "Sana",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => new Date(date).toLocaleDateString("uz-UZ"),
//     },
//   ];

//   const handleUpdate = async (values) => {
//     try {
//       await updateSupplier({
//         _id: openEditModal.supplierId,
//         data: {
//           ...values,
//           initialDebt: Number(values.initialDebt),
//         },
//       }).unwrap();
//       setOpenEditModal(false);
//       form.resetFields();
//       toast.success("Taminotchilar muvaffaqiyatli saqlandi");
//     } catch (err) {
//       toast.error(err?.data?.message || "Xatolik yuz berdi");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h3>Taminotchilardan qarzlar</h3>
//       <Table
//         rowKey="_id"
//         columns={columns}
//         dataSource={[...suppliers]}
//         pagination={false}
//       />

//       {/* edit  modal */}
//       <Modal
//         open={openEditModal}
//         setOpen={setOpenEditModal}
//         supplier={openEditModal}
//         footer={null}
//         onCancel={() => setOpenEditModal(false)}
//         title="Taminotchini tahrirlash"
//       >
//         <Form layout="vertical" form={form} onFinish={handleUpdate}>
//           <Form.Item name="fullname" label="Ism Familya">
//             <Input />
//           </Form.Item>
//           <Form.Item name="phone" label="Telefon">
//             <Input />
//           </Form.Item>
//           <Form.Item name="initialDebt" label="Qarz(soldo)">
//             <Input />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Saqlash
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//       {/* edit  modal */}

//       {/* Ombor modal */}
//       <Modal
//         title="Ombor ma’lumotlari"
//         open={isModalOpen}
//         onCancel={() => {
//           setIsModalOpen(false);
//           setSupplierId(null);
//         }}
//         footer={null}
//         width={800}
//       >
//         {isFetching ? (
//           <p>Yuklanmoqda...</p>
//         ) : (
//           <Table
//             rowKey="_id"
//             columns={omborColumns}
//             dataSource={omborData?.innerData || []}
//             pagination={false}
//           />
//         )}
//       </Modal>

//       {/* To'lov modal */}
//       <Modal
//         title="Qarz to‘lash"
//         open={isPayModalOpen}
//         onCancel={() => setIsPayModalOpen(false)}
//         onOk={handlePayment}
//         okText="To‘lash"
//         cancelText="Bekor qilish"
//       >
//         <p>
//           Qolgan qarz: <b style={{ color: "red" }}>{supplierId?.debt} </b>
//         </p>
//         <Input
//           type="number"
//           placeholder="To'lov summasi"
//           value={payAmount}
//           onChange={(e) => setPayAmount(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// }

// export default Suppliers;

import React, { useState } from "react";
import { Button, Table, Tag, Modal, Input, message, Form } from "antd";
import {
  useUpdateSupplierMutation,
  useGetSupplierDebtQuery,
  usePayToSupplierMutation,
} from "../../context/service/supplierApi";
import { useGetOmborBySupplierQuery } from "../../context/service/omborApi";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Suppliers() {
  const [form] = Form.useForm();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [payToSupplier] = usePayToSupplierMutation();
  const { data: supplierDebtData } = useGetSupplierDebtQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [getSupplierSales, setGetSupplierSales] = useState(null);
  const {
    data: omborData,
    isFetching,
    refetch,
  } = useGetOmborBySupplierQuery(getSupplierSales, {
    skip: !getSupplierSales,
  });

  const suppliers = supplierDebtData?.innerData || [];

  const handlePayment = async () => {
    if (!payAmount || isNaN(payAmount)) {
      return toast.error("To'lov summasini kiriting");
    }
    try {
      await payToSupplier({
        supplierId: supplierId?.supplierId,
        amount: Number(payAmount),
      }).unwrap();
      toast.success("To'lov muvaffaqiyatli bajarildi");
      setIsPayModalOpen(false);
      setPayAmount("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Ism Familya",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Umumiy qarz",
      render: (status, record) => {
        return <span style={{ color: "red" }}>{record?.debt}</span>;
      },
    },
    {
      title: "Ko'rish",
      render: (_, record) => (
        <Button
          onClick={() => {
            setGetSupplierSales(record.supplierId);
            setIsModalOpen(true);
          }}
          type="primary"
        >
          Ko‘rish
        </Button>
      ),
    },
    {
      title: "To'lash",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSupplierId(record);
            setIsPayModalOpen(true);
          }}
        >
          To‘lov qilish
        </Button>
      ),
    },
    {
      title: "Amallar",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            console.log(record);

            setOpenEditModal(record);
            form.setFieldsValue(record);
          }}
          icon={<EditOutlined />}
        ></Button>
      ),
    },
  ];

  const omborColumns = [
    {
      title: "Mahsulot",
      dataIndex: "products",
      key: "title",
      render: (products) =>
        products.map((p) => <div key={p._id}>{p.title}</div>),
    },
    {
      title: "Narxi",
      dataIndex: "products",
      key: "price",
      render: (products) =>
        products.map((p) => <div key={p._id}>{p.price}</div>),
    },
    {
      title: "Miqdori",
      dataIndex: "products",
      key: "quantity",
      render: (products) =>
        products.map((p) => <div key={p._id}>{p.quantity}</div>),
    },
    {
      title: "Umumiy summa",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Sana",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("uz-UZ"),
    },
  ];

  const handleUpdate = async (values) => {
    try {
      await updateSupplier({
        _id: openEditModal.supplierId,
        data: {
          ...values,
          initialDebt: Number(values.initialDebt),
        },
      }).unwrap();
      setOpenEditModal(false);
      form.resetFields();
      toast.success("Taminotchilar muvaffaqiyatli saqlandi");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Taminotchilardan qarzlar</h3>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...suppliers]}
        pagination={false}
      />

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        title="Taminotchini tahrirlash"
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Form.Item name="fullname" label="Ism Familya">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon">
            <Input />
          </Form.Item>
          <Form.Item name="initialDebt" label="Qarz(astatka)">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Ombor Modal */}
      <Modal
        title="Ombor ma’lumotlari"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSupplierId(null);
        }}
        footer={null}
        width={1000} // Increased modal width
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Scrollable modal body
      >
        {isFetching ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Yuklanmoqda...</p>
        ) : (
          <Table
            rowKey="_id"
            columns={omborColumns}
            dataSource={omborData?.innerData || []}
            pagination={false}
            scroll={{ x: 800 }} // Enable horizontal scrolling for wide tables
          />
        )}
      </Modal>

      {/* To'lov Modal */}
      <Modal
        title="Qarz to‘lash"
        open={isPayModalOpen}
        onCancel={() => setIsPayModalOpen(false)}
        onOk={handlePayment}
        okText="To‘lash"
        cancelText="Bekor qilish"
      >
        <p>
          Qolgan qarz: <b style={{ color: "red" }}>{supplierId?.debt} </b>
        </p>
        <Input
          type="number"
          placeholder="To'lov summasi"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Suppliers;
