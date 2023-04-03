import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { pink } from '@mui/material/colors';

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
    let modelA = props.modelA;
    let modelB = props.modelB;

    let demVotesDiff = modelB.votes.democrats - modelA.votes.democrats;
    let repVotesDiff = modelB.votes.republicans - modelA.votes.republicans;
    let populationDiff = modelB.populations.total - modelA.populations.total;



    return (
        <div style={{display:'flex', flex: '0 0 30px', margin: '0px 5px 20px 5px'}}>
            <div style={{display:'flex', flexFlow: 'column', flex: 1}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', backgroundColor:'white'}}>
                    {numToPlace(modelA.id)}
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px', backgroundColor:'white'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'14px', fontWeight: 500}}>
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