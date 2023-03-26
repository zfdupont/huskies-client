import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet";
import * as React from "react";
import {useContext} from "react";
import StoreContext from "../../common/Store";
import MapController from "./MapController";

export default function MainMap()
{
    const { store } = useContext(StoreContext);
    return (
        <MapContainer id='map-container' center={[40.35, -97.5]} zoom={4.3} scrollWheelZoom={true}>
            {store.isPlanSelected() && <MapController/>}
            {!store.isPlanSelected() && <div style={{display:"flex", justifyContent: 'center'}}>The Plan is not selected</div>}
        </MapContainer>
    )
}