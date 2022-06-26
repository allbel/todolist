import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

function App() {
    const title_1 = "What to learn";
    const title_2 = "What to learn";

    const tasks_1: Array<TaskType> = [
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS/ES6", isDone: false},
    ];

    const tasks_2: Array<TaskType> = [
        {id: 1, title: "React", isDone: true},
        {id: 2, title: "Vue", isDone: false},
        {id: 3, title: "Angular", isDone: false},
    ];

    return (
        <div className="App">
            <TodoList title={title_1} tasks={tasks_1} />
            <TodoList title={title_2} tasks={tasks_2} />
        </div>
    );
}

export default App;
