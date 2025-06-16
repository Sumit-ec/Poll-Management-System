// import React from 'react'
import TextField from '@mui/material/TextField';

export default function InputEmail({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className='input-container'>
            <TextField
                id="standard-email-input"
                label="Email"
                type="email"
                autoComplete="current-email"
                variant="standard"
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}
            />
        </div>
    )
}
