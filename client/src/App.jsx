import React, { Context, Consumer, useState } from 'react';
import DistMap from './Map.jsx';
import bar from './bar.jsx';
import {Menu, MenuItem, FormControl, InputLabel, Select} from '@mui/material'

export default function App(){
    const [state, setState] = useState("");
    let handleChange = (e) => {
        setState(e.target.value);
    }
    return (
        <>
            <div id='header'>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">State</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state}
                        label="State"
                        onChange={handleChange}
                    >
                        <MenuItem value={'Georgia'}>Georgia</MenuItem>
                        <MenuItem value={'Illinois'}>Illinois</MenuItem>
                        <MenuItem value={'New York'}>New York</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div id='main'>
                <DistMap state={state}></DistMap>
                <div id='stats'>STATS HERE</div>
            </div>
            
        </>
    );
}