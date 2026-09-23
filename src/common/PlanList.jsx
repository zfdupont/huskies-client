import * as React from "react";
import { useContext, useEffect } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { PlanTitleType, PlanType } from "./GlobalVariables";

export default function PlanList() {
  const { mapStore } = useContext(StoreContext);
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    mapStore.selectPlan(PlanType.Y2022);
  }, []);

  const title = open ? "Plan" : mapStore.getMapPlan();

  return (
    <NavSection title={title} open={open} onToggle={() => setOpen(!open)}>
      {Object.keys(PlanType).map((key) => {
        const planType = PlanType[key];
        return (
          <NavItem
            key={planType}
            selected={mapStore.getMapPlan() === planType}
            onClick={() => mapStore.selectPlan(planType)}
          >
            {PlanTitleType[planType]}
          </NavItem>
        );
      })}
    </NavSection>
  );
}
