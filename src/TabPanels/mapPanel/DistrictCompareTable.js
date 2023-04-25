import {useContext, useEffect, useRef, useState} from 'react';
import StoreContext from '../../common/Store';
import {
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Tooltip from '@mui/material/Tooltip';
import Toolbar from "@mui/material/Toolbar";
import HelpIcon from '@mui/icons-material/Help';
import {colorDict} from "../../common/GlobalVariables";

const columns = [
    { id: 'district', maxWidth: '30px', label: 'District', align:'center'},
    { id: 'area', label: 'Area', align: 'right'},
    { id: 'population', label: 'Population', align: 'right', format: (value) => value.toLocaleString('en-US') },
    { id: 'democrats', label: 'Democrats', align: 'right', format: (value) => value.toLocaleString('en-US') },
    { id: 'republicans', label: 'Republicans', align: 'right', format: (value) => value.toFixed(2) },
    { id: 'white', label: 'White', align: 'right', format: (value) => value.toFixed(2) },
    { id: 'black', label: 'Black', align: 'right', format: (value) => value.toFixed(2) },
    { id: 'asian', label: 'Asian', align: 'right', format: (value) => value.toFixed(2) },
];

function createData(district, area, population, democrats, republicans, white, black, asian) {
    return { district, area, population, democrats, republicans, white, black, asian };
}


const CustomTooltip = () => {
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', width:'300px', height:'300px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1}}>
                <img src={process.env.PUBLIC_URL + "/DistrictCompareGuide.png"} alt="Guide" style={{width:'270px', height:'270px'}}/>
            </div>
            <div style={{flex: "0 0 16px", fontSize:'12px'}}>
                ex) Area difference = G / (GB + B)
            </div>
        </div>
    );
};



export default function DistrictCompareTable() {
    const infoTableRef = useRef();
    const { mapStore, dataStore } = useContext(StoreContext);
    const [incumbentFilter, setIncumbentFilter] = useState(true);

    let dataList = createElectionDataList();

    useEffect(() => {
        scrollToItem();
    });

    function onIncumbentFilterClick(event) {
        setIncumbentFilter(() => (event.target.checked));
    }

    function EnhancedTableToolbar() {
        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                }}
            >
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Compare to 2020 district plan
                </Typography>
                <div style={{display:'flex', alignItems:'center', justifyContent: 'right', flex:'1', fontSize:'12px', marginRight:'50px'}}>
                    Only Incumbents
                    <Switch aria-label='Switch demo' size="small" sx={{margin: 1}} checked={incumbentFilter} onClick={onIncumbentFilterClick} />
                </div>
                <Tooltip title={<CustomTooltip/>}>
                    <IconButton sx={{fontSize: "12px"}}>
                        How to Calculate<HelpIcon color="primary" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        );
    }

    function createElectionDataList() {
        let result = [];
        if (!dataStore.isReadyToDisplayCurrentMap()) return result;

        let stateData = dataStore.getStateModelData(mapStore.getMapPlan(), mapStore.getState());
        for (let key in stateData.compareDataDict)
        {
            if (incumbentFilter && !stateData.electionDataDict[key].hasIncumbent) continue;

            let data = stateData.compareDataDict[key];
            result.push( createData(data.districtId, data.area, data.population, data.democrats, data.republicans, data.white, data.black, data.asian));
        }
        return result;
    }

    function onItemClick(districtId) {
        mapStore.highlightDistrict(districtId);
    }

    function scrollToItem() {
        if (mapStore.getHighlightDistrictId() === null) return;
        const infoItem = Array.from(infoTableRef?.current?.children).find((item) => {
            return item.getAttribute('value') === mapStore.getHighlightDistrictId();
        });
        if (infoItem) {
            console.log(infoItem);
            infoItem.scrollIntoView({block: "center"});
        }
    }

    return (
        <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{ maxHeight: "300px" }}>
                <EnhancedTableToolbar/>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ maxWidth: column.maxWidth }}
                                    >
                                      {column.label}
                                    </TableCell>
                                ))}
                    </TableRow>
                </TableHead>
                <TableBody ref={infoTableRef}>
                    {dataList.map((row) => {
                        let bgColor = (mapStore.districtId === row.district)? colorDict.highlight : colorDict.white;
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.district} value={row.district} onClick={() => onItemClick(row.district)} sx={{backgroundColor:bgColor}}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    );
}