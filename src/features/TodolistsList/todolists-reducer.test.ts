import {
    addTodoListAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, fetchTodosTC, FilterValuesType, removeTodoTC,
    TodolistDomainType,
    todolistsReducer
} from './todolists-reducer';
import {v1} from 'uuid';

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>


beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const action = removeTodoTC.fulfilled({todolistId: todolistId1}, 'requestId', todolistId1)

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    const todolist: TodolistDomainType = {
        id: 'ddsff',
        title: 'test',
        filter: "all",
        order: 0,
        addedDate: '',
        entityStatus: "idle"
    }

    const endState = todolistsReducer(startState, addTodoListAC({todolist}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('test');
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const action = {
        type: 'CHANGE-TODOLIST-TITLE',
        id: todolistId2,
        title: newTodolistTitle
    };

    const endState = todolistsReducer(startState, changeTodolistTitleAC({todolistId: todolistId2, title: newTodolistTitle}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";

    const action = {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todolistId2,
        filter: newFilter
    };

    const endState = todolistsReducer(startState, changeTodolistFilterAC({todolistId: todolistId2, filter: newFilter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todos should be set to the state', () => {
    const action = fetchTodosTC.fulfilled({todos: startState}, 'requestId')

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
