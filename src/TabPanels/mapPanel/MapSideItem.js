import { useContext } from 'react';
import StoreContext from "../../common/Store";
import '../../App.css';
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

const partyColor = {
    democrats: "#d63031",
    republican: "#0984e3",
}

const partyId = {
    democrats: 0,
    republican: 1,
}
export default function MapSideItem(props)
{

    const { storeMap } = useContext(StoreContext);

    let model = props.districtModelData;

    let winId = (model.votes.democrats > model.votes.republicans)? partyId.democrats : partyId.republican;
    let loseId = (model.votes.democrats > model.votes.republicans)? partyId.republican : partyId.democrats;
    let candidates = [model.democratsCandidate, model.republicanCandidate];
    let voteResults = [model.votes.democrats, model.votes.republicans];
    let colors = [partyColor.democrats, partyColor.republican];
    let partyInitials = ["(D)", "(R)"];
    let winVotePercent = Math.ceil((voteResults[winId]  / model.votes.total) * 100 );
    let loseVotePercent = 100 - winVotePercent;
    let bgColor = (storeMap.getHighlightDistrictId() !== model.id)? 'white' : "#ffe8a4";
    function onItemClick()
    {
        storeMap.highlightDistrict(model.id);
    }

    return (
        <div id="map-side-item" style={{display:'flex', flex: '0 0 60px', margin: '0px 5px 5px 5px', backgroundColor: bgColor, padding:"5px", borderRadius: '10px'}} onClick={onItemClick}>
            <div style={{display:'flex', flexFlow: 'column', flex: 1}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900'}}>
                    {numToPlace(model.id)}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5}}>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'18px', height:'18px', marginRight: 5, color: 'black', fontSize:'12px', borderRadius: '5px', border: 'solid 1px black'}}>
                        +2
                    </div>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'18px', height:'18px', marginLeft: 5, color: 'black', fontSize:'12px', borderRadius: '5px', border: 'solid 1px black'}}>
                        -3
                    </div>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5, fontSize: '12px'}}>
                    Precinct
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'12px'}}>
                <div style={{display: 'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'600', color:'white', backgroundColor: colors[winId]}}>
                        {candidates[winId]} {partyInitials[winId]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 10px'}}>
                        {(candidates[winId] === model.incumbent) && "v"}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        {voteResults[winId].toLocaleString()}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, fontWeight:'800', color:'black'}}>
                        {winVotePercent}%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                <div style={{display:'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'400', color:'black'}}>
                        {candidates[loseId]} {partyInitials[loseId]}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 10px'}}>
                        {(candidates[loseId] === model.incumbent) && "v"}
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        {voteResults[loseId].toLocaleString()}
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