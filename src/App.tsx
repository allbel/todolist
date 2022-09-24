import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./components/AddItemForm";
import ButtonAppBar from "./components/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";
import {FilterValuesType, TodolistDomainType} from "./state/todolists-reducer";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistID2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '', todoListId: todolistID1,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, description: '', todoListId: todolistID1,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''
            },
        ],
        [todolistID2]: [
            {
                id: v1(), title: "HTML&CSS2", status: TaskStatuses.Completed, description: '', todoListId: todolistID2,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''
            },
            {
                id: v1(), title: "JS2", status: TaskStatuses.Completed, description: '', todoListId: todolistID2,
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''
            },
        ]
    });

    const removeTodolist = (todolistID: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistID))
        delete tasks[todolistID]
    }

    const changeTodolistTitle = (todolistID: string, title: string) => {
        setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, title} : tl))
    }

    const removeTask = (todolistID: string, taskID: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(t => t.id !== taskID)})
    }

    const addTask = (todolistID: string, title: string) => {
        setTasks({
            ...tasks,
            [todolistID]: [{id: v1(), title, status: TaskStatuses.New, description: '', todoListId: todolistID,
            startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''}, ...tasks[todolistID]]
        })
    }

    const changeTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, status} : t)})
    }

    const changeTaskTitle = (todolistID: string, taskID: string, title: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, title} : t)})
    }

    const changeFilter = (todolistID: string, filter: FilterValuesType) => {
        setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, filter} : tl))
    }

    const addTodolist = (title: string) => {
        const newTodolist: TodolistDomainType = {id: v1(), title, filter: 'all', addedDate: '', order: 0}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newTodolist.id]: []})
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

export default App;
