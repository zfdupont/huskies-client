import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { pink } from '@mui/material/colors';
import {useContext} from "react";
import StoreContext from "../../common/Store";

const numToPlace = (n) => {
    const last = n % 10;
    switch (last){
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
    }
}

function applyColor(num)
{
    if (num < 0)
        return <div> <ArrowDropDownIcon  color="primary" /> {Math.abs(num).toLocaleString()} </div>
    else
        return <div> <ArrowDropUpIcon  sx={{ color: pink[500] }}/> {Math.abs(num).toLocaleString()}</div>
}
export default function MapSideCompareItem(props)
{
    const { storeMap } = useContext(StoreContext)

    let model = props.model;
    let model2020 = props.model2020;

    let demVotesDiff = model.votes.democrats - model2020.votes.democrats;
    let repVotesDiff = model.votes.republicans - model2020.votes.republicans;
    let populationDiff = model.populations.total - model2020.populations.total;

    let bgColor = (storeMap.getHighlightDistrictId() !== model.id)? 'white' : "#ffe8a4";

    function onItemClick()
    {
        storeMap.highlightDistrict(model.id);
    }

    return (
        <div className="map-side-item" style={{display:'flex', flex: '0 0 30px', margin: '0px 5px 5px 5px', backgroundColor: bgColor, padding:"5px", borderRadius: '10px'}} onClick={onItemClick} >
            <div style={{display:'flex', flexFlow: 'column', flex: 1}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900'}}>
                    {numToPlace(model.id)}
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'12px', fontWeight: 500}}>
                <div style={{display:'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'left', marginLeft:'0', flex: 1}}>
                        {applyColor(demVotesDiff)}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'left', marginLeft:'0', flex: 1}}>
                        {applyColor(repVotesDiff)}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'left', marginLeft:'0', flex: 1}}>
                        {applyColor(populationDiff)}
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
            </div>
        </div>
    )
}