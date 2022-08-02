import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";

type PropsType = {
    addItem: (title: string) => void
}

const AddItemForm = (props: PropsType) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }

    const onClickAddTAsk = () => {
        if (title.trim()) {
            props.addItem(title)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickAddTAsk()
        }
    }

    return (
        <div>
            {/*<input*/}
            {/*    value={title}*/}
            {/*    onChange={onChangeInputHandler}*/}
            {/*    onKeyDown={onKeyDownAddTask}*/}
            {/*    className={error ? "error" : ""}*/}
            {/*/>*/}
            <TextField id="outlined-basic"
                       label={error ? "Title is required!" : "Add title"}
                       variant="outlined"
                       size={"small"}
                       error={!!error}
                       value={title}
                       onChange={onChangeInputHandler}
                       onKeyDown={onKeyDownAddTask}
                       // className={error ? "error" : ""}
            />

            {/*<button onClick={onClickAddTAsk}>+</button>*/}
            <Button onClick={onClickAddTAsk} variant="contained"
                    style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
            >+</Button>

            {/*{error && <div style={{color: "red"}}>Title is required!</div>}*/}
        </div>
    );
};

export default AddItemForm;