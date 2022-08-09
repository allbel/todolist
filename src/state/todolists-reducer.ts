import {FilterValuesType, TodolistsType} from "../App";
import {v1} from "uuid";

export const todolistsReducer = (state: Array<TodolistsType>, action: TsarType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [...state, {id: v1(), title: action.payload.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
        default:
            return state
    }
}


type TsarType = RemoveTodolistACType | AddTodoListAC | ChangeTodolistTitleAC | ChangeTodolistFilterAC

type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistId
        }
    } as const
}

type AddTodoListAC = ReturnType<typeof addTodoListAC>

export const addTodoListAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            title
        }
    } as const
}

type ChangeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id: todolistId,
            title: title
        }
    } as const
}

type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>

export const changeTodolistFilterAC = (todolistId: string, newFilter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id: todolistId,
            filter: newFilter
        }
    } as const
}