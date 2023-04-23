import { useContext, useState } from 'react';
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
    const { storeMap, storeData } = useContext(StoreContext);
    const [incumbentFilter, setIncumbentFilter] = useState(true);

    let dataList = createElectionDataList();

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
        if (!storeData.isReadyToDisplayCurrentMap()) return result;

        let modelData = storeData.getStateModelData(storeMap.getMapPlan(), storeMap.getState());
        for (let key in modelData.compareDataDict)
        {
            if (incumbentFilter && !modelData.electionDataDict[key].hasIncumbent) continue;

            let data = modelData.compareDataDict[key];
            result.push( createData(data.districtId, data.area, data.population, data.democrats, data.republicans, data.white, data.black, data.asian));
        }
        return result;
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
                <TableBody>
                    {dataList.map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.district}>
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