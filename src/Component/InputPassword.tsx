// import React from 'react'
import TextField from '@mui/material/TextField';

export default function InputPassword({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className='input-container'>
            <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="standard"
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}
            />
        </div>
    )
}
