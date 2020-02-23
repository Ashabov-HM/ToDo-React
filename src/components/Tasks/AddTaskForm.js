import React, {useState}  from 'react';
import axios from 'axios';


const AddTaskForm = ( {list, onAddTask}) => {
    
    const [formVisible, setFormVisible] = useState(false);
    const [ inputValue, setInputValue ] = useState('');
    const [ isLoading, setIsLoading] = useState();

    const toggleFormVisible = () => {
        setFormVisible(!formVisible);
        setInputValue('');
    }

    const addTask = () => {
        const obj = {
            
            listId : list.id,
            text : inputValue,
            completed : false
        };
        setIsLoading(true);
        axios
            .post('http://localhost:3000/tasks' , obj)
            .then(({ data }) => {
                console.log(data);
                onAddTask(list.id, data);
                toggleFormVisible();
            }).catch(()=>{
                alert('We have problem with AddTaskForm');
            })
            .finally(()=>{
                setIsLoading(false);
            });
    };
    
    return (
        <>
            <div className="tasks__form">
                {!formVisible ? (<div onClick={toggleFormVisible} className="tasks__form-new">
                    <img  src="../img/add.svg" alt=""/>
                    <span>New task</span>
                </div>) : (
                    <div className="tasks__form-btns">
                    <input
                        value={inputValue}
                        className="field" 
                        type="text" 
                        placeholder="Task's text"
                        onChange={ e => setInputValue(e.target.value)}/>
                    <button disabled={isLoading} onClick={addTask}  className="button">
                        {isLoading ? 'Task will add' : 'Add task'}
                    </button>
                    <button onClick={toggleFormVisible} className="button button--grey">
                        Close
                    </button>
                </div>)
                }
                
                
            </div>
        </>
    )
}

export default AddTaskForm
