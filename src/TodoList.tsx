import React from 'react';
import {FilterValuesType} from "./App";


export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: number) => void
    changeFilter: (filter: FilterValuesType) => void
}

const TodoList = (props: TodoListPropsType) => {

    const tasksListItems = props.tasks.length

        ? props.tasks.map(task => {

            const removeTask = () => props.removeTask(task.id)

            return (
                <li>
                    <input type="checkbox" checked={task.isDone} />
                    <span>{task.title}</span>
                    <button onClick={removeTask}>x</button>
                </li>
            )
        }) : <span>TaskList is empty</span>

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>

            <ul>
                {tasksListItems}
            </ul>

            <div>
                <button onClick={ () => props.changeFilter('all') }>All</button>
                <button onClick={ () => props.changeFilter('active') }>Active</button>
                <button onClick={ () => props.changeFilter('completed') }>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;