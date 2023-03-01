export default function MapSideItem(props)
{
    const numToPlace = (n) => {
        const last = n % 10;
        switch (last){
            case 1:
                return `${n}st`;
            case 2:
                return `${n}nd`;
            case 3:
                return `${n}rd`;
            default:
                return `${n}th`; 
        }
    }
    return (
        <div style={{display:'flex', flex: '0 0 70px', margin: '0px 5px 20px 5px'}}>
            <div style={{display:'flex', flexFlow: 'column', flex: 1}}>
                <div style={{display:'flex', flex: '3', alignItems:'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', backgroundColor:'white'}}>
                    {numToPlace(props.id)}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5}}>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'23px', height:'23px', marginRight: 5, color: 'black', fontSize:'14px', borderRadius: '5px', border: 'solid 1px black'}}>
                        +2
                    </div>
                    <div style={{position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'23px', height:'23px', marginLeft: 5, color: 'black', fontSize:'14px', borderRadius: '5px', border: 'solid 1px black'}}>
                        -3
                    </div>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1.5, fontSize: '12px'}}>
                    Precinct
                </div>
            </div>
            <div style={{flex: '0 0 1px', backgroundColor:'darkgray'}}/>
            <div style={{flex: '0 0 10px', backgroundColor:'white'}}/>
            <div style={{display:'flex', flexFlow:'column', flex: 4, fontSize:'14px'}}>
                <div style={{display: 'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'600', color:'white', backgroundColor:'#d63031'}}>
                        LaLota* (R)
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        173,275
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, fontWeight:'800', color:'black'}}>
                        55.9%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
                <div style={{display:'flex', flex:1}}>
                    <div style={{display:'flex', alignItems: 'center', paddingLeft:'10px', flex: 1.5, fontWeight:'400', color:'black'}}>
                        Fleming (D)
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, color:'gray'}}>
                        136.899
                    </div>
                    <div style={{display:'flex', alignItems: 'center', justifyContent:'right', flex: 1, fontWeight:'800', color:'black'}}>
                        44.1%
                    </div>
                    <div style={{flex:'0.1'}}/>
                </div>
                <div style={{flex:'0 0 1px', backgroundColor:'darkgray'}}></div>
            </div>
        </div>
    )
}