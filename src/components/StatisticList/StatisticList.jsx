import React, { useState } from "react";
import classNames from "classnames";
import axios from "axios";

import Badge from "../Badges/Badge";
import "./StatisticList.scss";

import removeImg from "../../assets/img/remove.svg";

const StatisticList = ({ items, setStatisticUserId }) => {

  function getStatisticUser (id) {
    axios.get("http://localhost:3001/user").then(({ data }) => {
      data.map((user) => {
        if (user.id === id) {
          setStatisticUserId(user)
        }
      });
    });

    // axios
    // .get("http://localhost:3001/lists?userId=" + id)
    // .then(({ data }) => {
    //   console.log(data, '/lists/" + 3');
    //   if (data.length > 0) {
    //     setStatisticListUser(data)
    //   }
    // });
  }
console.log(items);
  return (
    <>
      <ul  className="todo__sidebar-list">
        {Array.isArray(items)
          ? items.map((item, index) => (
      
              <li
                key={index}
                className={classNames(item.className)}
                onClick={() => getStatisticUser(item.id)}
              >
                <i>{item.icon ? item.icon : <Badge color={item.name} />}</i>
                <span>
                  {item.name}
                  {item.id && <div className="circle__number">{item.id}</div>}
                </span>
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

export default StatisticList;
