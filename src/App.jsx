import './App.css';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {StoreContextProvider}  from './common/Store';
import HomePage from "./common/HomePage";


function App() {
    const [mode, setMode] = useState(() => localStorage.getItem('colorMode') || 'light');
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    const toggleColorMode = () => {
        setMode((prev) => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('colorMode', next);
            return next;
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StoreContextProvider>
                <HomePage/>
                <IconButton
                    onClick={toggleColorMode}
                    aria-label="toggle dark mode"
                    sx={{
                        position: 'fixed',
                        top: 12,
                        right: 12,
                        zIndex: 20000,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper' },
                    }}
                >
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </StoreContextProvider>
        </ThemeProvider>
    );
}

export default App;
