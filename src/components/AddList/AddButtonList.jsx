import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../List/List";
import Badge from "../Badges/Badge";

import './AddButtonList.scss'
import addfolder from '../../assets/img/plus.svg'
import closePopup from '../../assets/img/close.svg'


const AddButtonList = ({ colors, onAdd }) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors]);

    const onClose = () => {
        setVisiblePopup(false);
        setInputValue('')
        selectColor(colors[0].id)
    }

    const addList = () => {
        if (!inputValue) {
            alert('Введите название списка')
            return;
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/lists', { name: inputValue, colorId: selectedColor }).then(({ data }) => {
            const color = colors.filter(c => c.id === selectedColor)[0];
            const listObj = { ...data, color, tasks: []};
            onAdd(listObj);
            onClose();
        })
        .catch(() => {
            alert('Ошибка при добавлении задачи')
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <div className="add__list">
            <List onClick={() => setVisiblePopup(!visiblePopup)} items={[
                {
                icon: <img src={addfolder} alt="List icon" />,
                name: 'Добавить папку'
                }
            ]}
            />
           {visiblePopup && (<div className="add__list-popup">
            <img onClick={onClose} src={closePopup} alt="Close Button" className="add__list-popup-close-btn" />
                <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="field" type="text" placeholder="Название списков"/>
                <div className="add__list-popup-colors">
                    {
                        colors.map((color)=> (
                            <Badge onClick={() => selectColor(color.id)} 
                                key={color.id} 
                                color={color.name} 
                                className={selectedColor === color.id && 'active'} />
                        ))
                    }
                </div>
                <button onClick={addList} className="button">{isLoading ? 'Добавление...' : 'Добавить'}</button>
            </div>)}
        </div>
    )
}

export default AddButtonList;