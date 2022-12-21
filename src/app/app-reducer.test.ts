import {AppInitialState, appReducer, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let startSate: AppInitialState

beforeEach(() => {
    startSate = {
        error: null,
        status: "idle",
        isInitialized: false
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startSate, setAppErrorAC({error: 'some error'}))

    expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startSate, setAppStatusAC({status: 'loading'}))

    expect(endState.status).toBe('loading')
})
