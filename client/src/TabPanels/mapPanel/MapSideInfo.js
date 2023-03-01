import * as React from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine
  } from "recharts";
import StoreContext from "../../common/Store";
export default function MapSideinfo(props)
{
    const { store } = React.useContext(StoreContext);
    return (
        <div style={{flex:1, backgroundColor:'white'}}>
            <span>
                {store.map.state !== 'none' ? `${store.map.state} District #${store.map.district}` : ""}
            </span>
        </div>
    )
}