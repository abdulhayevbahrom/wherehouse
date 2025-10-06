import React, { useState } from "react";
import {
  usePayDebtMutation,
  useGetDebtorsQuery,
  useGetAgentDebtsQuery,
} from "../../context/service/transactionApi";
import { Button, Modal, Table, Form, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Debtors() {
  const { data: debtorsData } = useGetDebtorsQuery();
  const [payDebt] = usePayDebtMutation();

  let debtors = debtorsData?.innerData || [];
  console.log(debtors);

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedProducts] = useState([]);
  const { data: agentDebtData } = useGetAgentDebtsQuery(selectedAgentId, {
    skip: !selectedAgentId,
  });
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payForm] = Form.useForm();

  const columns = [
    {
      title: "Agent",
      dataIndex: ["fullname"],
      key: "fullname",
    },
    {
      title: "Telefon",
      render: (v, record) => record?.phone || 0,
    },
    {
      title: "Qarz",
      render: (v, record) => record?.debt || 0,
    },
    {
      title: "Mahsulotlar",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedProducts(record?.agentId);
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

  // To'lov qilish
  const handlePayDebt = async (values) => {
    try {
      await payDebt({
        agentId: selectedTransaction.agentId,
        amount: Number(values.paymentAmount),
      }).unwrap();

      setIsPayModalOpen(false);
      payForm.resetFields();
      toast.success("To'lov muvaffaqiyatli amalga oshirildi");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  let debt = selectedTransaction?.debt || 0;

  return (
    <div>
      <h3 style={{ padding: "10px" }}>Qarzdorlar ro‘yxati</h3>

      {/* Qarzdorlar jadvali */}
      <Table
        rowKey="_id"
        dataSource={debtors || []}
        columns={columns}
        pagination={false}
        size="small"
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
        width={1000} // Increased modal width
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Scrollable modal body
      >
        <Table
          rowKey="_id"
          dataSource={agentDebtData?.innerData || []}
          pagination={false}
          columns={[
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
              dataIndex: "products",
              key: "products",
              render: (products) =>
                products?.reduce(
                  (total, p) => total + p.price * p.quantity,
                  0
                ) || 0,
            },
            {
              title: "Sana",
              dataIndex: "date",
              key: "date",
              render: (date) => new Date(date).toLocaleDateString("uz-UZ"),
            },
          ]}
          size="small"
          scroll={{ x: 800 }}
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
            label={`Qolgan qarz: ${debt}`}
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
