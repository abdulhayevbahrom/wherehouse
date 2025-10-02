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

  console.log(debtorsData);

  let debtors = debtorsData?.innerData || [];

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payForm] = Form.useForm();

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

  // // Faqat qarzdorlarni olish
  // const debtors = transactionsData?.innerData?.filter(
  //   (t) => t.remainingDebt > 0
  // );

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
    {
      title: "Jami",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (v, record) =>
        record.products?.reduce((acc, p) => acc + p.price * p.quantity, 0),
    },
    {
      title: "Qoldiq qarz",
      dataIndex: "remainingDebt",
      key: "remainingDebt",
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
            setSelectedProducts(record.products || []);
            setIsProductsModalOpen(true);
          }}
        >
          Ko‘rish
        </Button>
      ),
    },
    {
      title: "To‘lov",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedTransaction(record);
            setIsPayModalOpen(true);
          }}
        >
          To‘lash
        </Button>
      ),
    },
  ];

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
            label={`To‘lov summasi (Qolgan qarz: ${
              selectedTransaction?.remainingDebt || 0
            })`}
            name="paymentAmount"
            rules={[
              { required: true, message: "To‘lov summasini kiriting" },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (value > selectedTransaction?.remainingDebt) {
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
              max={selectedTransaction?.remainingDebt || 0}
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
