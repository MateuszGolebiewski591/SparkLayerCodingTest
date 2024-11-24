import React from 'react';
import './App.css';

export type TodoType = {
  Title: string,
  Description: string,
}

function Todo({ Title, Description }: TodoType) {
  return (
    <div className="todo">
      <div className="todo-details">
        <p className="todo-title">{Title}</p>
        <p className="todo-description">{Description}</p>
      </div>
    </div>
  );
}

export default Todo;
