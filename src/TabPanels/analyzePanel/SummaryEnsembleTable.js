import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useContext, useState, useEffect} from "react";
import StoreContext from "../../common/Store";

export default function SummaryEnsembleTable() {

    const { dataStore } = useContext(StoreContext);


    let ensembleTable = getEnsembleSummaryData();
    //let table = getSummaryEnsembleTable();

    function getEnsembleSummaryData() {
        const ensembleTable = [];
        if (!dataStore.isEnsemblejsonReady()) return ensembleTable;

        let allGraphData = dataStore.getEnsembleData();
        let summary_data = allGraphData.ensemble_summary;
        if(summary_data) {
            console.log(summary_data);
            let table = getSummaryEnsembleTable(summary_data);
            ensembleTable.push(table);
        }
        //console.log(bw_data);
        // for (let id in stateModelData.electionDataDict) {
        //     if (state.incumbentFilter && !stateModelData.electionDataDict[id].hasIncumbent) continue;

        //     boxWhiskerChart.push(<TestChart data={bw_data}} />);
        //     boxWhiskerChart.push(<DistrictSummaryItem key={id} electionData={stateModelData.electionDataDict[id]}/>);
        // }
        return ensembleTable;
    }


    function getSummaryEnsembleTable(data) {
        return (
            <div key={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight:'500', fontSize:'12px', color:'white'}}>
                <TableContainer component={Paper}>
                    <Table size="small" sx={{ minWidth: 200}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: 12 }} align="center">Plans</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">Incumbents</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">Predicted Winners</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">Avg Geo Var</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">Avg Pop Var</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                key={'summary'}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ fontSize: 12 }} align="center">{data.num_plans}</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">{data.num_incumbents}</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">{data.avg_incumbent_winners}</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">{data.avg_geo_var.toLocaleString("en", {style: "percent"})}</TableCell>
                                <TableCell sx={{ fontSize: 12 }} align="center">{data.avg_pop_var.toLocaleString("en", {style: "percent"})}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }




    return (
        <div>
            {ensembleTable}
        </div>
    )
}