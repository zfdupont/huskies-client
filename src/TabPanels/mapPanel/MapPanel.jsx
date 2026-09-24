import { useContext, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Panel from "../../ui/Panel";
import IconButton from "../../ui/IconButton";
import BottomSheet from "../../ui/BottomSheet";
import { BarChart } from "../../ui/icons";
import MainMap from "./MainMap";
import DistrictSummaryTable from "./DistrictSummaryTable";
import StateInfoTable from "./StateInfoTable";
import StoreReducer from "../../common/Store";
import HeatMap from "./HeatMap";
import SummaryEnsembleTable from "../analyzePanel/SummaryEnsembleTable";
import useIsMobile from "../../hooks/use-is-mobile.hook";

function DataTables({ mapStore }) {
  return (
    <>
      <div className="mb-2.5 w-full flex-none">
        {!mapStore.isStateNone() && <StateInfoTable />}
      </div>
      <div className="mb-2.5 w-full flex-none">
        {!mapStore.isStateNone() && mapStore.getMapPlan() === "enacted" && <SummaryEnsembleTable />}
      </div>
      <Panel className="flex w-full flex-1" style={{ minHeight: 240 }}>
        {!mapStore.isStateNone() && <DistrictSummaryTable />}
      </Panel>
    </>
  );
}

export default function MapPanel() {
  const { mapStore } = useContext(StoreReducer);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  // On mobile the district detail lives in a bottom sheet (opened by the FAB).
  // Tapping a district on the map should also pop the sheet open so its detail is
  // visible without hunting for the FAB. The sheet auto-scrolls to the highlighted
  // district. Closing the sheet won't re-open until a different district is tapped.
  const highlightDistrictId = mapStore.getHighlightDistrictId();
  useEffect(() => {
    if (isMobile && highlightDistrictId != null) setSheetOpen(true);
  }, [isMobile, highlightDistrictId]);

  if (isMobile) {
    return (
      <div className="absolute h-full w-full">
        <Panel className="map absolute inset-0">
          <MainMap />
          <HeatMap />
        </Panel>
        {!mapStore.isStateNone() && (
          <IconButton
            variant="elevated"
            aria-label="Show district data"
            onClick={() => setSheetOpen(true)}
            className="absolute bottom-4 right-4 z-[1100]"
          >
            <BarChart />
          </IconButton>
        )}
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <DataTables mapStore={mapStore} />
        </BottomSheet>
      </div>
    );
  }

  return (
    <div className="absolute flex h-full p-2.5" style={{ width: "calc(100% - 20px)" }}>
      <div className="mr-2.5 flex flex-[3.5] flex-col justify-center">
        <Panel className="map mb-2.5 flex-1">
          <MainMap />
          <HeatMap />
        </Panel>
      </div>
      <div className="flex flex-[2.5] flex-col">
        <div className="mb-2.5 flex-none">
          {!mapStore.isStateNone() && <StateInfoTable />}
        </div>
        <div className="mb-2.5 flex-none">
          {!mapStore.isStateNone() && mapStore.getMapPlan() === "enacted" && <SummaryEnsembleTable />}
        </div>
        <Panel className="flex flex-1" style={{ height: "70%" }}>
          {!mapStore.isStateNone() && <DistrictSummaryTable />}
        </Panel>
      </div>
    </div>
  );
}
