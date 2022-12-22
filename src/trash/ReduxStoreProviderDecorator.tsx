import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType, RootReducerType, store} from "../app/store";
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {appReducer} from "../app/app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {HashRouter} from "react-router-dom";


const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: "idle"}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '', entityStatus: "idle"},
            {id: v1(), title: "JS", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '', entityStatus: "idle"}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '', entityStatus: "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '', entityStatus: "idle"}
        ]
    },
    app: {
        status: 'idle',
        error: null,
        isInitialized: true
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
});

const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
};

export const BrowserRouterDecorator = (storyFn: any) => {
    <HashRouter>{storyFn()}</HashRouter>
};

export default ReduxStoreProviderDecorator;