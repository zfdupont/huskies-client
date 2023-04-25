import { useContext } from 'react';
import StoreContext from "../../common/Store";
import {colorDict, PartyType} from "../../common/GlobalVariables";
import '../../App.css';
import {convertNumToPlace} from "../../common/ConversionHelper";
import {Checkbox} from "@mui/material";


const partyColor = {
    [PartyType.DEMOCRATIC]: "#d63031",
    [PartyType.REPUBLICAN]: "#0984e3",
}

const partyInitial = {
    [PartyType.DEMOCRATIC]: "(D)",
    [PartyType.REPUBLICAN]: "(R)",
}
export default function DistrictSummaryItem(props) {
    const { mapStore } = useContext(StoreContext);

    let data = props.electionData;
    let winVotePercent = Math.ceil((data.winnerVotes  / (data.winnerVotes + data.loserVotes)) * 100 );
    let loseVotePercent = 100 - winVotePercent;
    let bgColor = (mapStore.getHighlightDistrictId() !== data.districtId)? colorDict.white: colorDict.highlight;

    function onItemClick() {
        mapStore.highlightDistrict(data.districtId);
    }


    return (
        <div value={data.districtId} className="map-side-item" style={{display:'flex', flex: '0 0 50px', margin: '0px 5px 5px 5px', backgroundColor: bgColor, padding:"5px", borderRadius: '10px'}} onClick={onItemClick}>
            <div style={{display:'flex', flexFlow: 'column', flex: 0.5}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900'}}>
                    {convertNumToPlace(data.districtId)}
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'10px'}}>
                <div style={{display: 'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1, fontWeight:'600', color:'white', backgroundColor: partyColor[data.winnerParty]}}>
                        {data.winnerCandidate} {partyInitial[data.winnerParty]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 40px'}}>
                        {(data.winnerCandidate === data.incumbent) &&<Checkbox defaultChecked color="default" size="small" sx={{position: 'relative', margin:'-10px'}}/>}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, color:'gray'}}>
                        {data.winnerVotes.toLocaleString()}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, fontWeight:'800', color:'black'}}>
                        {winVotePercent}%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                <div style={{display:'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1, fontWeight:'400', color:'black'}}>
                        {data.loserCandidate} {partyInitial[data.loserParty]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 40px'}}>
                        {(data.loserCandidate === data.incumbent) && <Checkbox defaultChecked color="default" size="small" sx={{margin:'-10px'}}/>}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, color:'gray'}}>
                        {data.loserVotes.toLocaleString()}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, fontWeight:'800', color:'black'}}>
                        {loseVotePercent}%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
            </div>
        </div>
    )
}