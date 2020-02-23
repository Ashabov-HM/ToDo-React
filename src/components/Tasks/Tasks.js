import React from 'react';
import axios from 'axios';

import AddTaskForm from './AddTaskForm';
import Task from './Task';

import './Tasks.scss';

function Tasks( {list, onEditTitle, onAddTask, onRemoveTask, onEditTask, withoutEmpty} ) {

    const editTitle = () => {
        const newTitle = window.prompt('Name of list', list.name);
        if (newTitle){
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3000/lists/' + list.id, {
                name: newTitle
            }).catch(() => {
                alert('Not patch name');
                onEditTitle(list.id, 'err');
            });
        }
    }

    

    return (
        <>
            <div className="tasks">
                <h2 style={{ color: list.color.hex}} className="tasks__title">
                    {list.name}
                    <img onClick={ editTitle } src="../img/edit.svg" alt="Edit icon"/>
                </h2>

                <div className="tasks__items">
                    {!withoutEmpty && list.tasks && !list.tasks.length && <h2>NO TASKS</h2>}
                    {list.tasks.map( (task) => (
                            <Task key={task.id} list={list} onRemove={onRemoveTask} onEdit={onEditTask} {...task} />
                            // {...task} подробнее разобрать это
                    ))}
                    <AddTaskForm key={list.id} list={list} onAddTask={onAddTask}/>
                </div>
            </div>
        </>

    )
}

export default Tasks; 