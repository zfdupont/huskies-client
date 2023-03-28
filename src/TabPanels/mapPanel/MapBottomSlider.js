import * as React from 'react';
import {useContext} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import StoreContext from '../../common/Store';

export default function MapBottomSlider()
{
    const { storeMap } = useContext(StoreContext);
    const marks = [
        {
            value: 0,
            label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black"}}>2020</Typography>,
        },
        {
            value: 100,
            label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black" }}>2022</Typography>,
        },
    ];

    function onValueChange(event)
    {
        console.log(event.target.value);
        storeMap.mixingValueChange(event.target.value);
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative', left:'5%', top:'-100px', width:'90%', height:'50px', zIndex: 701}}>
            <Box sx={{ width: 300 }}>
                <Slider
                    defaultValue={0}
                    marks={marks}
                    step={20}
                    onChange={onValueChange}
                />
            </Box>
        </div>
    )
}