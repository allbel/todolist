import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '4f8a82d1-a403-460a-a772-c2c60b837a88'
    }
})

type TodolistType= {
    id: string
    title: string
    addedDate: string
    order: number
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: D
}

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        const promise = instance.put<ResponseType>(`todo-lists/${todolistId}`, { title })
        return promise
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{item: TodolistType}>>(`todo-lists`, { title })
        return promise
    },
    deleteTodolist(todolistId: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${todolistId}`)
        return promise
    },
    getTodolists() {
        const promise = instance.get<TodolistType[]>(`todo-lists`)
        return promise
    }
}


type TaskType = {
    id: string
    title: string,
    description: null | string
    addedDate: string
    deadline: null | string
    order: number
    priority: number
    startDate: null | string
    status: number
    todoListId: string
}

export type UpdateTaskType = {
    title: string,
    description: null | string
    status: number
    priority: number
    startDate: null | string
    deadline: null | string
    order: number
}

type GetTasksResponseType = {
    error: null | string
    totalCount: number
    items: TaskType[]
}

export const taskAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`/todo-lists/${todolistId}/tasks`, { title })
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskType) {
        return instance.put<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`, task)
    }
}