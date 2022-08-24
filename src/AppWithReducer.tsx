import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleStatusAC,
    removeTaskAC,
    tasksReducer
} from "./state/tasks-reducer";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithReducer() {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", isDone: true},
            {id: v1(), title: "JS2", isDone: true},
            {id: v1(), title: "ReactJS2", isDone: false},
            {id: v1(), title: "Rest API2", isDone: false},
            {id: v1(), title: "GraphQL2", isDone: false},
        ]
    });

    const removeTodolist = (todolistID: string) => {
        // setTodolists(todolists.filter(tl => tl.id !== todolistID))
        // delete tasks[todolistID]
        const action = removeTodolistAC(todolistID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeTodolistTitle = (todolistID: string, title: string) => {
        // setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, title} : tl))
        dispatchToTodolists(changeTodolistTitleAC(todolistID, title))
    }

    const changeFilter = (todolistID: string, filter: FilterValuesType) => {
        // setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, filter} : tl))
        dispatchToTodolists(changeTodolistFilterAC(todolistID, filter))
    }

    const addTodolist = (title: string) => {
        // const newTodolist: TodolistsType = {id: v1(), title, filter: 'all'}
        // setTodolists([newTodolist, ...todolists])
        // setTasks({...tasks, [newTodolist.id]: []})
        let action = addTodoListAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const removeTask = (todolistID: string, taskID: string) => {
        // setTasks({...tasks, [todolistID]: tasks[todolistID].filter(t => t.id !== taskID)})
        dispatchToTasks(removeTaskAC(taskID, todolistID))
    }

    const addTask = (todolistID: string, title: string) => {
        // setTasks({...tasks, [todolistID]: [{id: v1(), title, isDone: false}, ...tasks[todolistID]]})
        dispatchToTasks(addTaskAC(title, todolistID))
    }

    const changeTaskStatus = (todolistID: string, taskID: string, isDone: boolean) => {
        // setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, isDone} : t)})
        dispatchToTasks(changeTaskStatusAC(taskID, isDone, todolistID))
    }

    const changeTaskTitle = (todolistID: string, taskID: string, title: string) => {
        // setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, title} : t)})
        dispatchToTasks(changeTaskTitleStatusAC(taskID, title, todolistID))
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

export default AppWithReducer;
