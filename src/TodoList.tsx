import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType} from "./App";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTodolist: (todolistID: string) => void
    removeTask: (todolistID: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterValuesType) => void
    changeTaskStatus: (todolistID: string, taskID: string, isDone: boolean) => void
    addTask: (todolistID: string, title: string) => void
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

            const removeTask = () => props.removeTask(props.todolistID, task.id)

            const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(props.todolistID, task.id, e.currentTarget.checked)

            return (
                <li key={task.id}>
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
            props.addTask(props.todolistID, title)
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

    const onClickAllHandler = () => props.changeFilter(props.todolistID, 'all')
    const onClickActiveHandler = () => props.changeFilter(props.todolistID, 'active')
    const onClickCompletedHandler = () => props.changeFilter(props.todolistID, 'completed')

    const onClickRemoveTodolist = () => props.removeTodolist(props.todolistID)

    return (
        <div>
            <h3>{props.title} <button onClick={onClickRemoveTodolist}>x</button></h3>
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