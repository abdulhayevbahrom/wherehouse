import React from "react";
import { Button, Table, Tag, Modal, Input, message, Form } from "antd";
import {
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../../context/service/supplierApi";
import {
  useGetOmborBySupplierQuery,
  usePaySupplierDebtMutation,
} from "../../context/service/omborApi";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Suppliers() {
  const [form] = Form.useForm();
  const [updateSupplier] = useUpdateSupplierMutation();
  const { data, isLoading, isError } = useGetSuppliersQuery();
  const [supplierId, setSupplierId] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [selectedOmbor, setSelectedOmbor] = React.useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [payAmount, setPayAmount] = React.useState("");

  const [paySupplierDebt, { isLoading: isPaying }] =
    usePaySupplierDebtMutation();

  const {
    data: omborData,
    isFetching,
    refetch,
  } = useGetOmborBySupplierQuery(supplierId, {
    skip: !supplierId,
  });

  const [openEditModal, setOpenEditModal] = React.useState(false);

  const suppliers = data?.innerData || [];

  const handlePayment = async () => {
    if (!payAmount || isNaN(payAmount)) {
      return message.error("To'lov summasini kiriting");
    }
    try {
      await paySupplierDebt({
        supplierId,
        omborId: selectedOmbor._id,
        amount: Number(payAmount),
      }).unwrap();

      message.success("To'lov muvaffaqiyatli bajarildi");
      setIsPayModalOpen(false);
      setPayAmount("");
      setSelectedOmbor(null);
      refetch();
    } catch (err) {
      message.error(err?.data?.message || "Xatolik yuz berdi");
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
      title: "Qarz (soldo)",
      dataIndex: "initialDebt",
      key: "initialDebt",
      render: (initialDebt) => (
        <span
          style={{
            color: "red",
          }}
        >
          {initialDebt}
        </span>
      ),
    },
    {
      title: "Balans",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => (
        <span
          style={{
            color: balance < 0 ? "red" : balance > 0 ? "green" : "gray",
          }}
        >
          {balance}
        </span>
      ),
    },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color =
          status === "qarzdor"
            ? "red"
            : status === "haqdor"
            ? "green"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Umumiy qarz",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color =
          status === "qarzdor"
            ? "red"
            : status === "haqdor"
            ? "green"
            : "default";
        return <Tag color={color}>{-record.initialDebt + record.balance}</Tag>;
      },
    },
    {
      title: "Ko'rish",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSupplierId(record._id);
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
  ];

  const omborColumns = [
    {
      title: "Mahsulot",
      dataIndex: "title",
      key: "title",
      render: (_, record) =>
        record.products.map((p) => (
          <div key={p._id}>
            {p.title} ({p.org_qty} x {p.price})
          </div>
        )),
    },
    {
      title: "Umumiy summa",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "To‘langan",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Qarz",
      dataIndex: "debtAmount",
      key: "debtAmount",
      render: (debt) => (
        <span style={{ color: debt > 0 ? "red" : "green" }}>{debt}</span>
      ),
    },
    {
      title: "Sana",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("uz-UZ"),
    },
    {
      title: "To'lash",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedOmbor(record);
            setIsPayModalOpen(true);
          }}
        >
          To‘lov qilish
        </Button>
      ),
    },
  ];

  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (isError) return <p>Xatolik yuz berdi</p>;

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
      <Table rowKey="_id" columns={columns} dataSource={suppliers} />

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
        confirmLoading={isPaying}
        okText="To‘lash"
        cancelText="Bekor qilish"
      >
        <p>
          Jami: <b>{selectedOmbor?.totalPrice}</b>
        </p>
        <p>
          Qolgan qarz:{" "}
          <b style={{ color: "red" }}>{selectedOmbor?.debtAmount}</b>
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
