import React, { useState } from "react";
import {
  useGetAllTransactionsQuery,
  usePayDebtMutation,
  useGetDebtorsQuery,
} from "../../context/service/transactionApi";
import { Button, Modal, Table, Form, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Debtors() {
  const { data: debtorsData } = useGetDebtorsQuery();
  const { data: transactionsData } = useGetAllTransactionsQuery();
  const [payDebt] = usePayDebtMutation();

  let debtors = debtorsData?.innerData || [];

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payForm] = Form.useForm();
  console.log(">?selectedTransaction", selectedTransaction);

  // To'lov qilish
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

  const columns = [
    {
      title: "Agent",
      dataIndex: ["fullname"],
      key: "fullname",
    },
    {
      title: "Qarz (soldo)",
      render: (v, record) => record?.initialDebt || 0,
    },
    // {
    //   title: "Jami",
    //   dataIndex: "paidAmount",
    //   key: "paidAmount",
    //   render: (_, record) =>
    //     record?.transactions?.reduce((total, t) => {
    //       const sumProducts =
    //         t.products?.reduce((acc, p) => acc + p.price * p.quantity, 0) || 0;
    //       return total + sumProducts;
    //     }, 0),
    // },

    {
      title: "Qoldiq qarz",
      dataIndex: "totalRemainingDebt",
      key: "totalRemainingDebt",
    },
    // umumiy qarz
    {
      title: "Umumiy qarz",
      render: (v, record) => record?.totalRemainingDebt + record?.initialDebt,
    },
    {
      title: "Mahsulotlar",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedProducts(record.transactions || []);
            setIsProductsModalOpen(true);
          }}
        >
          Ko‘rish
        </Button>
      ),
    },
    // {
    //   title: "To‘lov",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         console.log("record", record);

    //         setSelectedTransaction(record.transactions);
    //         setIsPayModalOpen(true);
    //       }}
    //     >
    //       To‘lash
    //     </Button>
    //   ),
    // },
  ];

  let debt = selectedTransaction?.remainingDebt || 0;

  return (
    <div>
      <h3 style={{ padding: "10px" }}>Qarzdorlar ro‘yxati</h3>

      {/* Qarzdorlar jadvali */}
      <Table
        rowKey="_id"
        dataSource={debtors || []}
        columns={columns}
        pagination={false}
      />

      {/* Mahsulotlar modal */}
      <Modal
        open={isProductsModalOpen}
        title="Sotuv malumotlari"
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
              dataIndex: ["products", "title"],
              key: "title",
            },
            {
              title: "Soni",
              dataIndex: ["products", "quantity"],
              key: "quantity",
            },
            {
              title: "Narxi",
              dataIndex: ["products", "price"],
              key: "price",
            },
            {
              title: "Jami",
              dataIndex: ["products", "totalPrice"],
              key: "totalPrice",
            },
            {
              title: "Qoldiq qarz",
              dataIndex: "remainingDebt",
              key: "remainingDebt",
              render: (v) => <span style={{ color: "red" }}>{v}</span>,
            },
            {
              title: "Sana",
              dataIndex: "date",
              key: "date",
              render: (v) => {
                const d = new Date(v);
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              },
            },
            {
              title: "To‘lov",
              key: "action",
              render: (_, record) => (
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("record", record);
                    setIsPayModalOpen(true);
                    setSelectedTransaction(record);
                    setIsProductsModalOpen(false);
                    // setIsPayModalOpen(true);
                  }}
                >
                  To‘lash
                </Button>
              ),
            },
          ]}
        />
      </Modal>

      {/* To‘lov modal */}
      <Modal
        open={isPayModalOpen}
        title="To‘lov qilish"
        onCancel={() => {
          setIsPayModalOpen(false);
          payForm.resetFields();
        }}
        footer={null}
      >
        <Form form={payForm} layout="vertical" onFinish={handlePayDebt}>
          <Form.Item
            label={`To‘lov summasi (Qolgan qarz: ${debt})`}
            name="paymentAmount"
            rules={[
              { required: true, message: "To‘lov summasini kiriting" },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (value > debt) {
                    return Promise.reject(
                      new Error(
                        "Qarz summasidan katta to‘lov kiritib bo‘lmaydi!"
                      )
                    );
                  }
                  if (value <= 0) {
                    return Promise.reject(
                      new Error("Summani to‘g‘ri kiriting!")
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
              max={debt || 0}
              min={1}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              To‘lash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Debtors;
