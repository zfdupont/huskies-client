import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useContext } from 'react';
import { StoreContext } from '../../common/Store';
export default function ResetButtonGroup() {
    const { mapStore } = useContext(StoreContext);

    function onResetPageClick() {
        mapStore.resetPage();
    }

    function onResetStateClick() {
        mapStore.resetState();
    }

    return (
        <div>
            <Stack direction="column">
                {!mapStore.isStateNone() && <Button onClick={onResetStateClick} size="small">Reset State</Button>}
                <Button onClick={onResetPageClick} size="small" >Reset Page</Button>
            </Stack>
        </div>
    )
}