import {AddTodoListAC, FetchTodolistsACType, RemoveTodolistACType} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistAPI, UpdateTaskType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
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
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'CHANGE-TASK':
            return {...state,
                [action.task.todoListId]: state[action.task.todoListId].map((task) =>
                    task.id === action.task.id ? {...task, ...action.task} : task)}
        case 'CHANGE-TASK-TITLE':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t =>
                    t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            // const {[action.id]: [], ...rest} = {...state}
            // return rest
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        default:
            return state
    }
}


// actions

export const removeTaskAC = (todolistId: string, taskID: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskID} as const)

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)

export const changeTaskAC = (task: TaskType) =>
    ({type: 'CHANGE-TASK', task} as const)

export const changeTaskTitleStatusAC = (taskID: string, title: string, todolistId: string) =>
    ({type: 'CHANGE-TASK-TITLE', taskID, title, todolistId} as const)

export const setTasksAC = (todoId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todoId, tasks} as const)


// thunks

export const fetchTasksTC = (todoId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAC(todoId, res.data.items))
        })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.deleteTask(todoId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todoId, taskId))
        })
}

export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const task = getState().tasks[todoId].find(task => task.id === taskId)

        if (task) {
            const taskUpdate: UpdateTaskType = {
                ...task,
                ...value
            }
            todolistAPI.updateTask(todoId, taskId, taskUpdate)
                .then((res) => {
                    dispatch(changeTaskAC(res.data.data.item))
                })
        }
    }


// types

type ActionsType = ReturnType<typeof removeTaskAC> | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskAC> | ReturnType<typeof changeTaskTitleStatusAC>
    | ReturnType<typeof setTasksAC>
    | AddTodoListAC | RemoveTodolistACType | FetchTodolistsACType

type UpdateTaskModelType = {
    title?: string,
    description?: null | string
    status?: TaskStatuses
    priority?: number
    startDate?: null | string
    deadline?: null | string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}