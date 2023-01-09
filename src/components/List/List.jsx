import React from "react";
import classNames from "classnames";
import axios from "axios";

import Badge from "../Badges/Badge";
import './List.scss';

import removeImg from '../../assets/img/remove.svg';

const List = ({ items, isRemovable, onClick, onRemove, onClickItem, activeItem }) => {

    const removeList = (item) => {
        if (window.confirm('Вы действительно хотите удалить список ?')) {
            axios.delete('http://localhost:3001/lists/' + item.id).then(() => {
                onRemove(item.id);
            });
        }
    }
    return (
        <ul onClick={onClick} className="todo__sidebar-list">
            {
                items.map((item, index) => (        
                <li key={index} 
                    className={classNames(item.className, {active: item.active ? item.active : activeItem && activeItem.id === item.id})}
                    onClick={onClickItem ? () => onClickItem(item) : null}
                >
                    <i>{item.icon ? item.icon : <Badge color={item.color.name}/>}</i>
                <span>
                    {item.name}
                    {item.tasks && <div className="circle__number">{item.tasks.length}</div>}
                </span>
                {isRemovable && <img onClick={() => removeList(item)} className="todo__sidebar-list-remove-icon" src={removeImg} alt="Remove button (img)" />}
                </li>
            ))}
        </ul>
    )
}

export default List;