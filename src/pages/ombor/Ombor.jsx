import React, { useState } from "react";
import { Button, Modal, Form, Input, Table, Space } from "antd";
import {
  useCreateOmborMutation,
  useGetOmborQuery,
  useUpdateOmborMutation,
} from "../../context/service/omborApi";
import { useGetAllQuery } from "../../context/service/supplierApi";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
const { Option } = Select;
import { toast } from "react-toastify";

function Ombor() {
  const [createOmbor] = useCreateOmborMutation();
  const [updateOmbor] = useUpdateOmborMutation();
  const { data } = useGetOmborQuery();
  const { data: suppliersData } = useGetAllQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOmbor, setSelectedOmbor] = useState(null);
  const [form] = Form.useForm();
  const [isNewSupplier, setIsNewSupplier] = useState(false);

  const [searchText, setSearchText] = useState("");

  const omborItems = data?.innerData || [];

  const filteredOmborItems = omborItems.filter((item) =>
    item.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Nomi", dataIndex: "title", key: "title" },
    { title: "Miqdori", dataIndex: "quantity", key: "quantity" },
    { title: "Narxi", dataIndex: "price", key: "price" },
    {
      title: "Umumiy summa",
      render: (_, record) => record.quantity * record.price,
    },
    {
      title: "Taminotchi",
      dataIndex: ["supplier", "fullname"],
      key: "supplier",
      render: (v) => v || "-",
    },
    { title: "Telefon", dataIndex: ["supplier", "phone"], key: "phone" },
  ];

  const onFinish = async (values) => {
    try {
      const products = values.products.map((p) => ({
        ...p,
        total: p.quantity * p.price,
      }));
      const totalPrice = products.reduce((sum, p) => sum + p.total, 0);

      let supplierPayload;
      if (isNewSupplier) {
        supplierPayload = {
          fullname: values.newSupplier,
          phone: values.newSupplierPhone || "",
        };
      } else {
        supplierPayload = { _id: values.supplierId };
      }

      const payload = {
        supplier: supplierPayload,
        products,
        totalPrice,
        paidAmount: values.paidAmount,
      };

      if (isEditMode) {
        await updateOmbor({ id: selectedOmbor._id, ...payload }).unwrap();
      } else {
        await createOmbor(payload).unwrap();
      }

      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setSelectedOmbor(null);
      setIsNewSupplier(false);
      toast.success("Muvaffaqiyatli amalga oshirildi");
    } catch (error) {
      toast.error(error?.data?.message || "Xatolik yuz berdi");
    }
  };

  // ✅ Barcha productsni kuzatamiz
  const products = Form.useWatch("products", form) || [];
  const paidAmount = Form.useWatch("paidAmount", form) || 0;

  // ✅ Har bir mahsulotning jami narxini hisoblash
  const productTotals = products.map((p) => {
    const price = Number(p?.price) || 0;
    const qty = Number(p?.quantity) || 0;
    return price * qty;
  });

  // ✅ Barcha mahsulotlarning umumiy summasi
  const umumiySumma = productTotals.reduce((sum, total) => sum + total, 0);

  // ✅ Qarz summasi
  const qarzSumma = umumiySumma - Number(paidAmount);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
          gap: 10,
          alignItems: "center",
        }}
        className="omborHeader"
      >
        <h3>Ombor</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <Input.Search
            placeholder="Mahsulot nomi bo'yicha qidirish"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Yangi zakaz
          </Button>
        </div>
      </div>

      <Modal
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedOmbor(null);
          form.resetFields();
          setIsNewSupplier(false);
        }}
        open={isModalOpen}
        title={isEditMode ? "Zakazni tahrirlash" : "Yangi zakaz"}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ paidAmount: 0 }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {!isNewSupplier ? (
              <Form.Item
                label="Taminotchi"
                name="supplierId"
                rules={[{ required: true, message: "Taminotchini tanlang" }]}
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="Taminotchini tanlang"
                  showSearch
                  allowClear
                >
                  {suppliersData?.innerData?.map((s) => (
                    <Option key={s._id} value={s._id}>
                      {s.fullname} ({s.phone || "—"})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  label="Yangi taminotchi ismi"
                  name="newSupplier"
                  rules={[{ required: true, message: "Ismni kiriting" }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Ism" />
                </Form.Item>
                <Form.Item
                  label="Telefon"
                  name="newSupplierPhone"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Telefon raqami (ixtiyoriy)" />
                </Form.Item>
              </>
            )}

            <Button
              type="primary"
              onClick={() => setIsNewSupplier(!isNewSupplier)}
            >
              {isNewSupplier ? "tanlash" : "Yangi qo'shish"}
            </Button>
          </div>

          {/* Products list */}
          <Form.List
            name="products"
            rules={[{ required: true, message: "Kamida 1 mahsulot kiriting" }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      rules={[
                        { required: true, message: "Mahsulot nomi kerak" },
                      ]}
                    >
                      <Input placeholder="Mahsulot nomi" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Miqdor kerak" }]}
                    >
                      <Input type="number" placeholder="Miqdor" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      rules={[{ required: true, message: "Narx kerak" }]}
                    >
                      <Input type="number" placeholder="Narx" />
                    </Form.Item>
                    <p style={{ minWidth: 120, fontWeight: 500 }}>
                      Jami: {(productTotals[name] || 0).toLocaleString()} so'm
                    </p>
                    <MinusCircleOutlined
                      style={{ color: "red" }}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Mahsulot qo'shish
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            label="To'langan summa"
            name="paidAmount"
            rules={[{ required: true, message: "To'langan summani kiriting" }]}
          >
            <Input type="number" placeholder="To'langan summa" />
          </Form.Item>

          {/* ✅ Jami hisob-kitob */}
          <div
            style={{
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong>Jami mahsulotlar summasi:</strong>
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                {umumiySumma.toLocaleString()} so'm
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong>To'langan summa:</strong>
              <span>{Number(paidAmount).toLocaleString()} so'm</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 8,
                borderTop: "2px solid #ddd",
              }}
            >
              <strong>Qarz:</strong>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: qarzSumma > 0 ? "#ff4d4f" : "#52c41a",
                }}
              >
                {qarzSumma.toLocaleString()} so'm
              </span>
            </div>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        size="small"
        columns={columns}
        dataSource={filteredOmborItems}
        rowKey="_id"
      />
    </div>
  );
}

export default Ombor; // import React, { useState } from "react";
// import { Button, Modal, Form, Input, Table, Space } from "antd";
// import {
//   useCreateOmborMutation,
//   useGetOmborQuery,
//   useUpdateOmborMutation,
// } from "../../context/service/omborApi";
// import { useGetAllQuery } from "../../context/service/supplierApi";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { Select } from "antd";
// const { Option } = Select;
// import { toast } from "react-toastify";

// function Ombor() {
//   const [createOmbor] = useCreateOmborMutation();
//   const [updateOmbor] = useUpdateOmborMutation();
//   const { data } = useGetOmborQuery();
//   const { data: suppliersData } = useGetAllQuery();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedOmbor, setSelectedOmbor] = useState(null);
//   const [form] = Form.useForm();
//   const [isNewSupplier, setIsNewSupplier] = useState(false);

//   // ✅ Search state
//   const [searchText, setSearchText] = useState("");

//   const omborItems = data?.innerData || [];

//   // ✅ Filterlangan data
//   const filteredOmborItems = omborItems.filter((item) =>
//     item.title?.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const columns = [
//     { title: "Nomi", dataIndex: "title", key: "title" },
//     { title: "Miqdori", dataIndex: "quantity", key: "quantity" },
//     { title: "Narxi", dataIndex: "price", key: "price" },
//     {
//       title: "Umumiy summa",
//       render: (_, record) => record.quantity * record.price,
//     },
//     {
//       title: "Taminotchi",
//       dataIndex: ["supplier", "fullname"],
//       key: "supplier",
//       render: (v) => v || "-",
//     },
//     { title: "Telefon", dataIndex: ["supplier", "phone"], key: "phone" },
//   ];

//   const onFinish = async (values) => {
//     try {
//       const products = values.products.map((p) => ({
//         ...p,
//         total: p.quantity * p.price,
//       }));
//       const totalPrice = products.reduce((sum, p) => sum + p.total, 0);

//       let supplierPayload;
//       if (isNewSupplier) {
//         supplierPayload = {
//           fullname: values.newSupplier,
//           phone: values.newSupplierPhone || "",
//         };
//       } else {
//         supplierPayload = { _id: values.supplierId };
//       }

//       const payload = {
//         supplier: supplierPayload,
//         products,
//         totalPrice,
//         paidAmount: values.paidAmount,
//       };

//       if (isEditMode) {
//         await updateOmbor({ id: selectedOmbor._id, ...payload }).unwrap();
//       } else {
//         await createOmbor(payload).unwrap();
//       }

//       setIsModalOpen(false);
//       form.resetFields();
//       setIsEditMode(false);
//       setSelectedOmbor(null);
//       setIsNewSupplier(false);
//       toast.success("Muvaffaqiyatli amalga oshirildi");
//     } catch (error) {
//       toast.error(error?.data?.message || "Xatolik yuz berdi");
//     }
//   };

//   // ✅ Barcha productsni kuzatamiz (return dan tepada, to‘g‘ri joyda)
//   const products = Form.useWatch("products", form) || [];

//   // ✅ Umumiy summa
//   const umumiySumma = products.reduce((sum, p) => {
//     const price = Number(p?.price) || 0;
//     const qty = Number(p?.quantity) || 0;
//     return sum + price * qty;
//   }, 0);

//   return (
//     <div>
//       {/* ✅ Header + Search */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: 10,
//           gap: 10,
//           alignItems: "center",
//         }}
//         className="omborHeader"
//       >
//         <h3>Ombor</h3>
//         <div style={{ display: "flex", gap: 10 }}>
//           <Input.Search
//             placeholder="Mahsulot nomi bo‘yicha qidirish"
//             allowClear
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 250 }}
//           />
//           <Button type="primary" onClick={() => setIsModalOpen(true)}>
//             Yangi zakaz
//           </Button>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal
//         onCancel={() => {
//           setIsModalOpen(false);
//           setIsEditMode(false);
//           setSelectedOmbor(null);
//           form.resetFields();
//           setIsNewSupplier(false);
//         }}
//         open={isModalOpen}
//         title={isEditMode ? "Zakazni tahrirlash" : "Yangi zakaz"}
//         footer={null}
//         width={800}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           initialValues={{ paidAmount: 0 }}
//         >
//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             {!isNewSupplier ? (
//               <Form.Item
//                 label="Taminotchi"
//                 name="supplierId"
//                 rules={[{ required: true, message: "Taminotchini tanlang" }]}
//                 style={{ flex: 1 }}
//               >
//                 <Select
//                   placeholder="Taminotchini tanlang"
//                   showSearch
//                   allowClear
//                 >
//                   {suppliersData?.innerData?.map((s) => (
//                     <Option key={s._id} value={s._id}>
//                       {s.fullname} ({s.phone || "—"})
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             ) : (
//               <>
//                 <Form.Item
//                   label="Yangi taminotchi ismi"
//                   name="newSupplier"
//                   rules={[{ required: true, message: "Ismni kiriting" }]}
//                   style={{ flex: 1 }}
//                 >
//                   <Input placeholder="Ism" />
//                 </Form.Item>
//                 <Form.Item
//                   label="Telefon"
//                   name="newSupplierPhone"
//                   style={{ flex: 1 }}
//                 >
//                   <Input placeholder="Telefon raqami (ixtiyoriy)" />
//                 </Form.Item>
//               </>
//             )}

//             <Button
//               type="primary"
//               onClick={() => setIsNewSupplier(!isNewSupplier)}
//             >
//               {isNewSupplier ? "tanlash" : "Yangi qo‘shish"}
//             </Button>
//           </div>

//           {/* Products list */}
//           <Form.List
//             name="products"
//             rules={[{ required: true, message: "Kamida 1 mahsulot kiriting" }]}
//           >
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Space
//                     key={key}
//                     style={{ display: "flex", marginBottom: 8 }}
//                     align="baseline"
//                   >
//                     <Form.Item
//                       {...restField}
//                       name={[name, "title"]}
//                       rules={[
//                         { required: true, message: "Mahsulot nomi kerak" },
//                       ]}
//                     >
//                       <Input placeholder="Mahsulot nomi" />
//                     </Form.Item>
//                     <Form.Item
//                       {...restField}
//                       name={[name, "quantity"]}
//                       rules={[{ required: true, message: "Miqdor kerak" }]}
//                     >
//                       <Input type="number" placeholder="Miqdor" />
//                     </Form.Item>
//                     <Form.Item
//                       {...restField}
//                       name={[name, "price"]}
//                       rules={[{ required: true, message: "Narx kerak" }]}
//                     >
//                       <Input type="number" placeholder="Narx" />
//                     </Form.Item>
//                     <p>jami narx: {umumiySumma.toLocaleString()} </p>
//                     <MinusCircleOutlined onClick={() => remove(name)} />
//                   </Space>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     icon={<PlusOutlined />}
//                   >
//                     Mahsulot qo'shish
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>

//           <Form.Item
//             label="To'langan summa"
//             name="paidAmount"
//             rules={[{ required: true, message: "To'langan summani kiriting" }]}
//           >
//             <Input type="number" placeholder="To'langan summa" />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Saqlash
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* ✅ Jadval */}
//       <Table
//         size="small"
//         columns={columns}
//         dataSource={filteredOmborItems}
//         rowKey="_id"
//       />
//     </div>
//   );
// }

// export default Ombor;
