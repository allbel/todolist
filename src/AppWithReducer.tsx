import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskAC,
    changeTaskTitleStatusAC,
    removeTaskAC,
    tasksReducer
} from "./state/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithReducer() {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistID2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '', todoListId: todolistID1,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
            {id: v1(), title: "JS", status: TaskStatuses.New, description: '', todoListId: todolistID1,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", status: TaskStatuses.Completed, description: '', todoListId: todolistID2,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
            {id: v1(), title: "JS2", status: TaskStatuses.New, description: '', todoListId: todolistID2,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
        ]
    });

    const removeTodolist = (todolistID: string) => {
        const action = removeTodolistAC(todolistID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeTodolistTitle = (todolistID: string, title: string) => {
        dispatchToTodolists(changeTodolistTitleAC(todolistID, title))
    }

    const changeFilter = (todolistID: string, filter: FilterValuesType) => {
        dispatchToTodolists(changeTodolistFilterAC(todolistID, filter))
    }

    const addTodolist = (title: string) => {
        let action = addTodoListAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const removeTask = (todolistID: string, taskID: string) => {
        dispatchToTasks(removeTaskAC(taskID, todolistID))
    }

    const addTask = (todolistID: string, title: string) => {

        const task: TaskType = {
            id: v1(),
            title: title,
            todoListId: todolistID,
            priority: TaskPriorities.Low,
            addedDate: '',
            order: 0,
            description: null,
            deadline: null,
            startDate: null,
            status: TaskStatuses.New
        }
        dispatchToTasks(addTaskAC(task))
    }

    const changeTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses) => {
        // dispatchToTasks(changeTaskAC(taskID, status, todolistID))
    }

    const changeTaskTitle = (todolistID: string, taskID: string, title: string) => {
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
                            tasksForRender = tasks[tl.id].filter(t => t.status === TaskStatuses.Completed)
                        }
                        if (tl.filter === 'active') {
                            tasksForRender = tasks[tl.id].filter(t => t.status === TaskStatuses.New)
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
