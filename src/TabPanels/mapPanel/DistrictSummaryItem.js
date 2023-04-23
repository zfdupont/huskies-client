import { useContext } from 'react';
import StoreContext from "../../common/Store";
import {colorDict, PartyType} from "../../common/GlobalVariables";
import '../../App.css';
import {convertNumToPlace} from "../../common/ConversionHelper";


const partyColor = {
    [PartyType.DEMOCRATIC]: "#d63031",
    [PartyType.REPUBLICAN]: "#0984e3",
}

const partyInitial = {
    [PartyType.DEMOCRATIC]: "(D)",
    [PartyType.REPUBLICAN]: "(R)",
}
export default function DistrictSummaryItem(props) {
    const { storeMap } = useContext(StoreContext);

    let data = props.electionData;
    let winVotePercent = Math.ceil((data.winnerVotes  / (data.winnerVotes + data.loserVotes)) * 100 );
    let loseVotePercent = 100 - winVotePercent;
    let bgColor = (storeMap.getHighlightDistrictId() !== data.districtId)? colorDict.white: colorDict.highlight;

    function onItemClick() {
        storeMap.highlightDistrict(data.districtId);
    }

    function getLastName(name) {
        return name.split(' ')[1]
    }

    return (
        <div value={data.districtId} className="map-side-item" style={{display:'flex', flex: '0 0 50px', margin: '0px 5px 5px 5px', backgroundColor: bgColor, padding:"5px", borderRadius: '10px'}} onClick={onItemClick}>
            <div style={{display:'flex', flexFlow: 'column', flex: 1}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900'}}>
                    {convertNumToPlace(data.districtId)}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5}}>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'15px', height:'15px', marginRight: 5, color: 'black', fontSize:'10px', borderRadius: '5px', border: 'solid 1px black'}}>
                        +2
                    </div>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'15px', height:'15px', marginLeft: 5, color: 'black', fontSize:'10px', borderRadius: '5px', border: 'solid 1px black'}}>
                        -3
                    </div>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5, fontSize: '10px'}}>
                    Precinct
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'10px'}}>
                <div style={{display: 'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'600', color:'white', backgroundColor: partyColor[data.winnerParty]}}>
                        {getLastName(data.winnerCandidate)} {partyInitial[data.winnerParty]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 10px'}}>
                        {(data.winnerCandidate === data.incumbent) && "v"}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        {data.winnerVotes.toLocaleString()}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, fontWeight:'800', color:'black'}}>
                        {winVotePercent}%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                <div style={{display:'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'400', color:'black'}}>
                        {getLastName(data.loserCandidate)} {partyInitial[data.loserParty]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 10px'}}>
                        {(data.loserCandidate === data.incumbent) && "v"}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        {data.loserVotes.toLocaleString()}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, fontWeight:'800', color:'black'}}>
                        {loseVotePercent}%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
            </div>
        </div>
    )
}