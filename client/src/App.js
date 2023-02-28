import './App.css';
import * as React from 'react';
import {StoreContextProvider}  from './common/Store';
import HomePage from "./common/HomePage";

function App() {
    return (
        <StoreContextProvider>
            <HomePage/>
        </StoreContextProvider>
    );
}

export default App;
