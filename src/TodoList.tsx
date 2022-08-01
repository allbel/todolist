import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./App";
import AddItemForm from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";
import {Button} from "@mui/material";


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
    changeTodolistTitle: (todolistID: string, title: string) => void
    removeTask: (todolistID: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterValuesType) => void
    changeTaskStatus: (todolistID: string, taskID: string, isDone: boolean) => void
    changeTaskTitle: (todolistID: string, taskID: string, title: string) => void
    addTask: (todolistID: string, title: string) => void
}

const TodoList = (props: TodoListPropsType) => {

    const tasksListItems = props.tasks.length
        ? props.tasks.map(task => {

            const removeTask = () => props.removeTask(props.todolistID, task.id)

            const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(props.todolistID, task.id, e.currentTarget.checked)

            const onChangeTitleHandler = (title: string) => {
                props.changeTaskTitle(props.todolistID, task.id, title)
            }

            return (
                <li key={task.id}>
                    <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={onChangeTaskStatus}
                    />
                    <EditableSpan title={task.title} callBack={onChangeTitleHandler}/>
                    <button onClick={removeTask}>x</button>
                </li>
            )
        }) : <span>TaskList is empty</span>

    const onClickAllHandler = () => props.changeFilter(props.todolistID, 'all')
    const onClickActiveHandler = () => props.changeFilter(props.todolistID, 'active')
    const onClickCompletedHandler = () => props.changeFilter(props.todolistID, 'completed')

    const onClickRemoveTodolist = () => props.removeTodolist(props.todolistID)
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.todolistID, title)
    }

    const addTask = (title: string) => {
        props.addTask(props.todolistID, title)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callBack={changeTodolistTitle}/>
                {/*<button onClick={onClickRemoveTodolist}>x</button>*/}
                <Button onClick={onClickRemoveTodolist} variant="contained" color="success">x</Button>
            </h3>

            <AddItemForm addItem={addTask}/>

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