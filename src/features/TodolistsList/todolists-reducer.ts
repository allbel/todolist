import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppErrorAC,
    setAppErrorACType,
    setAppStatusAC,
    setAppStatusACType
} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOS':
            return action.todos.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case 'TODO/CHANGE-TODOLIST-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state
    }
}


// actions

export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId} as const)

export const addTodoListAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter} as const)

export const changeTodolistStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'TODO/CHANGE-TODOLIST-STATUS', todolistId, entityStatus} as const)

export const fetchTodolistsAC = (todos: TodolistType[]) =>
    ({type: 'SET-TODOS', todos} as const)


// thunks

export const fetchTodosTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(fetchTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const removeTodoTC = (todoId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistStatusAC(todoId, 'loading'))
    todolistAPI.deleteTodolist(todoId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todoId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
        dispatch(changeTodolistStatusAC(todoId, 'idle'))
    })
}

export const addTodoTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const updateTodoTitleTC = (todoId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todoId, title))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}


// types

type ActionsType = RemoveTodolistACType | AddTodoListAC
    | ChangeTodolistTitleAC | ChangeTodolistFilterAC
    | FetchTodolistsACType | setAppStatusACType
    | setAppErrorACType | ReturnType<typeof changeTodolistStatusAC>

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodoListAC = ReturnType<typeof addTodoListAC>
type ChangeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>
export type FetchTodolistsACType = ReturnType<typeof fetchTodolistsAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}