import {v1} from "uuid";
import {AddTodoListAC, fetchTodolistsAC, FetchTodolistsACType, RemoveTodolistACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../api/todolist-api";
import {TasksStateType} from "../AppWithRedux";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todoId]: action.tasks}
        case "SET-TODOS":
            const stateCopy = {...state}
            action.todos.forEach((todo) => {
                stateCopy[todo.id] = []
            })
            return stateCopy
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            return {
                ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'CHANGE-TASK':
            return {...state,
                [action.task.todoListId]: state[action.task.todoListId].map((task) => task.id === action.task.id ? {...task, ...action.task} : task)
            }
        case 'CHANGE-TASK-TITLE':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskID ? {
                    ...t,
                    title: action.title
                } : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.payload.todolistId]: []}
        case 'REMOVE-TODOLIST':
            // const {[action.id]: [], ...rest} = {...state}
            // return rest
            let copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        default:
            return state
    }
}


type ActionType = ReturnType<typeof removeTaskAC> | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskAC> | ReturnType<typeof changeTaskTitleStatusAC>
    | ReturnType<typeof setTasksAC>
    | AddTodoListAC | RemoveTodolistACType | FetchTodolistsACType

export const removeTaskAC = (todolistId: string, taskID: string) => {
    return {type: 'REMOVE-TASK', todolistId, taskID} as const
}

export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}

export const changeTaskAC = (task: TaskType) => {
    return {type: 'CHANGE-TASK', task} as const
}

export const changeTaskTitleStatusAC = (taskID: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskID, title, todolistId} as const
}

export const setTasksAC = (todoId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todoId, tasks} as const)

export const fetchTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAC(todoId, res.data.items))
        })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todoId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todoId, taskId))
        })
}

export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

type UpdateTaskModelType = {
    title?: string,
    description?: null | string
    status?: TaskStatuses
    priority?: number
    startDate?: null | string
    deadline?: null | string
}

export const updateTaskTC = (todoId: string, taskId: string, payload: UpdateTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoId].find(task => task.id === taskId)

    if (task) {
        const taskUpdate: UpdateTaskType = {
            ...task,
            ...payload
        }
        todolistAPI.updateTask(todoId, taskId, taskUpdate)
            .then((res) => {
                dispatch(changeTaskAC(res.data.data.item))
            })
    }
}