import React from 'react';
import axios from 'axios';

import Task from './Task';
import AddTasksForm from './AddTasksForm';
import './Tasks.scss';
import editSvg from '../../assets/img/edit.svg';

const Tasks = ( { list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onCompleteTask, time, withoutEmpty } ) => {

    const editTitle = () => {
        const newTitle = window.prompt('Название списка', list.name);
        if (newTitle) {
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3001/lists/' + list.id, {
                name: newTitle,
            }).catch(() => {
                alert('Не удалось обновить заголовок')
            });
        }
    }

  return (
    <div className="tasks">
        <h2 style={{ color: list.color.hex }} className="tasks__title">
            {list.name}
            <img onClick={editTitle} className="editSvg" src={editSvg} alt="Pen" />
        </h2>
        <div className="tasks__items">
            {!withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачи отсутствуют</h2>}
            {
               list.tasks && list.tasks.map((task, time) => (
                    <Task key={task.id} list={list} time={time} onRemove={onRemoveTask} onEdit={onEditTask} onComplete={onCompleteTask} {...task}/>
            ))}
        <AddTasksForm key={list.id} list={list} onAddTask={onAddTask} />
        </div>
    </div>
  )
}

export default Tasks;