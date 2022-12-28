import {addTodoListAC, fetchTodosTC, removeTodolistAC} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../../api/todolist-api";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasksTC', async (todoId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistAPI.getTasks(todoId)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    // thunkAPI.dispatch(setTasksAC({todoId, tasks: res.data.items}))
    return {todoId, tasks: res.data.items};

    //     .catch((e: AxiosError) => {
    //     handleServerNetworkError(thunkAPI.dispatch, e)
    // })
})

export const removeTaskTC = createAsyncThunk('tasks/removeTaskTC', async (param: {todolistId: string, taskID: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTaskStatusAC({todolistId: param.todolistId, taskID: param.taskID, entityStatus: 'loading'}))
    await todolistAPI.deleteTask(param.todolistId, param.taskID)
        // .then((res) => {
            // if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                // thunkAPI.dispatch(removeTaskAC({todolistId: param.todolistId, taskID: param.taskID}))
                return {todolistId: param.todolistId, taskID: param.taskID}
            // } else {
            //     handleServerAppError(thunkAPI.dispatch, res.data)
            // }
        // })
        // .catch((e: AxiosError) => {
        // handleServerNetworkError(thunkAPI.dispatch, e)
    // })
})

export const addTaskTC = createAsyncThunk('tasks/addTaskTC', async ({todoId, title}: {todoId: string, title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(todoId, title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            // dispatch(addTaskAC(res.data.data.item))
            return res.data.data.item
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch(err) {
        const error = err as Error | AxiosError
        handleServerNetworkError(dispatch, error)
        return rejectWithValue(null)
    }
})

export const updateTaskTC = createAsyncThunk(
    'tasks/updateTaskTC',
    async (
        param: {todolistId: string, taskID: string, value: UpdateTaskModelType},
        {dispatch, rejectWithValue, getState}
    ) => {
        const {todolistId, taskID, value} = param
        const state = getState() as AppRootStateType

        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'loading'}))
        const task = state.tasks[todolistId].find(task => task.id === taskID)

        if (!task) {
            return rejectWithValue('task not found in the state')
        }

        const taskUpdate: UpdateTaskType = {...task, ...value}

        try {
            const res = await todolistAPI.updateTask(todolistId, taskID, taskUpdate)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'succeeded'}))
                // dispatch(changeTaskAC({task: res.data.data.item}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(dispatch, res.data)
                dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'failed'}))
                return rejectWithValue(null)
            }
        } catch(err) {
            const error = err as Error | AxiosError
            handleServerNetworkError(dispatch, error)
            dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'failed'}))
            return rejectWithValue(null)
        }
    })


const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        changeTaskTitleAC(state, action: PayloadAction<{taskID: string, title: string, todolistId: string}>) {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskID)
            state[action.payload.todolistId][index].title = action.payload.title
            // return {
            //     ...state,
            //     [action.todolistId]: state[action.todolistId].map(t =>
            //         t.id === action.taskID ? {...t, title: action.title} : t)
            // }
        },
        changeTaskStatusAC(state, action: PayloadAction<{todolistId: string, taskID: string, entityStatus: RequestStatusType}>) {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskID)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
            // return {...state, [action.todolistId]: state[action.todolistId]
            //         .map(t => t.id === action.taskID ? {...t, entityStatus: action.entityStatus} : t)}
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todolist.id] = []
            // return {...state, [action.payload.todolist.id]: []}
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
            // 1) const {[action.id]: [], ...rest} = {...state}
            //    return rest

            // 2) let copyState = {...state}
            //    delete copyState[action.payload.todolistId]
            //    return copyState
        })
        builder.addCase(fetchTodosTC.fulfilled, (state, action) => {
            action.payload.todos.forEach((todo) => {
                state[todo.id] = []
            })
            // const stateCopy = {...state}
            // action.payload.todos.forEach((todo) => {
            //     stateCopy[todo.id] = []
            // })
            // return stateCopy
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.task.todoListId].findIndex(task => task.id === action.payload.task.id)
            if (index > -1) {
                state[action.payload.task.todoListId][index] = {...state[action.payload.task.todoListId][index], ...action.payload.task}
            }
        })
    }
})

export const tasksReducer = slice.reducer
export const {changeTaskTitleAC, changeTaskStatusAC} = slice.actions


// types
type UpdateTaskModelType = {
    title?: string,
    description?: null | string
    status?: TaskStatuses
    priority?: number
    startDate?: null | string
    deadline?: null | string
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}