import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {Button, TextField} from "@mui/material";

type PropsType = {
    addItem: (title: string) => void
}

const AddItemForm = memo((props: PropsType) => {

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
            <TextField id="outlined-basic"
                       label={error ? "Title is required!" : "Add title"}
                       variant="outlined"
                       size={"small"}
                       error={!!error}
                       value={title}
                       onChange={onChangeInputHandler}
                       onKeyDown={onKeyDownAddTask}
            />
            <Button onClick={onClickAddTAsk} variant="contained"
                    style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
            >+</Button>
        </div>
    );
})

export default AddItemForm;