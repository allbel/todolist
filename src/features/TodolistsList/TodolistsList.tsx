import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../app/store";
import {
    changeTodolistFilterAC,
    addTodoTC,
    removeTodoTC,
    fetchTodosTC,
    FilterValuesType,
    TodolistDomainType,
    updateTodoTitleTC
} from "./todolists-reducer";
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import TodoList from "./TodoList";
import {Navigate} from "react-router-dom";

export const TodolistsList: React.FC = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    // const dispatch = useDispatch()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(fetchTodosTC())
    }, [])

    const removeTodolist = useCallback((todolistID: string) => {
        dispatch(removeTodoTC(todolistID))
    }, [dispatch])

    const changeTodolistTitle = useCallback((todolistID: string, title: string) => {
        dispatch(updateTodoTitleTC(todolistID, title))
    }, [dispatch])

    const changeFilter = useCallback((todolistID: string, filter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(todolistID, filter))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodoTC(title))
    }, [dispatch])

    const removeTask = useCallback((todolistID: string, taskID: string) => {
        dispatch(removeTaskTC(todolistID, taskID))
    }, [dispatch])

    const addTask = useCallback((todolistID: string, title: string) => {
        dispatch(addTaskTC(todolistID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistID: string, taskID: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskID, {status}))
    }, [dispatch])

    const changeTaskTitle = useCallback((todolistID: string, taskID: string, title: string) => {
        dispatch(updateTaskTC(todolistID, taskID, {title}))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>

            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        return (
                            <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                        todolistID={tl.id}
                                        title={tl.title}
                                        entityStatus={tl.entityStatus}
                                        tasks={tasks[tl.id]}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        addTask={addTask}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}