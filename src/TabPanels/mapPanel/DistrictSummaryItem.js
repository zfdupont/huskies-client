import { useContext } from 'react';
import StoreContext from "../../common/Store";
import {colorDict, PartyType, PlanType} from "../../common/GlobalVariables";
import '../../App.css';
import {convertNumToPlace} from "../../common/ConversionHelper";
import {Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import IncumbentVariation from '../analyzePanel/IncumbentVariation';

const partyColor = {
    [PartyType.DEMOCRATIC]: colorDict.democraticDefault,
    [PartyType.REPUBLICAN]: colorDict.republicanDefault,
}

export default function DistrictSummaryItem(props) {
    const { mapStore, dataStore } = useContext(StoreContext);

    let data = props.electionData;
    let enactedData = props.enactedData;
    let incumbentData = props.incumbentData;
    let winVotePercent = Math.ceil((data.winnerVotes  / (data.winnerVotes + data.loserVotes)) * 100 );
    let loseVotePercent = 100 - winVotePercent;
    const isHighlighted = mapStore.getHighlightDistrictId() === data.districtId;
    let bgColor = (isHighlighted)? colorDict.highlight : colorDict.white;

    function onItemClick() {
        mapStore.highlightDistrict(data.districtId);
    }

    function createData(name, percentage) {
        return {name, percentage};
    }

    const stateData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
    const compareData = stateData.compareDataDict[data.districtId];
    let geoVar = data.hasIncumbent? ((compareData.area * 100).toFixed(1).toString() + "%") : "-";
    let popVar = data.hasIncumbent? ((compareData.population * 100).toFixed(1).toString() + "%") : "-";
    const rows = [
        createData('Geographic difference', (compareData.area * 100).toFixed(1)),
        createData('Democrat difference', (compareData.democrats  * 100).toFixed(1)),
        createData('Republican difference', (compareData.republicans  * 100).toFixed(1)),
        createData('Total Population difference', (compareData.population  * 100).toFixed(1)),
        createData('White population difference', (compareData.white  * 100).toFixed(1)),
        createData('Black population difference', (compareData.black  * 100).toFixed(1)),
        createData('Hispanic population difference', (compareData.hispanic  * 100).toFixed(1)),
    ];

    return (
        <div value={data.districtId}  style={{display:'flex', flexDirection:'column'}}>
            <div className="map-side-item" style={{display:'flex', flex: '0 0 50px', margin: '0px 5px 5px 5px', backgroundColor: bgColor, padding:"5px", borderRadius: '10px'}} onClick={onItemClick}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexFlow: 'column', flex: 0.3}}>
                    <div style={{display:'flex', flex: '1', alignItems:'center', justifyContent: 'center', fontSize: '12px', fontWeight: '400'}}>
                        {data.districtId}
                    </div>
                </div>
                <div style={{flex: '0 0 10px'}}/>
                <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'14px'}}>
                    <div style={{display: 'flex', flex:1}}>
                        <div style={{flex:'0 0 5px', backgroundColor: partyColor[data.winnerParty]}}/>
                        <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'800', color:'black'}}>
                            {data.winnerCandidate}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 40px'}}>
                            {(data.winnerCandidate === data.incumbent) &&<Checkbox defaultChecked disabled={true} color="default" size="small" sx={{position: 'relative', margin:'-10px'}}/>}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, color:'black'}}>
                            {data.winnerVotes?.toLocaleString()}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, fontWeight:'400', color:'black'}}>
                            {winVotePercent}%
                        </div>
                        <div style={{flex:'0.1'}}/>
                    </div>
                    <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                    <div style={{display:'flex', flex:1}}>
                        <div style={{flex:'0 0 5px', backgroundColor: partyColor[data.loserParty]}}/>
                        <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'400', color:'black'}}>
                            {data.loserCandidate}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: '0 0 40px'}}>
                            {(data.loserCandidate === data.incumbent) && <Checkbox defaultChecked color="default" size="small" sx={{margin:'-10px'}}/>}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, color:'black'}}>
                            {data.loserVotes?.toLocaleString()}
                        </div>
                        <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 0.7, fontWeight:'400', color:'black'}}>
                            {loseVotePercent}%
                        </div>
                        <div style={{flex:'0.1'}}/>
                    </div>
                    <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                </div>
                <div style={{display:'flex', flex:'1', flexDirection:'column', fontWeight:'800', fontSize:'14px'}}>
                    <div style={{display:'flex', flex:'1', alignItems: 'center', justifyContent:'center'}}>
                        {geoVar}
                    </div>
                    <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                </div>
                <div style={{display:'flex', flex:'1', flexDirection:'column', fontWeight:'800', fontSize:'14px'}}>
                    <div style={{display:'flex', flex:'1', alignItems: 'center', justifyContent:'center'}}>
                        {popVar}
                    </div>
                    <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                </div>
            </div>
            {isHighlighted &&
            <div style={{flex:'0 0 100px'}}>
                <TableContainer component={Paper} sx={{marginBottom:'10px'}}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:'800'}}>Compare to 2020 plan</TableCell>
                                <TableCell sx={{fontWeight:'800'}} align="right">Percentage&nbsp;(%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{fontSize:'14px'}}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right" sx={{fontWeight:'700', fontSize:'14px'}}>{row.percentage}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key={'chart'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
                                {(data.hasIncumbent && (mapStore.getMapPlan() === 'enacted')) && <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={'area_variations'}/> }
                                {(data.hasIncumbent && (mapStore.getMapPlan() === 'enacted')) && <IncumbentVariation incumbent={data.incumbent} enactedData={enactedData.incumbent_data} incumbentData={incumbentData} type={'vap_variations'}/> }
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            }
        </div>
    )
}