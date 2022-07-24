import React from 'react';
import { Box, Paper } from '@mui/material';
import { Link } from "react-router-dom";

export default function Page(props) {
    return (
        <Box xs={8} sx={{ width: '100%' }}>
            <Paper elevation={10} sx={{ marginTop: '5px', padding: '2%' }}>
                <Link to="/">Go Home</Link>
                {props.children}
            </Paper>
        </Box>
    )
}