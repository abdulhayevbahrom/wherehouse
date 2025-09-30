import React, { useState } from "react";
import { useGetAgentsQuery } from "../../context/service/agentApi";
import {
  useGiveProductsToAgentMutation,
  useGetAllTransactionsQuery,
  usePayDebtMutation,
} from "../../context/service/transactionApi";
import { useGetOmborQuery } from "../../context/service/omborApi";
import { Button, Form, Input, Select, Space, Modal, Table } from "antd";
import {
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Option } = Select;

function Sale() {
  const { data: agentsData } = useGetAgentsQuery();
  const { data: omborData } = useGetOmborQuery();
  const [giveProductsToAgent] = useGiveProductsToAgentMutation();
  const [payDebt] = usePayDebtMutation();
  const { data: transactionsData } = useGetAllTransactionsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payForm] = Form.useForm();

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handlePayDebt = async (values) => {
    try {
      await payDebt({
        transactionId: selectedTransaction._id,
        paymentAmount: Number(values.paymentAmount),
      }).unwrap();

      setIsPayModalOpen(false);
      payForm.resetFields();
      toast.success("To'lov muvaffaqiyatli amalga oshirildi");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        agentId: values.agentId,
        paidAmount: values.paidAmount,
        products: values.products.map((p) => ({
          productId: p.productId,
          quantity: Number(p.quantity),
          salePrice: Number(p.salePrice), // yangi qo‘shildi
        })),
      };

      await giveProductsToAgent(payload).unwrap();
      form.resetFields();
      setIsModalOpen(false);
      toast.success("Sotish muvaffaqiyatli amalga oshirildi");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Agent",
      dataIndex: ["agent", "fullname"],
      key: "fullname",
    },

    {
      title: "Umumiy summa",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Qoldiq qarz",
      dataIndex: "remainingDebt",
      key: "remainingDebt",
    },

    // korish
    {
      title: "Mahsulotlar",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedProducts(record.products || []);
              setIsProductsModalOpen(true);
            }}
          >
            Ko‘rish
          </Button>
        );
      },
    },

    // {
    //   title: "Tolo'v",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button
    //       disabled={record.remainingDebt === 0}
    //       type="primary"
    //       onClick={() => {
    //         setSelectedTransaction(record);
    //         setIsPayModalOpen(true);
    //       }}
    //     >
    //       To'lash
    //     </Button>
    //   ),
    // },

    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (_, record) => new Date(record.date).toLocaleDateString(),
    },
  ];

  console.log(transactionsData?.innerData);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
        className="omborHeader"
      >
        <h3>Sotuv tarixi</h3>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Sotish
        </Button>
      </div>
      <Modal
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedOmbor(null);
          form.resetFields();
        }}
        open={isModalOpen}
        title={"Sotish"}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Agent tanlash */}
          <Form.Item
            label="Agentni tanlang"
            name="agentId"
            rules={[{ required: true, message: "Agentni tanlang" }]}
          >
            <Select placeholder="Agentni tanlang">
              {agentsData?.innerData?.map((a) => (
                <Option key={a._id} value={a._id}>
                  {a.fullname} ({a.phone || "—"})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Mahsulotlar ro'yxati */}
          <Form.List
            name="products"
            rules={[
              { required: true, message: "Kamida bitta mahsulot qo'shing" },
            ]}
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
                      name={[name, "productId"]}
                      rules={[
                        { required: true, message: "Mahsulotni tanlang" },
                      ]}
                    >
                      <Select
                        placeholder="Mahsulot tanlang"
                        style={{ width: 200 }}
                      >
                        {omborData?.innerData?.map((p) => (
                          <Option key={p._id} value={p._id}>
                            {p.title} (Omborda: {p.quantity})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Miqdor kiriting" }]}
                    >
                      <Input type="number" placeholder="Miqdor" />
                    </Form.Item>

                    {/* yangi qo‘shiladi */}
                    <Form.Item
                      {...restField}
                      name={[name, "salePrice"]}
                      rules={[
                        { required: true, message: "Sotuv narxini kiriting" },
                      ]}
                    >
                      <Input type="number" placeholder="Sotuv narxi" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
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

          {/* To'langan summa */}
          <Form.Item
            label="To'langan summa"
            name="paidAmount"
            rules={[{ required: true, message: "To'lov summasini kiriting" }]}
          >
            <Input type="number" placeholder="To'langan summa" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isPayModalOpen}
        title="To'lov qilish"
        onCancel={() => {
          setIsPayModalOpen(false);
          payForm.resetFields();
        }}
        footer={null}
      >
        <Form form={payForm} layout="vertical" onFinish={handlePayDebt}>
          <Form.Item
            label={`To'lov summasi (Qolgan qarz: ${
              selectedTransaction?.remainingDebt || 0
            })`}
            name="paymentAmount"
            rules={[
              { required: true, message: "To'lov summasini kiriting" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (value > selectedTransaction?.remainingDebt) {
                    return Promise.reject(
                      new Error(
                        "Qarz summasidan katta to'lov kiritib bo'lmaydi!"
                      )
                    );
                  }
                  if (value <= 0) {
                    return Promise.reject(
                      new Error("Summani to'g'ri kiriting!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              type="number"
              placeholder="Summani kiriting"
              max={selectedTransaction?.remainingDebt || 0} // input cheklovi
              min={1}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              To'lash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isProductsModalOpen}
        title="Transaction mahsulotlari"
        footer={null}
        onCancel={() => {
          setIsProductsModalOpen(false);
          setSelectedProducts([]);
        }}
        width={700}
      >
        <Table
          rowKey="_id"
          dataSource={selectedProducts}
          pagination={false}
          columns={[
            {
              title: "Nomi",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Soni",
              dataIndex: "quantity",
              key: "quantity",
            },
            {
              title: "Narxi",
              dataIndex: "price",
              key: "price",
            },
            {
              title: "Jami",
              dataIndex: "totalPrice",
              key: "totalPrice",
            },
          ]}
        />
      </Modal>

      <Table
        rowKey={"_id"}
        dataSource={transactionsData?.innerData || []}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}

export default Sale;

// import React, { useState, useMemo } from "react";
// import {
//   useGetAllTransactionsQuery,
//   useGiveProductsToAgentMutation,
// } from "../../context/service/transactionApi";
// import { useGetAgentsQuery } from "../../context/service/agentApi";
// import { Button, Form, Input, Modal, Table, Select, Space } from "antd";
// import {
//   EyeOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { useGetOmborQuery } from "../../context/service/omborApi";
// const { Option } = Select;
// import { toast } from "react-toastify";
// function Sale() {
//   const { data: agentsData } = useGetAgentsQuery();
//   const { data: omborData } = useGetOmborQuery();
//   const [giveProductsToAgent] = useGiveProductsToAgentMutation();
//   const [form] = Form.useForm();
//   const { data: transactionsData } = useGetAllTransactionsQuery();
//   const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // Qidiruvni hisoblash (memoized)
//   const filteredData = useMemo(() => {
//     if (!transactionsData?.innerData) return [];
//     return transactionsData.innerData.filter((t) => {
//       const agentName = t.agent?.fullname?.toLowerCase() || "";
//       const productsTitles =
//         t.products?.map((p) => p.title?.toLowerCase()).join(" ") || "";

//       return (
//         agentName.includes(searchText.toLowerCase()) ||
//         productsTitles.includes(searchText.toLowerCase())
//       );
//     });
//   }, [transactionsData, searchText]);

//   const columns = [
//     {
//       title: "Agent",
//       dataIndex: ["agent", "fullname"],
//       key: "fullname",
//     },
//     {
//       title: "Umumiy summa",
//       dataIndex: "paidAmount",
//       key: "paidAmount",
//     },
//     {
//       title: "Qoldiq qarz",
//       dataIndex: "remainingDebt",
//       key: "remainingDebt",
//     },
//     {
//       title: "Mahsulotlar",
//       render: (_, record) => (
//         <Button
//           type="primary"
//           icon={<EyeOutlined />}
//           onClick={() => {
//             setSelectedProducts(record.products || []);
//             setIsProductsModalOpen(true);
//           }}
//         >
//           Ko‘rish
//         </Button>
//       ),
//     },
//     {
//       title: "Sana",
//       dataIndex: "date",
//       key: "date",
//       render: (_, record) => new Date(record.date).toLocaleDateString(),
//     },
//   ];

//   const onFinish = async (values) => {
//     try {
//       const payload = {
//         agentId: values.agentId,
//         paidAmount: values.paidAmount,
//         products: values.products.map((p) => ({
//           productId: p.productId,
//           quantity: Number(p.quantity),
//           salePrice: Number(p.salePrice), // yangi qo‘shildi
//         })),
//       };

//       await giveProductsToAgent(payload).unwrap();
//       form.resetFields();
//       setIsModalOpen(false);
//       toast.success("Sotish muvaffaqiyatli amalga oshirildi");
//     } catch (err) {
//       toast.error(err?.data?.message || "Xatolik yuz berdi");
//     }
//   };

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: 10,
//         }}
//       >
//         <h3>Sotuv tarixi</h3>
//         <div style={{ display: "flex", gap: 10 }}>
//           <Input
//             placeholder="Agent yoki mahsulot bo‘yicha qidirish..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 300 }}
//           />
//           <Button type="primary" onClick={() => setIsModalOpen(true)}>
//             Sotish
//           </Button>
//         </div>
//       </div>

//       <Modal
//         onCancel={() => {
//           setIsModalOpen(false);
//           setSelectedOmbor(null);
//           form.resetFields();
//         }}
//         open={isModalOpen}
//         title={"Sotish"}
//         footer={null}
//         width={800}
//       >
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           {/* Agent tanlash */}
//           <Form.Item
//             label="Agentni tanlang"
//             name="agentId"
//             rules={[{ required: true, message: "Agentni tanlang" }]}
//           >
//             <Select placeholder="Agentni tanlang">
//               {agentsData?.innerData?.map((a) => (
//                 <Option key={a._id} value={a._id}>
//                   {a.fullname} ({a.phone || "—"})
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Mahsulotlar ro'yxati */}
//           <Form.List
//             name="products"
//             rules={[
//               { required: true, message: "Kamida bitta mahsulot qo'shing" },
//             ]}
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
//                       name={[name, "productId"]}
//                       rules={[
//                         { required: true, message: "Mahsulotni tanlang" },
//                       ]}
//                     >
//                       <Select
//                         placeholder="Mahsulot tanlang"
//                         style={{ width: 200 }}
//                       >
//                         {omborData?.innerData?.map((p) => (
//                           <Option key={p._id} value={p._id}>
//                             {p.title} (Omborda: {p.quantity})
//                           </Option>
//                         ))}
//                       </Select>
//                     </Form.Item>

//                     <Form.Item
//                       {...restField}
//                       name={[name, "quantity"]}
//                       rules={[{ required: true, message: "Miqdor kiriting" }]}
//                     >
//                       <Input type="number" placeholder="Miqdor" />
//                     </Form.Item>

//                     {/* yangi qo‘shiladi */}
//                     <Form.Item
//                       {...restField}
//                       name={[name, "salePrice"]}
//                       rules={[
//                         { required: true, message: "Sotuv narxini kiriting" },
//                       ]}
//                     >
//                       <Input type="number" placeholder="Sotuv narxi" />
//                     </Form.Item>

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

//           {/* To'langan summa */}
//           <Form.Item
//             label="To'langan summa"
//             name="paidAmount"
//             rules={[{ required: true, message: "To'lov summasini kiriting" }]}
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

//       <Table
//         rowKey="_id"
//         dataSource={filteredData}
//         columns={columns}
//         pagination={false}
//       />

//       <Modal
//         open={isProductsModalOpen}
//         title="Transaction mahsulotlari"
//         footer={null}
//         onCancel={() => {
//           setIsProductsModalOpen(false);
//           setSelectedProducts([]);
//         }}
//         width={700}
//       >
//         <Table
//           rowKey="_id"
//           dataSource={selectedProducts}
//           pagination={false}
//           columns={[
//             {
//               title: "Nomi",
//               dataIndex: "title",
//               key: "title",
//             },
//             {
//               title: "Soni",
//               dataIndex: "quantity",
//               key: "quantity",
//             },
//             {
//               title: "Narxi",
//               dataIndex: "price",
//               key: "price",
//             },
//             {
//               title: "Jami",
//               dataIndex: "totalPrice",
//               key: "totalPrice",
//             },
//           ]}
//         />
//       </Modal>
//     </div>
//   );
// }

// export default Sale;
