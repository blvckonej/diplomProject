import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import List from "./components/List/List";
import AddListButton from "./components/AddList/AddButtonList";
import Tasks from "./components/Tasks/Tasks";

import alltask from "./assets/img/alltask.svg";
import StatisticList from "./components/StatisticList/StatisticList";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [role, setRole] = useState("");
  const [statisticUserId, setStatisticUserId] = useState(null);
  const [statisticListUser, setStatisticListUser] = useState([]);
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });

  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("user-id");
    if (!userIdFromStorage) {
      navigate("/auth");
    }
    axios.get("http://localhost:3001/user").then(({ data }) => {
      data.map((user) => {
        if (user.id == userIdFromStorage) {
          setRole(user.role);
          if (user.role === "ADMIN") {
            setLists(data);
          }
        }
      });
    });
    if (role === "USER") {
      axios
        .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
        .then(({ data }) => {
          setLists(data);
        });
      axios.get("http://localhost:3001/colors").then(({ data }) => {
        setColors(data);
      });
    }
  }, [role]);

  useEffect(() => {
    console.log("statisticUserId,", statisticUserId?.id);
    axios
      .get(
        "http://localhost:3001/lists?_expand=color&_embed=tasks&userId=" +
          statisticUserId?.id
      )
      .then(({ data }) => {
        if (data.length > 0) {
          setStatisticListUser(data);
          console.log(data, "111");
        } else {
          setStatisticListUser([]);
        }
      });
  }, [statisticUserId]);

  const onAddList = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
  };

  function getTime(time) {
    let d = time / (1000 * 60 * 60 * 24),
      h = (d - ~~d) * 24,
      m = (h - ~~h) * 60,
      s = (m - ~~m) * 60;
    return (
      <>
        <span>{h >= 10 ? Math.floor(h) : "0" + Math.floor(h)}</span>
        &nbsp;:&nbsp;
        <span>{m >= 10 ? Math.floor(m) : "0" + Math.floor(m)}</span>
        &nbsp;:&nbsp;
        <span>{s >= 10 ? Math.floor(s): "0" + Math.floor(s)}</span>
      </>
    );
  }

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Текст задачи", taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, { text: newTaskText })
      .catch(() => {
        alert("Не удалось удалить задачу");
      });
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Вы действительно хотите удалить задачу?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
        alert("Не удалось обновить задачу");
      });
    }
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskId, { completed })
      .catch(() => {
        alert("Не удалось завершить задачу");
      });
  };

  React.useEffect(() => {
    const listId = location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, location.pathname]);

  return (
    <div className="todo">
      <div className="todo__sidebar">
        {role === "USER" ? (
          <>
            <List
              onClickItem={(list) => {
                navigate(`/`);
              }}
              items={[
                {
                  active: location.pathname === `/`,
                  icon: <img src={alltask} alt="List icon" />,
                  name: "Все задачи",
                },
              ]}
            />
            {lists ? (
              <List
                items={lists}
                onRemove={(id) => {
                  const newLists = lists.filter((item) => item.id !== id);
                  setLists(newLists);
                }}
                onClickItem={(list) => {
                  navigate(`/lists/${list.id}`);
                }}
                activeItem={activeItem}
                isRemovable
              />
            ) : (
              "Загрузка..."
            )}
            <AddListButton onAdd={onAddList} colors={colors} />
          </>
        ) : (
          <StatisticList
            items={lists}
            setStatisticUserId={setStatisticUserId}
          />
        )}
      </div>
      <div className="todo__tasks">
        {role === "USER" ? (
          <Routes>
            <Route
              exact
              path="/"
              element={
                lists &&
                lists.map((list) => (
                  <Tasks
                    key={list.id}
                    list={list}
                    onAddTask={onAddTask}
                    onEditTitle={onEditListTitle}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                    withoutEmpty
                  />
                ))
              }
            />
            <Route
              path="lists/:id"
              element={
                lists &&
                activeItem && (
                  <Tasks
                    list={activeItem}
                    onAddTask={onAddTask}
                    onEditTitle={onEditListTitle}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                  />
                )
              }
            />
          </Routes>
        ) : (
          <div>
            {statisticUserId ? (
              <div>
                <h1>Статистика - {statisticUserId.name}</h1>
                <span>{statisticUserId.login}</span>
                <br />
                <br />
                <br />
                {statisticListUser.map((list) => {
                  return (
                    <div key={list.id}>
                      <h4>{list.name}</h4>-
                      {list?.tasks.map((task) => {
                        return (
                          <div key={task.id}>
                            <p>
                              {task.text} - времени на задачу потрачено - 
                              <b> {getTime(task?.timer?.sumTime)}</b>

                            </p>
                          </div>
                        );
                      })}
                      <br />
                      <br />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
