import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{todolistId: string}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
            // return state.filter(tl => tl.id !== action.todolistId)
        },
        addTodoListAC(state, action: PayloadAction<{todolist: TodolistType}>) {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            // return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        },
        changeTodolistTitleAC(state, action: PayloadAction<{todolistId: string, title: string}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
            // return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        },
        changeTodolistFilterAC(state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
            // return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        },
        changeTodolistStatusAC(state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
            // return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
        },
        fetchTodolistsAC(state, action: PayloadAction<{todos: TodolistType[]}>) {
            return action.payload.todos.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
            // return action.todos.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC, addTodoListAC, changeTodolistTitleAC,
    changeTodolistFilterAC, changeTodolistStatusAC, fetchTodolistsAC
} = slice.actions

// thunks
export const fetchTodosTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(fetchTodolistsAC({todos: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const removeTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistStatusAC({todolistId, entityStatus: 'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
        dispatch(changeTodolistStatusAC({todolistId, entityStatus: 'idle'}))
    })
}

export const addTodoTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const updateTodoTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({todolistId, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

// types
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodoListAC = ReturnType<typeof addTodoListAC>
export type FetchTodolistsACType = ReturnType<typeof fetchTodolistsAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}