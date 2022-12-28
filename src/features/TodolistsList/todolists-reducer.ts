import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTodosTC = createAsyncThunk('todolists/fetchTodosTC',
    async (param, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            const res = await todolistAPI.getTodolists()
            dispatch(setAppStatusAC({status: 'succeeded'}))
            // dispatch(fetchTodolistsAC({todos: res.data}))
            return {todos: res.data}
        } catch(e) {
            const error = e as Error | AxiosError
            handleServerNetworkError(dispatch, error)
            return rejectWithValue(null)
        }
    })

export const removeTodoTC = createAsyncThunk('todolists/removeTodoTC',
    async (todolistId: string, {dispatch, rejectWithValue} ) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistStatusAC({todolistId, entityStatus: 'loading'}))
        try {
            const res = await todolistAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                // dispatch(removeTodolistAC({todolistId}))
                return {todolistId}
            } else {
                handleServerAppError(dispatch, res.data)
                return rejectWithValue(null)
            }
        } catch(e) {
            const error = e as Error | AxiosError
            handleServerNetworkError(dispatch, error)
            dispatch(changeTodolistStatusAC({todolistId, entityStatus: 'idle'}))
            return rejectWithValue(null)
        }
    })

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
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
    },
    extraReducers: builder => {
        builder.addCase(fetchTodosTC.fulfilled, (state, action) => {
            return action.payload.todos.map(todo => ({...todo, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(removeTodoTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
            // return state.filter(tl => tl.id !== action.todolistId)
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    addTodoListAC, changeTodolistTitleAC,
    changeTodolistFilterAC, changeTodolistStatusAC
} = slice.actions

// thunks
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
export type AddTodoListAC = ReturnType<typeof addTodoListAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}