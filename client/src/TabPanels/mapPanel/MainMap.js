import {MapContainer, TileLayer} from "react-leaflet";
import * as React from "react";

export default function MainMap()
{
    return (
        <div className="map" style={{flex:3.5, marginRight: '10px'}}>
            <MapContainer center={[52.51, 13.38]} zoom={6} scrollWheelZoom={true}>
                {/*<TileLayer*/}
                {/*    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'*/}
                {/*    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/}
                {/*/>*/}
                <TileLayer
                    url="https://api.mapbox.com/styles/v1/yongshn220/clejftlgu000201nls5ye4hwe/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9uZ3NobjIyMCIsImEiOiJjbGVqZnp1Z2kwMTRvNDFycmg1Z2RveGdtIn0.QUuLGb1Uu6Pl6OF0YJO--A"
                    attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                />
            </MapContainer>
        </div>
    )
}

// mapbox://styles/yongshn220/clejftlgu000201nls5ye4hwe