// import React from 'react'
import Button from '@mui/material/Button';
interface Props {
    title: string,
    onClick: () => void
}

export default function Buttons({ title, onClick }: Props) {
    return (
        <>
            <Button variant="contained" fullWidth onClick={onClick}>
                {title}
            </Button>
        </>
    )
}
