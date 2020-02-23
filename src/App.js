import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import {Route, useHistory } from 'react-router-dom';

import {List, AddButtonList, Tasks} from './components/index';  

// import DB from './assets/db.json';

import './index.scss';

function App()  {
  
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [ activeItem, setActiveItem ] = useState(null);
  let history = useHistory();

  // useEffect отправляет запрос на получение данных из БД
  useEffect(() => {
    axios
      .get('http://localhost:3000/lists?_expand=color&_embed=tasks')
      .then(({ data }) => {
        setLists(data);
      });
    axios.get('http://localhost:3000/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);

  
 

  // onAddList хранятся добалвенные объекты со свойствами: название и цвет группы в л.сайтбаре
  const onAddList = obj => {
    // newList берет данные из lists и прибавляет к ним данные от пользователя и создает новый массив
    const newList = [...lists,obj];
    
    setLists(newList);
  }

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map(item => {
      if(item.id === listId){
        item.tasks = [...item.tasks, taskObj];
      }
      return item
    });
    setLists(newList);
  }

  const onRemoveTask = ( listId, taskId) => {
    if (window.confirm("Are you want delete the task?")){
        const newList = lists.map( item => {
          if (item.id === listId){
            item.tasks = item.tasks.filter(task => task.id !== taskId);
          }
          return item;
        });
        setLists(newList);
        axios
            .delete('http://localhost:3000/tasks/' + taskId)
            .catch(() => {
                alert("Don't delete");
        });
    }
  }

  const onEditTask = ( listId, taskObj ) => {
      const newTaskText = window.prompt("Write here task's text", taskObj.text);

      if(!newTaskText){
        return;
      }

      const newList = lists.map( list => {
        if (list.id === listId){
          list.tasks = list.tasks.map(task => {
            if (task.id === taskObj.id){
              task.text = newTaskText;
            }
            return task;
          });
        }
        return list ;
      });
      setLists(newList);
      axios
          .patch('http://localhost:3000/tasks/' + taskObj.id, {text : newTaskText})
          .catch(() => {
              alert("Don't delete");
      });
  }

  // onEditListTitle сохраняет изменение тайтла списка задач
  const onEditListTitle =  (id, title) => {
    const newList = lists.map( item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;   
    });
    setLists(newList);
  }

  useEffect(() => {
    // в listId хранится номер Листа, но в формате String
    const listId = history.location.pathname.split('lists/')[1];
    // Далее проверка на то, что данные есть lists, т.е axios выполнился
    if(lists) {
      const list = lists.find(list => list.id === Number(listId)); // list это объект
     
      setActiveItem(list); // сделать активным нужный list
    }
    
  }, [lists, history.location.pathname]);
  // в history.location.pathname хранится абсолютный путь

 
  return (
        <div className='todo'>
          <div className="todo__sidebar">
              {/* Первый List отвечает за Add tasks */}
              <List 
                onClickItem = { list =>{
                  history.push(`/`);
                }}
                items={[ 
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.96 8.10001H7.74001C7.24321 8.10001 7.20001 8.50231 7.20001 9.00001C7.20001 9.49771 7.24321 9.90001 7.74001 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001V8.10001ZM14.76 12.6H7.74001C7.24321 12.6 7.20001 13.0023 7.20001 13.5C7.20001 13.9977 7.24321 14.4 7.74001 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74001 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74001C7.24321 3.60001 7.20001 4.00231 7.20001 4.50001C7.20001 4.99771 7.24321 5.40001 7.74001 5.40001ZM4.86001 8.10001H3.24001C2.74321 8.10001 2.70001 8.50231 2.70001 9.00001C2.70001 9.49771 2.74321 9.90001 3.24001 9.90001H4.86001C5.35681 9.90001 5.40001 9.49771 5.40001 9.00001C5.40001 8.50231 5.35681 8.10001 4.86001 8.10001ZM4.86001 12.6H3.24001C2.74321 12.6 2.70001 13.0023 2.70001 13.5C2.70001 13.9977 2.74321 14.4 3.24001 14.4H4.86001C5.35681 14.4 5.40001 13.9977 5.40001 13.5C5.40001 13.0023 5.35681 12.6 4.86001 12.6ZM4.86001 3.60001H3.24001C2.74321 3.60001 2.70001 4.00231 2.70001 4.50001C2.70001 4.99771 2.74321 5.40001 3.24001 5.40001H4.86001C5.35681 5.40001 5.40001 4.99771 5.40001 4.50001C5.40001 4.00231 5.35681 3.60001 4.86001 3.60001Z" fill="black"/>
                          </svg>,
                    name: "All tasks",
                    active: history.location.pathname === '/',
                  },
                ]}
              />
              { lists ? (
                <List
                  items = {lists}
                  onRemoveList = { id =>{
                    const newLists = lists.filter( item => item.id !== id );
                    setLists(newLists);
                  }}
                  onClickItem = { list =>{
                    history.push(`/lists/${list.id}`);
                  }}
                  activeItem={activeItem}
                  isRemovable
                />
              ) : (
                'загрузка'
              )}
              
              {/* AddButtonList - возвращает List для добавления и содержит в себе блок для добавления  */}
              {/* onAdd - передает функцию onAddList */}
              <AddButtonList onAdd={onAddList} colors={colors}/>
          </div>
          <div className="todo__tasks">
            <Route exact path='/' >
                {lists &&
                  lists.map( list => (
                    <Tasks
                      key={list.id} 
                      list={list}
                      onAddTask={onAddTask}
                      onEditTitle={onEditListTitle}
                      onRemoveTask={onRemoveTask}
                      onEditTask={onEditTask}
                      withoutEmpty 
                      // withoutEmpty - убирает надпись No tasks в списке задач, если открыть их через All tasks
                    />
                  ))
                }
            </Route>
          

            <Route path='/lists/:id'> 
              {lists && activeItem && (
                <Tasks
                  onAddTask={onAddTask}
                  list={activeItem}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  />)}
            </Route>
          </div>
        </div>
  );
  }

export default App;


