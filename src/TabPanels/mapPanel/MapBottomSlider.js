// import * as React from 'react';
// import {useContext, useEffect, useState} from 'react';
// import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';
// import StoreContext from '../../common/Store';
// import {Chip, Menu, MenuItem} from "@mui/material";
//
// const defaultMixingValue = 0;
//
// export default function MapBottomSlider()
// {
//     const { mapStore, dataStore } = useContext(StoreContext);
//     const [sliderValue, setSliderValue] = useState(defaultMixingValue);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);
//
//     useEffect(() => {
//         mapStore.mixingValueChange(defaultMixingValue);
//         setDefaultSubPlan();
//     }, [])
//
//     useEffect(() => {
//         setDefaultSubPlan();
//     }, [mapStore.subPlan])
//
//     let subPlanText = (mapStore.getSubPlan())? mapStore.getSubPlan() : "0000";
//     let subPlanListComponent = getSubPlanListComponent();
//
//     function setDefaultSubPlan()
//     {
//         if (mapStore.subPlan) return;
//
//         let PlanType = dataStore.getPlanType();
//         if (mapStore.getMapPlan() === PlanType.Y2020) {
//             mapStore.selectSubPlan(dataStore.getPlanType().Y2022);
//         }
//         if (mapStore.getMapPlan() === PlanType.Y2022) {
//             mapStore.selectSubPlan(dataStore.getPlanType().Y2020);
//         }
//     }
//     function getSubPlanListComponent()
//     {
//         let PlanType = dataStore.getPlanType();
//         let subPlanKeys = Object.keys(PlanType).filter((key) => PlanType[key] !== mapStore.getMapPlan());
//
//         return subPlanKeys.map((key) =>
//             <MenuItem key={key} onClick={() => onSubPlanSelect(PlanType[key])}>{PlanType[key]}</MenuItem>
//         );
//     }
//
//     function onValueChange(event, newValue)
//     {
//         setSliderValue(() => (newValue));
//         mapStore.mixingValueChange(newValue);
//     }
//
//     function onChipClick(chipType)
//     {
//         let value = (chipType === 1)? 0 : 100;
//         // setSliderValue(value);
//         mapStore.mixingValueChange(value);
//     }
//
//     function onSubPlanSelectClick(event)
//     {
//         setAnchorEl(event.currentTarget);
//     }
//     function onSubPlanSelectClose()
//     {
//         setAnchorEl(null);
//     }
//
//     function onSubPlanSelect(planType)
//     {
//         mapStore.selectSubPlan(planType);
//         onSubPlanSelectClose();
//     }
//
//     return(
//         <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative', left:'5%', top:'-100px', width:'90%', height:'50px', zIndex: 701}}>
//             <Chip label={mapStore.getMapPlan()} size="small" color="primary" onClick={() => onChipClick(1)} sx={{marginRight: '10px'}}/>
//             <Box sx={{ width: 300 }}>
//                 <Slider
//                     track={false}
//                     value = {sliderValue}
//                     step={10}
//                     onChange={onValueChange}
//                     valueLabelDisplay="auto"
//                 />
//             </Box>
//             <Chip label={subPlanText} size="small" color="primary" onClick={onSubPlanSelectClick} sx={{marginLeft: '10px'}}/>
//             <Menu
//                 id="basic-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={onSubPlanSelectClose}
//                 MenuListProps={{
//                     'aria-labelledby': 'basic-button',
//                 }}
//             >
//                 {subPlanListComponent}
//             </Menu>
//         </div>
//     )
// }