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
            <h1 className="authorization-wrp__title"></h1>
            <div></div>

            <form onSubmit={handleSubmit}>
              <label>
                Enter your login:
                <input
                  className="authorization-wrp__user-name"
                  type="text"
                  name="login"
                  value={inputs.username || ""}
                  onChange={handleChange}
                />
              </label>
              <label>
                Enter your password:
                <input
                  className="authorization-wrp__user-password"
                  type="password"
                  name="password"
                  value={inputs.age || ""}
                  onChange={handleChange}
                />
              </label>
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
