import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import { useContext } from 'react';
import { StoreContext } from '../../common/Store';
export default function Reset()
{
  const { storeMap } = useContext(StoreContext);

  function onResetPageClick()
  {
    storeMap.resetPage();
  }

  function onResetStateClick()
  {
    storeMap.resetState();
  }
  return (
    <div>
      <Stack direction="column">
        {!storeMap.isStateNone() && <Button onClick={onResetStateClick} size="small">Reset State</Button>}
        <Button onClick={onResetPageClick} size="small" >Reset Page</Button>
      </Stack>
    </div>
  )
}