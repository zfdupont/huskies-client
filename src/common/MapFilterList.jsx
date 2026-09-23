import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import NavSection from "../ui/NavSection";
import Toggle from "../ui/Toggle";
import StoreContext from "./Store";
import { MapFilterType } from "./GlobalVariables";

const allOff = {
  [MapFilterType.INCUMBENT]: false,
  [MapFilterType.VICTORYMARGIN]: false,
  [MapFilterType.WHITE]: false,
  [MapFilterType.BLACK]: false,
  [MapFilterType.HISPANIC]: false,
};

export default function MapFilterList() {
  const { mapStore, callbacks } = useContext(StoreContext);
  const [open, setOpen] = useState(true);
  const [switches, setSwitches] = useState({ ...allOff, [MapFilterType.VICTORYMARGIN]: true });

  const resetStateFilter = useCallback(() => setSwitches({ ...allOff }), []);

  useEffect(() => {
    callbacks.addOnResetState(resetStateFilter);
  }, []);

  useEffect(() => {
    mapStore.setColorFilter(MapFilterType.VICTORYMARGIN);
  }, []);

  const onToggle = (e, filterType) => {
    let state;
    if (filterType === MapFilterType.INCUMBENT) {
      state = { ...switches, [MapFilterType.INCUMBENT]: e.target.checked };
      mapStore.setIncumbentFilter(e.target.checked);
    } else {
      const activeFilter = e.target.checked
        ? filterType
        : filterType === MapFilterType.VICTORYMARGIN
        ? MapFilterType.NONE
        : MapFilterType.VICTORYMARGIN;
      state = {
        [MapFilterType.INCUMBENT]: switches[MapFilterType.INCUMBENT],
        [MapFilterType.VICTORYMARGIN]: activeFilter === MapFilterType.VICTORYMARGIN,
        [MapFilterType.WHITE]: activeFilter === MapFilterType.WHITE,
        [MapFilterType.BLACK]: activeFilter === MapFilterType.BLACK,
        [MapFilterType.HISPANIC]: activeFilter === MapFilterType.HISPANIC,
      };
      mapStore.setColorFilter(activeFilter);
    }
    setSwitches(state);
  };

  const rows = [
    [MapFilterType.INCUMBENT, "Incumbent"],
    [MapFilterType.VICTORYMARGIN, "Victory Margin"],
    [MapFilterType.WHITE, "White Pop"],
    [MapFilterType.BLACK, "Black Pop"],
    [MapFilterType.HISPANIC, "Hispanic Pop"],
  ];

  return (
    <NavSection title="Map Filter" open={open} onToggle={() => setOpen(!open)}>
      {rows.map(([type, label]) => (
        <div key={type} className="flex items-center justify-between px-6 py-1.5 text-xs text-fg">
          <span>{label}</span>
          <Toggle
            size="sm"
            aria-label={label}
            checked={switches[type]}
            onChange={(e) => onToggle(e, type)}
          />
        </div>
      ))}
    </NavSection>
  );
}
