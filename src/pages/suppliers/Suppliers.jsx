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
  console.log(getSupplierSales);
  const {
    data: omborData,
    isFetching,
    refetch,
  } = useGetOmborBySupplierQuery(getSupplierSales, {
    skip: !getSupplierSales,
  });

  console.log("##", supplierDebtData?.innerData);

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
    // {
    //   title: "Qarz (soldo)",
    //   dataIndex: "initialDebt",
    //   key: "initialDebt",
    //   render: (initialDebt) => (
    //     <span
    //       style={{
    //         color: "red",
    //       }}
    //     >
    //       {initialDebt}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Balans",
    //   dataIndex: "balance",
    //   key: "balance",
    //   render: (balance) => (
    //     <span
    //       style={{
    //         color: balance < 0 ? "red" : balance > 0 ? "green" : "gray",
    //       }}
    //     >
    //       {balance}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Holati",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status, record) => {
    //     let color =
    //       status === "qarzdor"
    //         ? "red"
    //         : status === "haqdor"
    //         ? "green"
    //         : "default";
    //     return <Tag color={color}>{status}</Tag>;
    //   },
    // },
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
      title: "amallar",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setOpenEditModal(record);
            form.setFieldsValue(record);
          }}
          icon={<EditOutlined />}
        ></Button>
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
  ];

  const omborColumns = [
    {
      title: "Mahsulot",
      dataIndex: "title",
      key: "title",
      render: (_, record) =>
        record.products.map((p) => <div key={p._id}>{p.title}</div>),
    },
    {
      title: "narxi",
      dataIndex: "price",
      key: "price",
      render: (_, record) =>
        record.products.map((p) => <div key={p._id}>{p.price}</div>),
    },
    {
      title: "Miqdori",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) =>
        record.products.map((p) => <div key={p._id}>{p.quantity}</div>),
    },
    {
      title: "Umumiy summa",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v, record) => v.toLocaleString(),
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
        _id: openEditModal._id,
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

      {/* edit  modal */}
      <Modal
        open={openEditModal}
        setOpen={setOpenEditModal}
        supplier={openEditModal}
        footer={null}
        onCancel={() => setOpenEditModal(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Form.Item name="fullname" label="Ism Familya">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon">
            <Input />
          </Form.Item>
          <Form.Item name="initialDebt" label="Qarz(soldo)">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* edit  modal */}

      {/* Ombor modal */}
      <Modal
        title="Ombor ma’lumotlari"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSupplierId(null);
        }}
        footer={null}
        width={800}
      >
        {isFetching ? (
          <p>Yuklanmoqda...</p>
        ) : (
          <Table
            rowKey="_id"
            columns={omborColumns}
            dataSource={omborData?.innerData || []}
            pagination={false}
          />
        )}
      </Modal>

      {/* To'lov modal */}
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
