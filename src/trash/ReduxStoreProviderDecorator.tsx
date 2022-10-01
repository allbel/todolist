import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType, store} from "../app/store";
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: '', order: 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
            {id: v1(), title: "JS", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''}
        ]
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState);

const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
};

export default ReduxStoreProviderDecorator;