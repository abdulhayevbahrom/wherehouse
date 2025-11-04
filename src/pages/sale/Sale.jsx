import React, { useState } from "react";
import { useGetAgentsQuery } from "../../context/service/agentApi";
import {
  useGiveProductsToAgentMutation,
  useGetAllTransactionsQuery,
  usePayDebtMutation,
} from "../../context/service/transactionApi";
import { useGetOmborQuery } from "../../context/service/omborApi";
import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Table,
  Card,
  InputNumber,
  Empty,
  Tabs,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Option } = Select;

function Sale() {
  const { data: agentsData } = useGetAgentsQuery();
  const { data: omborData } = useGetOmborQuery();
  const [giveProductsToAgent, { isLoading }] = useGiveProductsToAgentMutation();
  const [payDebt] = usePayDebtMutation();
  const { data: transactionsData } = useGetAllTransactionsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payForm] = Form.useForm();

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ✅ Card uchun state
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [cart, setCart] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [searchText, setSearchText] = useState("");

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

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      toast.warning("Bu mahsulot allaqachon tanlangan!");
      return;
    }
    setCart([...cart, { ...product, quantity: 1, salePrice: product.price }]);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const handleQuantityChange = (productId, value) => {
    if (value === null || value <= 0) {
      toast.error("Miqdor 1 yoki undan katta bo'lishi kerak!");
      return;
    }
    const productInStock = omborData?.innerData.find(
      (p) => p._id === productId
    );
    if (productInStock && value > productInStock.quantity) {
      toast.error(`Omborda faqat ${productInStock.quantity} ta mavjud!`);
      return;
    }
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: value } : item
      )
    );
  };

  const handleSalePriceChange = (productId, value) => {
    if (value === null || value <= 0) {
      toast.error("Sotuv narxi 0 dan katta bo'lishi kerak!");
      return;
    }
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, salePrice: value } : item
      )
    );
  };

  const umumiySumma = cart.reduce((sum, item) => {
    return sum + (item.salePrice || 0) * (item.quantity || 0);
  }, 0);

  const qarzSumma = umumiySumma - Number(paidAmount);

  const handleSubmit = async () => {
    if (!selectedAgent) {
      toast.error("Dastavchikni tanlang!");
      return;
    }
    if (cart.length === 0) {
      toast.error("Kamida bitta mahsulot qo'shing!");
      return;
    }

    // Validatsiya: miqdorni tekshirish
    for (const item of cart) {
      if (!item.quantity || item.quantity <= 0) {
        toast.error(`${item.title} uchun miqdorni kiriting!`);
        return;
      }
      if (item.quantity > item.quantity) {
        toast.error(
          `${item.title} uchun omborda faqat ${item.quantity} ta mavjud!`
        );
        return;
      }
      if (!item.salePrice || item.salePrice <= 0) {
        toast.error(`${item.title} uchun sotuv narxini kiriting!`);
        return;
      }
    }

    try {
      const payload = {
        agentId: selectedAgent,
        paidAmount: Number(paidAmount),
        products: cart.map((item) => ({
          productId: item._id,
          quantity: Number(item.quantity),
          salePrice: Number(item.salePrice),
        })),
      };

      await giveProductsToAgent(payload).unwrap();

      // Reset
      setSelectedAgent(null);
      setCart([]);
      setPaidAmount(0);
      setIsModalOpen(false);
      toast.success("Sotish muvaffaqiyatli amalga oshirildi");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const filteredProducts = (omborData?.innerData || []).filter((p) =>
    p.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Dastavchik",
      dataIndex: ["agent", "fullname"],
      key: "fullname",
    },
    {
      title: "Umumiy summa",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (i) => i.toLocaleString(),
    },
    {
      title: "Qoldiq qarz",
      dataIndex: "remainingDebt",
      key: "remainingDebt",
      render: (i) => i.toLocaleString(),
    },
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
            Ko'rish
          </Button>
        );
      },
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (_, record) => new Date(record.date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Sotish" key="1">
          <div
            style={{
              display: "flex",
              gap: 20,
              height: "100%",
            }}
          >
            {/* Left side - Products */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 15 }}>
                <Select
                  placeholder="Dastavchikni tanlang"
                  style={{ width: "100%", marginBottom: 10 }}
                  value={selectedAgent}
                  onChange={setSelectedAgent}
                >
                  {agentsData?.innerData?.map((a) => (
                    <Option key={a._id} value={a._id}>
                      {a.fullname} ({a.phone || "—"})
                    </Option>
                  ))}
                </Select>

                <Input
                  placeholder="Mahsulot qidirish..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>

              <div
                style={{
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                }}
              >
                {filteredProducts.length === 0 ? (
                  <Empty description="Mahsulot topilmadi" />
                ) : (
                  filteredProducts.map((product) => (
                    <Card
                      key={product._id}
                      size="small"
                      hoverable
                      style={{
                        backgroundColor:
                          product?.quantity > 50 ? "#fff" : "pink",
                        borderRadius: 8,
                        border: cart.find((item) => item._id === product._id)
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                      }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <strong style={{ fontSize: 14 }}>
                          {product.title}
                        </strong>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                          marginBottom: 8,
                        }}
                      >
                        <div>Tan narxi: {product.price?.toLocaleString()}</div>
                        <div>Omborda: {product.quantity} ta</div>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddToCart(product)}
                        disabled={cart.find((item) => item._id === product._id)}
                        block
                      >
                        {cart.find((item) => item._id === product._id)
                          ? "Tanlangan"
                          : "Tanlash"}
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right side - Cart */}
            <div
              style={{
                maxHeight: "100vh",
                width: 450,
                borderLeft: "1px solid #d9d9d9",
                paddingLeft: 20,
              }}
            >
              <h4
                style={{
                  marginBottom: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ShoppingCartOutlined /> Tanlangan mahsulotlar ({cart.length})
              </h4>

              <div
                style={{
                  maxHeight: "56vh",
                  overflowY: "auto",
                  marginBottom: 15,
                  padding: "5px",
                }}
              >
                {/* {cart.length === 0 ? (
                  <Empty description="Mahsulot tanlanmagan" />
                ) : (
                  cart.map((item) => (
                    <Card
                      key={item._id}
                      size="small"
                      style={{ marginBottom: 10 }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <strong>{item.title}</strong>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFromCart(item._id)}
                          style={{ float: "right" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, marginBottom: 3 }}>
                            Miqdor:
                          </div>
                          <InputNumber
                            min={1}
                            max={item.quantity}
                            value={item.quantity}
                            onChange={(val) =>
                              handleQuantityChange(item._id, val)
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, marginBottom: 3 }}>
                            Sotuv narxi:
                          </div>
                          <InputNumber
                            min={0}
                            value={item.salePrice}
                            onChange={(val) =>
                              handleSalePriceChange(item._id, val)
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          marginTop: 5,
                        }}
                      >
                        Jami:{" "}
                        {(
                          (item.salePrice || 0) * (item.quantity || 0)
                        ).toLocaleString()}
                      </div>
                    </Card>
                  ))
                )} */}

                {cart.length === 0 ? (
                  <Empty description="Mahsulot tanlanmagan" />
                ) : (
                  cart.map((item) => (
                    <Card
                      key={item._id} // Ensure unique key
                      size="small"
                      style={{ marginBottom: 10 }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <strong>{item.title || "Nomsiz mahsulot"}</strong>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFromCart(item._id)}
                          style={{ float: "right" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, marginBottom: 3 }}>
                            Miqdor:
                          </div>
                          <InputNumber
                            min={1}
                            max={
                              omborData?.innerData.find(
                                (p) => p._id === item._id
                              )?.quantity || 1
                            }
                            value={item.quantity}
                            onChange={(val) =>
                              handleQuantityChange(item._id, val)
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, marginBottom: 3 }}>
                            Sotuv narxi:
                          </div>
                          <InputNumber
                            min={0}
                            value={item.salePrice}
                            onChange={(val) =>
                              handleSalePriceChange(item._id, val)
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          marginTop: 5,
                        }}
                      >
                        Jami:{" "}
                        {(
                          (item.salePrice || 0) * (item.quantity || 0)
                        ).toLocaleString()}
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Summary */}
              <div
                style={{
                  padding: 15,
                  background: "#f5f5f5",
                  borderRadius: 8,
                  marginBottom: 15,
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
                    {umumiySumma.toLocaleString()}
                  </span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ marginBottom: 5, fontWeight: 500 }}>
                    To'langan summa:
                  </div>
                  <InputNumber
                    min={0}
                    max={umumiySumma}
                    value={paidAmount}
                    onChange={setPaidAmount}
                    style={{ width: "100%" }}
                    placeholder="To'langan summa"
                  />
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
                    {qarzSumma.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                disabled={!selectedAgent || cart.length === 0 || isLoading}
              >
                Sotishni tasdiqlash
              </Button>
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="2" tab="Sotuv tarixi" style={{ padding: "0 10px" }}>
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
                  max={selectedTransaction?.remainingDebt || 0}
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
                  render: (i) => i.toLocaleString(),
                },
                {
                  title: "Jami",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  render: (i) => i.toLocaleString(),
                },
              ]}
            />
          </Modal>

          <Table
            rowKey="_id"
            dataSource={transactionsData?.innerData || []}
            columns={columns}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Sale;
