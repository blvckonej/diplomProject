import React, { useState } from "react";
import "./Authorization.scss";
import { useNavigate } from "react-router-dom";

const Authorization = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(inputs);
    console.log(inputs);
  };

  return (
    <div>
      <div className="authorization-wrp">
        <div className="container">
          <div className="authorization-wrp__form">
            <h1 className="authorization-wrp__title">Авторизация</h1>
            <div></div>

            <form onSubmit={handleSubmit}>
              <label>
                Логин
              </label>
                <input
                  className="authorization-wrp__user-name"
                  type="text"
                  name="login"
                  placeholder="Введите ваш логин"
                  value={inputs.username || ""}
                  onChange={handleChange}
                />

              <label>
                Пароль
              </label>
                <input
                  className="authorization-wrp__user-password"
                  type="password"
                  name="password"
                  placeholder="Введите ваш пароль"
                  value={inputs.age || ""}
                  onChange={handleChange}
                />
              <input 
                type="submit"
                className="authorization-wrp__button-submit"
                />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
