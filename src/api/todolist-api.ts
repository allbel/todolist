import axios, {AxiosResponse} from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '4f8a82d1-a403-460a-a772-c2c60b837a88'
    }
})


// api

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists`)
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>(`todo-lists`, { title })
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title })
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`/todo-lists/${todolistId}/tasks`, { title })
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskType) {
        return instance.put<UpdateTaskType, AxiosResponse<ResponseType<{item: TaskType}>>>(`/todo-lists/${todolistId}/tasks/${taskId}`, task)
    }
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{userId: number}>>>(`/auth/login`, data)
    },
    logout() {
        return instance.delete<ResponseType>(`/auth/login`)
    },
    me() {
        return instance.get<ResponseType<MeType>>(`/auth/me`)
    }
}



// types

type MeType = {
    id: number
    email: string
    login: string
}

export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe?: boolean,
    captcha?: string
}

export type TodolistType= {
    id: string
    title: string
    addedDate: string
    order: number
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum StatusCode {
    Ok = 0,
    Error = 1,
    Captcha = 10
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    id: string
    title: string,
    description: null | string
    addedDate: string
    deadline: null | string
    order: number
    priority: TaskPriorities
    startDate: null | string
    status: TaskStatuses
    todoListId: string
}

export type UpdateTaskType = {
    title: string,
    description: null | string
    status: TaskStatuses
    priority: number
    startDate: null | string
    deadline: null | string
}

type GetTasksResponseType = {
    error: null | string
    totalCount: number
    items: TaskType[]
}

export type FieldErrorType = { field: string; error: string };
export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors?: FieldErrorType[]
    data: D
}