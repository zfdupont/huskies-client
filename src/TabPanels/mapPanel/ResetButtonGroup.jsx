import { useContext } from "react";
import Button from "../../ui/Button";
import { StoreContext } from "../../common/Store";

export default function ResetButtonGroup() {
  const { mapStore } = useContext(StoreContext);

  return (
    <div className="flex flex-col items-start px-3 py-2">
      {!mapStore.isStateNone() && (
        <Button size="sm" onClick={() => mapStore.resetState()}>
          Reset State
        </Button>
      )}
      <Button size="sm" onClick={() => mapStore.resetPage()}>
        Reset Page
      </Button>
    </div>
  );
}
