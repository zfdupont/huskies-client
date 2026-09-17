import MapPanel from "../TabPanels/mapPanel/MapPanel";

export default function BasicPanel() {
    return (
        <div style={{backgroundColor:'#7f987d'}}>
            <div style={{position: 'fixed', width: '100%', height: '100%', overflow: 'hidden'}}>
                <MapPanel/>
            </div>
        </div>
    );
}
