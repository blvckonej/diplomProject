import { React, useEffect, useState } from "react";

import playBtn from "../../assets/img/play.svg";
import stopBtn from "../../assets/img/stop.svg";
import pauseBtn from "../../assets/img/pause.svg";
import resetBtn from "../../assets/img/reset.svg";
import axios from "axios";

const Task = ({
  id,
  text,
  onEdit,
  onRemove,
  list,
  onComplete,
  completed,
  dataTime,
  dataHours,
}) => {
  const onChangeCheckbox = (e) => {
    onComplete(list.id, id, e.target.checked);
  };

  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState(0);
  const [startTime, setStartTime] = useState("");

  let updateMs = time.ms,
    updateS = time.s,
    updateM = time.m,
    updateH = time.h;

  useEffect(() => {
    axios.get("http://localhost:3001/tasks/" + id).then(({ data }) => {
      if (data.timer?.sumTime && !data.timer?.startTime) {
        getTime(data.timer?.sumTime);
      }

      if (data.timer?.startTime) {
        setTimeout(() => {
          let sumTime = new Date() - new Date(data.timer?.startTime) - 200;
          sumTime = sumTime + data.timer?.sumTime;
          getTime(sumTime);
          setStartTime(data.timer?.startTime)
          start();
        }, 100);
      }
    });
  }, []);

  function getTime(time) {
    let d = time / (1000 * 60 * 60 * 24),
          h = (d - ~~d) * 24,
          m = (h - ~~h) * 60,
          s = (m - ~~m) * 60;
        setTime({
          ms: 0,
          s: Math.floor(s),
          m: Math.floor(m),
          h: Math.floor(h),
        });
        updateMs = 0;
        updateS = Math.floor(s);
        updateM = Math.floor(m);
        updateH = Math.floor(h);
  }

  const start = () => {
    run();
    setStatus(1);
    setInterv(setInterval(run, 10));
    list.tasks.map((task) => {
      if (task.id === id) {
        let dateNow = new Date();
        let sumTime = 1;

        axios.get("http://localhost:3001/tasks/" + id).then(({ data }) => {
          if (data.timer.sumTime) {
            sumTime = sumTime + data.timer.sumTime;
          }
          if (!data.timer.startTime) {
            axios
              .patch("http://localhost:3001/tasks/" + id, {
                timer: { startTime: dateNow, sumTime: sumTime },
              })
              .then(({ data }) => {
                setStartTime(dateNow);
              })
              .catch(() => {
                alert("???????????? ?????? ???????????????????? ????????????");
              })
              .finally(() => {});
          }
        });
      }
    });
  };

  const run = () => {
    if (updateM === 60) {
      updateH++;
      updateM = 0;
    }
    if (updateS === 60) {
      updateM++;
      updateS = 0;
      alert("?????????? ???? ?????? ???????????? ??????????????????????");
    }
    if (updateMs === 100) {
      updateS++;
      updateMs = 0;
    }
    updateMs++;
    return setTime({ ms: updateMs, s: updateS, m: updateM, h: updateH });
  };

  const stoped = () => {
    clearInterval(interv);
    setStatus(2);
    list.tasks.map((task) => {
      if (task.id === id) {
        let sumTime = new Date() - new Date(startTime) - 200;
        axios.get("http://localhost:3001/tasks/" + id).then(({ data }) => {
          if (data.timer.sumTime) {
            sumTime = sumTime + data.timer.sumTime;
          }
          axios
            .patch("http://localhost:3001/tasks/" + id, {
              timer: { startTime: "", sumTime: sumTime },
            })
            .then(({ data }) => {})
            .catch(() => {
              alert("???????????? ?????? ???????????????????? ????????????");
            })
            .finally(() => {});
        });
      }
    });
  };

  const reset = () => {
    clearInterval(interv);
    setStatus(0);
    setTime({ ms: 0, s: 0, m: 0, h: 0 });
  };

  const resume = () => start();

  return (
    <div key={id} className="tasks__items-row">
      <div className="datatime">
        <div>{dataTime}</div>
        <div className="datatime-hours">{dataHours}</div>
      </div>
      <div className="checkbox">
        <input
          onChange={onChangeCheckbox}
          id={`tasks-${id}`}
          type="checkbox"
          checked={completed}
        />
        <label htmlFor={`tasks-${id}`}>
          <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </div>
      <p className={`${completed ? "closed" : "open"}`}>{text}</p>
      <div>
        <span>{time.h >= 10 ? time.h : "0" + time.h}</span>&nbsp;:&nbsp;
        <span>{time.m >= 10 ? time.m : "0" + time.m}</span>&nbsp;:&nbsp;
        <span>{time.s >= 10 ? time.s : "0" + time.s}</span>
      </div>
      <div className="tasks__items-row-actions">
        {status === 0 ? (
          <div className="block-btn">
            <div className="task__items-row-play-btn" onClick={start}>
              <img src={playBtn} alt="Play button" />
            </div>
          </div>
        ) : (
          ""
        )}
        {status === 1 ? (
          <div className="block-btn">
            <div className="task__items-row-stop-btn" onClick={stoped}>
              <img src={stopBtn} alt="Stop button" />
            </div>
            <div className="task__items-row-reset-btn" onClick={reset}>
              <img src={resetBtn} alt="Reset button" />
            </div>
          </div>
        ) : (
          ""
        )}
        {status === 2 ? (
          <div className="block-btn">
            <div className="task__items-row-resume-btn" onClick={resume}>
              <img src={pauseBtn} alt="Stop button" />
            </div>
            <div className="task__items-row-reset-btn" onClick={reset}>
              <img src={resetBtn} alt="Reset button" />
            </div>
          </div>
        ) : (
          ""
        )}
        <div onClick={() => onEdit(list.id, { id, text })}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9337 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.638 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825V3.36825Z"
              fill="black"
            />
          </svg>
        </div>
        <div onClick={() => onRemove(list.id, id)}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.87215 5.5L10.7129 1.65926C10.8952 1.47731 10.9977 1.23039 10.9979 0.972832C10.9982 0.715276 10.8961 0.468178 10.7141 0.285898C10.5321 0.103617 10.2852 0.00108525 10.0277 0.000857792C9.77011 0.000630336 9.52302 0.102726 9.34074 0.284685L5.5 4.12542L1.65926 0.284685C1.47698 0.102404 1.22976 0 0.971974 0C0.714191 0 0.466965 0.102404 0.284685 0.284685C0.102404 0.466965 0 0.714191 0 0.971974C0 1.22976 0.102404 1.47698 0.284685 1.65926L4.12542 5.5L0.284685 9.34074C0.102404 9.52302 0 9.77024 0 10.028C0 10.2858 0.102404 10.533 0.284685 10.7153C0.466965 10.8976 0.714191 11 0.971974 11C1.22976 11 1.47698 10.8976 1.65926 10.7153L5.5 6.87458L9.34074 10.7153C9.52302 10.8976 9.77024 11 10.028 11C10.2858 11 10.533 10.8976 10.7153 10.7153C10.8976 10.533 11 10.2858 11 10.028C11 9.77024 10.8976 9.52302 10.7153 9.34074L6.87215 5.5Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Task;
