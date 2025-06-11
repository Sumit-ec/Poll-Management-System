// import React from 'react'
import TextField from '@mui/material/TextField';

export default function InputName({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className='input-container'>
            <TextField
                id="standard-name-input"
                label="Name"
                type="text"
                autoComplete="current-name"
                variant="standard"
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}

            />
        </div>
    )
}
