import * as React from "react";
import { useContext } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { StateType } from "./GlobalVariables";

export default function StateList() {
  const { mapStore } = useContext(StoreContext);
  const [open, setOpen] = React.useState(true);

  function onStateClick(stateType) {
    mapStore.isStateMatch(stateType) ? mapStore.unselectState() : mapStore.selectState(stateType);
  }

  const states = [
    [StateType.NEWYORK, "New York"],
    [StateType.GEORGIA, "Georgia"],
    [StateType.ILLINOIS, "Illinois"],
  ];

  return (
    <NavSection title="States" open={open} onToggle={() => setOpen(!open)}>
      {states.map(([type, label]) => (
        <NavItem key={type} selected={mapStore.isStateMatch(type)} onClick={() => onStateClick(type)}>
          {label}
        </NavItem>
      ))}
    </NavSection>
  );
}
