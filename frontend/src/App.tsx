import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  //creating these constants allow us to store changes to the input TODO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault()
    const updateTODO = async () => {
      try {
        //Make a call to the server, specifying that we're posting and passing the JSON made from our constants
        const todos = await fetch('http://localhost:8080/', {
          method : "POST",
          //Using the constants allows us to create a custom object which matches the required type to convert to JSON 
          body: JSON.stringify({Title: title, Description: description}),
        });
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }
    updateTODO()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.Title + todo.Description}
            Title={todo.Title}
            Description={todo.Description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" name="Title" autoFocus={true} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" name="Description" onChange={e => setDescription(e.target.value)}/>
        <button type = "submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
