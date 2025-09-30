import React, { useState } from "react";
import { Button, Modal, Form, Input, Table, Checkbox, Popconfirm } from "antd";
import {
  useCreateAgentMutation,
  useGetAgentsQuery,
  useDeleteAgentMutation,
  useUpdateAgentMutation,
} from "../../context/service/agentApi";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function Agents() {
  const [createAgent] = useCreateAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();
  const [updateAgent] = useUpdateAgentMutation();
  const { data } = useGetAgentsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [form] = Form.useForm();

  const agents = data?.innerData || [];

  const columns = [
    {
      title: "Ism Familiya",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Amallar",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          ></Button>
          <Popconfirm
            title="Agentni o'chirmoqchimisiz?"
            onConfirm={() => deleteAgent(record._id).unwrap()}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedAgent(record);
    setIsEditMode(true);
    form.setFieldsValue({
      fullname: record.fullname,
      phone: record.phone,
      login: record.login,
      password: record.password, // Parolni tahrirlash uchun eski qiymatni ko'rsatish (agar kerak bo'lmasa, bo'sh qoldirish mumkin)
      status: record.status,
    });
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      if (isEditMode) {
        await updateAgent({
          id: selectedAgent._id,
          ...values,
          phone: "+998" + values.phone,
        }).unwrap();
      } else {
        await createAgent({ ...values }).unwrap();
      }
      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setSelectedAgent(null);
      toast.success("Muvaffaqiyatli amalga oshirildi");
    } catch (error) {
      toast.error(error?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
        className="agentHeader"
      >
        <h3>Dastavchik</h3>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Yangi agent
        </Button>
      </div>
      <Modal
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedAgent(null);
          form.resetFields();
        }}
        open={isModalOpen}
        title={isEditMode ? "Agentni tahrirlash" : "Yangi agent"}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: true }}
        >
          <Form.Item
            label="Ism Familiya"
            name="fullname"
            rules={[{ required: true, message: "Ism familiyani kiriting" }]}
          >
            <Input placeholder="Ism familiyani kiriting" />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input placeholder="+998XXXXXXXXX" maxLength={12} />
          </Form.Item>

          <Form.Item
            label="Login"
            name="login"
            rules={[{ required: true, message: "Login kiriting" }]}
          >
            <Input placeholder="login kiriting" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: !isEditMode, message: "Passwordni kiriting" }, // Tahrirda majburiy emas, agar o'zgartirish kerak bo'lsa
            ]}
          >
            <Input placeholder="Passwordni kiriting" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={agents}
      />
    </div>
  );
}

export default Agents;
