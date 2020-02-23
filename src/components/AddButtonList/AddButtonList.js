import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

import List from "../Lists/List"
import Badge from '../Badge/Badge'

// import closeSvg from '../../assets/img/close.svg'; !!!!! отключен из-за проблем с путем. Причина пока не выявлена

import '../../index.scss';
import './AddButtonList.scss';

function AddButtonList( {colors, onAdd} ) {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectColor, setSelectColor] = useState(3);
    const [isLoading, setIsLoading] = useState( false );
    const [inputValue, setInputValue] = useState('');
    
    
    useEffect (() => {
        if (Array.isArray(colors)) {
            setSelectColor(colors[0].id);
        }
        // console.log(colors);
    }, [colors]);

    const onClose = () => {
        setVisiblePopup(false);
        setInputValue('');
        setSelectColor(colors[0].id);
    }


    // addList добавляет вводимые пользователем данные об группе: название и цвет
    const addList = () => {
        if(!inputValue){ 
            alert('Error');
            return;
        }
        setIsLoading(true);
        axios
        .post('http://localhost:3000/lists', { 
            "name": inputValue, 
            "colorId": selectColor 
        })
        .then(({ data }) => {
            const color = colors.filter(c => c.id === selectColor)[0];
            const listObj = {...data, color, tasks: []};
            onAdd(listObj);
            onClose();
        })
        .catch(()=>{
            alert('We have problem with AddButtonList');
        })
        .finally(()=>{
            setIsLoading(false);
        });
        
        
    }

    return (
        <div className="add-list">
            <List
                onClick={ () => setVisiblePopup(!visiblePopup)}
                items={[
                    {
                    className: "list__add-btn",
                    icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" 
                            >
                            <path d="M8 1V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 8H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>,
                    name: "Add list",
                    },
                ]} />
            {visiblePopup && (<div className="add-list__popup">
                <img
                    onClick={onClose} 
                    src={'../img/close.svg'}
                    alt="Close btn"
                    className="add-list__popup-close-btn"
                />
                <input 
                    onChange = { e => setInputValue(e.target.value) }
                    className="field" 
                    type="text" 
                    placeholder="input list name"/>

                <div className="add-list__popup-colors">
                        {colors.map(color => (
                            <Badge 
                                onClick={()=>setSelectColor(color.id)} 
                                key={color.id} 
                                color={color.name}
                                className={selectColor === color.id && 'active'}
                             />
                        ))}

                </div>
                <button onClick={addList} className="button">
                    {isLoading ? 'Loading...': 'Add list'}
                </button>
            </div>
            )}
        </div>
    )
}

export default AddButtonList;