import React, {memo, useCallback, useEffect} from 'react';
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import Task from "./Todolist/Task/Task";
import {TaskStatuses} from "../../api/todolist-api";
import {FilterValuesType} from "./todolists-reducer";
import {useAppDispatch} from "../../app/store";
import {fetchTasksTC, TaskDomainType} from "./tasks-reducer";
import {RequestStatusType} from "../../app/app-reducer";


type TodoListPropsType = {
    todolistID: string
    title: string
    entityStatus: RequestStatusType
    tasks: Array<TaskDomainType>
    filter: FilterValuesType
    removeTodolist: (todolistID: string) => void
    changeTodolistTitle: (todolistID: string, title: string) => void
    removeTask: (todolistID: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterValuesType) => void
    changeTaskStatus: (todolistID: string, taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistID: string, taskID: string, title: string) => void
    addTask: (todolistID: string, title: string) => void
}

const TodoList = memo((props: TodoListPropsType) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(props.todolistID))
    }, [])

    let tasks = props.tasks

    if (props.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if (props.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }

    const removeTask = useCallback((taskID: string) => {
        props.removeTask(props.todolistID, taskID)
    }, [props.removeTask, props.todolistID])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses) => {
        props.changeTaskStatus(props.todolistID, taskID, status)
    }, [props.changeTaskStatus, props.todolistID])

    const changeTaskTitle = useCallback((taskID: string, title: string) => {
        props.changeTaskTitle(props.todolistID, taskID, title)
    }, [props.changeTaskTitle, props.todolistID])

    const tasksListItems = tasks.length
        ? tasks.map(task => {
            return (
                <Task
                    key={task.id}
                    task={task}
                    removeTask={removeTask}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
                    disabled={props.entityStatus === 'loading'}
                />
            )
        }) : <span>TaskList is empty</span>

    const onClickAllHandler = () => props.changeFilter(props.todolistID, 'all')
    const onClickActiveHandler = () => props.changeFilter(props.todolistID, 'active')
    const onClickCompletedHandler = () => props.changeFilter(props.todolistID, 'completed')

    const onClickRemoveTodolist = () => props.removeTodolist(props.todolistID)
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.todolistID, title)
    }

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolistID, title)
    }, [props.addTask, props.todolistID])

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callBack={changeTodolistTitle} disabled={props.entityStatus === 'loading'}/>
                <IconButton aria-label="delete" onClick={onClickRemoveTodolist} disabled={props.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>

            <ul>
                {tasksListItems}
            </ul>

            <div>
                <Button variant={props.filter === "all" ? "text" : "contained"} color={'success'} onClick={ onClickAllHandler }>All</Button>
                <Button variant={props.filter === "active" ? "text" : "contained"} color={'secondary'} onClick={ onClickActiveHandler }>Active</Button>
                <Button variant={props.filter === "completed" ? "text" : "contained"} color={'error'} onClick={ onClickCompletedHandler }>Completed</Button>
            </div>
        </div>
    );
})

export default TodoList;