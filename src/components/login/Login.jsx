import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./Login.css";
import login_bg from "../../assets/bg.jpg";
import { useLoginAdminMutation } from "../../context/service/adminApi";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginAdmin] = useLoginAdminMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdmin({ login, password }).unwrap();

      const token = res?.innerData?.token;

      let adminPermissions = [
        "/",
        "/admins",
        "/agents",
        "/ombor",
        "/sale",
        "/expense",
        "/suppliers",
        "/debtors",
      ];
      let agentPermissions = ["/debt", "/products"];

      const { firstName, lastName, role } = res?.innerData?.employee;
      let permissions = role === "owner" ? adminPermissions : agentPermissions;
      localStorage.setItem("token", token);
      localStorage.setItem("full_name", `${firstName} ${lastName}`);
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem("role", role);

      message.success(res?.message || "Muvaffaqiyatli kirish");
      navigate(permissions[0]);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img src={login_bg} alt="Kirish foni" className="login__bg" />
      <form onSubmit={onSubmit} className="login__form">
        <h1 className="login__title">Kirish</h1>
        <div className="login__inputs">
          <div className="login__box">
            <input
              type="text"
              placeholder="login..."
              required
              className="login__input"
              onChange={(e) => setLogin(e.target.value)}
            />
            <i className="ri-mail-fill"></i>
          </div>
          <div className="login__box">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Parol"
              required
              className="login__input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            ></i>
          </div>
        </div>
        <div className="login__check"></div>
        <button type="submit" disabled={loading} className="login__button">
          {loading ? "Loading..." : "Kirish"}
        </button>
        <div className="login__register">
          {/* Sumka ishlab chiqarish zavodini avtomatlashtirish tizimiga xush
          kelibsiz! */}
        </div>
      </form>
    </div>
  );
};

export default Login;
