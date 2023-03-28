import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import StoreContext from '../../common/Store';
import {Chip} from "@mui/material";

const defaultMixingValue = 50;

export default function MapBottomSlider()
{
    const { storeMap } = useContext(StoreContext);
    const [sliderValue, setSliderValue] = useState(defaultMixingValue);

    useEffect(() => {
        storeMap.mixingValueChange(defaultMixingValue)
    }, [])

    const marks = [
        {
            value: 0,
            // label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black", backgroundColor: "white"}}>{storeMap.getMapSubPlan()}</Typography>,
            label: <Chip label="2022" size="small" variant="outlined" />
        },
        {
            value: 100,
            label: <Typography style={{ fontSize: 14, fontWeight: 700, color:"black", backgroundColor: "white"}}>{storeMap.getMapPlan()}</Typography>,
        },
    ];

    function onValueChange(event, newValue)
    {
        setSliderValue(newValue);
        storeMap.mixingValueChange(newValue);
    }

    function onChipClick(chipType)
    {
        let value = (chipType === 1)? 0 : 100;
        setSliderValue(value);
        storeMap.mixingValueChange(value);
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative', left:'5%', top:'-100px', width:'90%', height:'50px', zIndex: 701}}>
            <Chip label={storeMap.getMapSubPlan()} size="small" color="primary" onClick={() => onChipClick(1)} sx={{marginRight: '10px'}}/>
            <Box sx={{ width: 300 }}>
                <Slider
                    track={false}
                    value = {sliderValue}
                    step={10}
                    onChange={onValueChange}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Chip label={storeMap.getMapPlan()} size="small" color="primary" onClick={() => onChipClick(2)} sx={{marginLeft: '10px'}}/>
        </div>
    )
}