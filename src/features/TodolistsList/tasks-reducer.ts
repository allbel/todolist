import {
    addTodoListAC,
    fetchTodolistsAC,
    removeTodolistAC
} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasksTC', (todoId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    return todolistAPI.getTasks(todoId)
        .then((res) => {
            // thunkAPI.dispatch(setTasksAC({todoId, tasks: res.data.items}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoId, tasks: res.data.items};
        })
        //     .catch((e: AxiosError) => {
        //     handleServerNetworkError(thunkAPI.dispatch, e)
        // })
})

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{todolistId: string, taskID: string}>) {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
            // return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskID)}
        },
        addTaskAC(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
            // return {...state, [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]}
        },
        changeTaskAC(state, action: PayloadAction<{task: TaskType}>) {
            const index = state[action.payload.task.todoListId].findIndex(task => task.id === action.payload.task.id)
            if (index > -1) {
                state[action.payload.task.todoListId][index] = {...state[action.payload.task.todoListId][index], ...action.payload.task}
            }
            // return {
            //     ...state,
            //     [action.task.todoListId]: state[action.task.todoListId].map((task) =>
            //         task.id === action.task.id ? {...task, ...action.task} : task)
            // }
        },
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
        builder.addCase(fetchTodolistsAC, (state, action) => {
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
    }
})

export const tasksReducer = slice.reducer
export const {
    removeTaskAC, addTaskAC, changeTaskAC,
    changeTaskTitleAC, changeTaskStatusAC
} = slice.actions

// thunks
export const removeTaskTC = (todolistId: string, taskID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'loading'}))
    todolistAPI.deleteTask(todolistId, taskID)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({todolistId, taskID}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const updateTaskTC = (todolistId: string, taskID: string, value: UpdateTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'loading'}))
        const task = getState().tasks[todolistId].find(task => task.id === taskID)

        if (task) {
            const taskUpdate: UpdateTaskType = {
                ...task,
                ...value
            }
            todolistAPI.updateTask(todolistId, taskID, taskUpdate)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskAC({task: res.data.data.item}))
                        dispatch(setAppStatusAC({status: 'succeeded'}))
                        dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'succeeded'}))
                    } else {
                        handleServerAppError(dispatch, res.data)
                        dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'failed'}))
                    }
                }).catch((e: AxiosError) => {
                handleServerNetworkError(dispatch, e)
                dispatch(changeTaskStatusAC({todolistId, taskID, entityStatus: 'failed'}))
            })
        }
    }


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