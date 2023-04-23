import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default function StateInfoTable() {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight:'500', fontSize:'12px', color:'white'}}>
            <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 200}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: 12 }} align="center">Total Districts</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">Dem</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">Rep</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">Incumbents</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            key={'summary'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{ fontSize: 12 }} align="center">10</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">10</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">10</TableCell>
                            <TableCell sx={{ fontSize: 12 }} align="center">10</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}