import React, { useState } from 'react';
import axios from 'axios';

import plusSvg from '../../assets/img/plus.svg';

const AddTasksForm = ({ list, onAddTask }) => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState('');

    const toggleFormVisible = () => {
        setVisibleForm(!visibleForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false,
            dataTime: new Date().toLocaleDateString(),
            dataHours: new Date().toLocaleTimeString().slice(0,-3)
        };
        setIsLoading(true);
        axios
        .post('http://localhost:3001/tasks/', obj)
        .then(({ data }) => {
            onAddTask(list.id, data)
            toggleFormVisible();
        })
        .catch(() => {
            alert('Ошибка при добавлении задачи')
        })
        .finally(() => {
            setIsLoading(false)
        });
    }

  return (
    <div className="tasks__form">
        {!visibleForm ? ( <div onClick={toggleFormVisible} className="tasks__form-new">
            <img src={plusSvg} alt="Add icon" />
            <span>Новая задача</span>
        </div> 
        ) : (
            <div className="task__form-block">
                <input 
                value={inputValue}
                className="field-task" 
                type="text" 
                placeholder="Текст задачи"
                onChange={e => setInputValue(e.target.value)} />
                <button disabled={isLoading} onClick={addTask} className="button-task">{isLoading ? 'Добавление' : 'Добавить задачу'}</button>
                <button onClick={toggleFormVisible} className="button-task-cancel">Отмена</button>
            </div>
        )}
    </div>
  )
}

export default AddTasksForm;

