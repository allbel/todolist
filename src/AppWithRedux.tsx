import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleStatusAC,
    removeTaskAC,
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {

    let todolists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const removeTodolist = (todolistID: string) => {
        const action = removeTodolistAC(todolistID)
        dispatch(action)
    }

    const changeTodolistTitle = (todolistID: string, title: string) => {
        dispatch(changeTodolistTitleAC(todolistID, title))
    }

    const changeFilter = (todolistID: string, filter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(todolistID, filter))
    }

    const addTodolist = (title: string) => {
        let action = addTodoListAC(title)
        dispatch(action)
    }

    const removeTask = (todolistID: string, taskID: string) => {
        dispatch(removeTaskAC(taskID, todolistID))
    }

    const addTask = (todolistID: string, title: string) => {
        dispatch(addTaskAC(title, todolistID))
    }

    const changeTaskStatus = (todolistID: string, taskID: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(taskID, isDone, todolistID))
    }

    const changeTaskTitle = (todolistID: string, taskID: string, title: string) => {
        dispatch(changeTaskTitleStatusAC(taskID, title, todolistID))
    }

    return (
        <div className="App">

            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {

                        let tasksForRender = tasks[tl.id];

                        if (tl.filter === 'completed') {
                            tasksForRender = tasks[tl.id].filter(t => t.isDone === true)
                        }
                        if (tl.filter === 'active') {
                            tasksForRender = tasks[tl.id].filter(t => t.isDone === false)
                        }

                        return (
                            <Grid item>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                        key={tl.id}
                                        todolistID={tl.id}
                                        title={tl.title}
                                        tasks={tasksForRender}
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
                    })}
                </Grid>

            </Container>

        </div>
    );
}

export default AppWithRedux;
