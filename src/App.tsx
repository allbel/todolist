import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    const title_1 = "What to learn";
    const title_2 = "What to learn";

    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "Angular", isDone: false},
    ])

    const removeTask = (taskID: number) => {
        setTasks(tasks.filter(task => task.id !== taskID))
    }

    const [filter, setFilter] = useState<FilterValuesType>('all');

    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    let tasksForRender;

    switch (filter) {
        case 'completed':
            tasksForRender = tasks.filter(t => t.isDone === true)
            break
        case 'active':
            tasksForRender = tasks.filter(t => t.isDone === false)
            break
        default:
            tasksForRender = tasks
    }

    return (
        <div className="App">
            <TodoList
                title={title_1}
                tasks={tasksForRender}
                removeTask={removeTask}
                changeFilter={changeFilter}
            />
            {/*<TodoList title={title_2} tasks={tasks_2} />*/}
        </div>
    );
}

export default App;
