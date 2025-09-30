import React, { useState } from "react";
import dayjs from "dayjs";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../../context/service/expensesApi";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Popconfirm,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

function Expenses() {
  const [dateRange, setDateRange] = useState([]);
  const [typeFilter, setTypeFilter] = useState(null);

  // filterlar bilan so‘rov
  const {
    data: expensesData,
    refetch,
    isFetching,
  } = useGetExpensesQuery({
    startDate: dateRange?.[0]
      ? dayjs(dateRange[0]).format("YYYY-MM-DD")
      : undefined,
    endDate: dateRange?.[1]
      ? dayjs(dateRange[1]).format("YYYY-MM-DD")
      : undefined,
    type: typeFilter || undefined,
  });

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [form] = Form.useForm();

  const expenses = expensesData?.innerData || [];

  const handleEdit = (record) => {
    setSelectedExpense(record);
    setIsEditMode(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      if (isEditMode) {
        await updateExpense({ id: selectedExpense._id, ...values }).unwrap();
      } else {
        await createExpense(values).unwrap();
      }
      await refetch();
      form.resetFields();
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedExpense(null);
    } catch (err) {
      alert(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id).unwrap();
      await refetch();
    } catch (err) {
      alert(err?.data?.message || "O‘chirishda xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Turi",
      dataIndex: "type",
      key: "type",
      render: (text) =>
        text === "kirim" ? (
          <span style={{ color: "green" }}>Kirim</span>
        ) : (
          <span style={{ color: "red" }}>Chiqim</span>
        ),
    },
    {
      title: "To'lov turi",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Kategoriya",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Summasi",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Izoh",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="O‘chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record._id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
          gap: 30,
        }}
      >
        <h3>Xarajatlar</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <RangePicker onChange={(values) => setDateRange(values)} />

          <Select
            placeholder="Hammasi"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setTypeFilter(value)}
          >
            <Option value="kirim">Kirim</Option>
            <Option value="chiqim">Chiqim</Option>
          </Select>

          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            + Yangi xarajat
          </Button>
        </div>
      </div>

      <Table
        rowKey="_id"
        dataSource={expenses}
        columns={columns}
        loading={isFetching}
        pagination={false}
      />

      <Modal
        open={isModalOpen}
        title={isEditMode ? "Xarajatni tahrirlash" : "Yangi xarajat"}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedExpense(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="type"
            label="Turi"
            rules={[{ required: true, message: "Turi tanlang" }]}
          >
            <Select placeholder="Turi tanlang">
              <Option value="kirim">Kirim</Option>
              <Option value="chiqim">Chiqim</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="To'lov turi"
            rules={[{ required: true, message: "To'lov turini tanlang" }]}
          >
            <Select placeholder="To'lov turini tanlang">
              <Option value="naqt">Naqt</Option>
              <Option value="karta">Karta</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategoriya"
            rules={[{ required: true, message: "Kategoriya kiriting" }]}
          >
            <Input placeholder="Kategoriya" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Summasi"
            rules={[{ required: true, message: "Summani kiriting" }]}
          >
            <Input type="number" min={0} placeholder="Summani kiriting" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Izoh"
            rules={[{ required: true, message: "Izoh kiriting" }]}
          >
            <Input placeholder="Izoh" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Expenses;
