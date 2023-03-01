import MapSideItem from "./MapSideItem";
import {Paper} from "@mui/material";

export default function SideTest()
{
    return (
        <Paper style={{display: 'flex', flexFlow: "column", position:'relative', width:'100%', height:'100%'}}>
            <div style={{display:'flex', flex: "0 1 50px", marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Districts</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'left', flex: 1.8,  fontSize:'12px', color:'grey'}}>Candidates</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 1.2,  fontSize:'12px', color:'grey'}}>Votes</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.8,  fontSize:'12px', color:'grey'}}>Percent</div>
                <div style={{display:'flex', alignItems: 'end', justifyContent:'center', flex: 0.15,  fontSize:'12px', color:'grey'}}></div>
            </div>
            <div style={{position:'relative', display:'flex', flexFlow: 'column', flex: '1 1 auto', backgroundColor:'white', overflowY: 'scroll'}}>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
                <MapSideItem/>
            </div>
        </Paper>
    );
}