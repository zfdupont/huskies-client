import {MapContainer} from "react-leaflet";
import {useContext} from "react";
import StoreContext from "../../common/Store";
import MapController from "./MapController";

export default function MainMap() {
    const { mapStore } = useContext(StoreContext);
    return (
        <MapContainer id='map-container' center={[40.35, -97.5]} zoom={4.3} scrollWheelZoom={true}>
            {mapStore.isPlanSelected() && <MapController/>}
            {!mapStore.isPlanSelected() && <div style={{display:"flex", justifyContent: 'center'}}>The Plan is not selected</div>}
        </MapContainer>
    )
}