import * as React from 'react';
import { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import StoreContext from '../../common/Store';

const defaultMixingValue = 50;

export default function MapBottomSlider()
{
    const { storeMap } = useContext(StoreContext);

    useEffect(() => {
        storeMap.mixingValueChange(defaultMixingValue)
    }, [])

    const marks = [
        {
            value: 0,
            label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black"}}>{storeMap.getMapSubPlan()}</Typography>,
        },
        {
            value: 100,
            label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black" }}>{storeMap.getMapPlan()}</Typography>,
        },
    ];

    function onValueChange(event)
    {
        storeMap.mixingValueChange(event.target.value);
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative', left:'5%', top:'-100px', width:'90%', height:'50px', zIndex: 701}}>
            <Box sx={{ width: 300 }}>
                <Slider
                    defaultValue={defaultMixingValue}
                    marks={marks}
                    step={10}
                    onChange={onValueChange}
                />
            </Box>
        </div>
    )
}