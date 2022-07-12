import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType} from "./App";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    changeTaskStatus: (taskID: string, isDone: boolean) => void
    addTask: (title: string) => void
}

const TodoList = (props: TodoListPropsType) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }


    const tasksListItems = props.tasks.length
        ? props.tasks.map(task => {

            const removeTask = () => props.removeTask(task.id)

            const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(task.id, e.currentTarget.checked)

            return (
                <li>
                    <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={onChangeTaskStatus}
                    />
                    <span className={task.isDone ? "isDone" : ""}>{task.title}</span>
                    <button onClick={removeTask}>x</button>
                </li>
            )
        }) : <span>TaskList is empty</span>


    const onClickAddTAsk = () => {
        if (title.trim()) {
            props.addTask(title)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickAddTAsk()
        }
    }

    const onClickAllHandler = () => props.changeFilter('all')
    const onClickActiveHandler = () => props.changeFilter('active')
    const onClickCompletedHandler = () => props.changeFilter('completed')

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeInputHandler}
                    onKeyDown={onKeyDownAddTask}
                    className={ error ? "error" : ""}
                />
                <button onClick={onClickAddTAsk}>+</button>
                {error && <div style={{color: "red"}}>Title is required!</div>}
            </div>

            <ul>
                {tasksListItems}
            </ul>

            <div>
                <button className={props.filter === "all" ? "active" : ""} onClick={ onClickAllHandler }>All</button>
                <button className={props.filter === "active" ? "active" : ""} onClick={ onClickActiveHandler }>Active</button>
                <button className={props.filter === "completed" ? "active" : ""} onClick={ onClickCompletedHandler }>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;