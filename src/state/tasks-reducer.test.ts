import {
    addTaskAC,
    changeTaskAC,
    changeTaskTitleStatusAC,
    fetchTasksTC,
    removeTaskAC, setTasksAC,
    tasksReducer
} from './tasks-reducer';
import {TasksStateType} from '../App';
import {addTodoListAC, fetchTodolistsAC, TodolistDomainType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, TodolistType} from "../api/todolist-api";


let startState: TasksStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "React", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "2", title: "milk", status: TaskStatuses.Completed, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "tea", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("todolistId2", "2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "React", status: TaskStatuses.New, description: '', todoListId: "todolistId1",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "tea", status: TaskStatuses.New, description: '', todoListId: "todolistId2",
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' }
        ]
    });

});

test('correct task should be added to correct array', () => {

    const task: TaskType = {
        id: 'sdadssd',
        title: 'test',
        todoListId: 'todolistId2',
        priority: TaskPriorities.Low,
        addedDate: '',
        order: 0,
        description: null,
        deadline: null,
        startDate: null,
        status: TaskStatuses.New
    }

    const action = addTaskAC(task);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("test");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {


    const task: TaskType = {
        id: '3',
        title: 'test',
        todoListId: 'todolistId2',
        priority: TaskPriorities.Low,
        addedDate: '',
        order: 0,
        description: null,
        deadline: null,
        startDate: null,
        status: TaskStatuses.Completed
    }

    const action = changeTaskAC(task);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][2].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId1"][2].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = changeTaskTitleStatusAC("2", "newTitle", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("newTitle");
    expect(endState["todolistId1"][1].title).toBe("JS");
});


test('new array should be added when new todolist is added', () => {

    const todo: TodolistDomainType = {
        id: 'ddsff',
        title: 'test',
        filter: "all",
        order: 0,
        addedDate: ''
    }

    const action = addTodoListAC(todo);

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property arrays should be added when set todolists', () => {

    const action = fetchTodolistsAC([
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''},
    ]);

    const endState = tasksReducer({}, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([]);
    expect(endState['2']).toStrictEqual([]);
});

test('tasks should be added for todolist', () => {

    const action = setTasksAC('todolistId1', startState['todolistId1']);

    const endState = tasksReducer({
        todolistId1: [],
        todolistId2: [],
    }, action)


    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
});
