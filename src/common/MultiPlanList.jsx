import * as React from "react";
import { useState, useContext, useEffect, useCallback } from "react";
import NavSection, { NavItem } from "../ui/NavSection";
import StoreContext from "./Store";
import { PlanTitleType, PlanType } from "./GlobalVariables";

const emptyFilters = {
  [PlanType.S0001]: false,
  [PlanType.S0002]: false,
  [PlanType.S0003]: false,
  [PlanType.S0004]: false,
  [PlanType.S0005]: false,
};

export default function MultiPlanList() {
  const { mapStore, callbacks } = useContext(StoreContext);
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);

  const resetStateFilter = useCallback(() => setFilters(emptyFilters), []);

  useEffect(() => {
    callbacks.addOnResetState(resetStateFilter);
  }, []);

  function onPlanButtonClick(planType) {
    if (!filters[planType]) {
      mapStore.addPlanFilter(planType);
      setFilters((prev) => ({ ...prev, [planType]: true }));
    } else {
      mapStore.removePlanFilter(planType);
      setFilters((prev) => ({ ...prev, [planType]: false }));
    }
  }

  return (
    <NavSection title="Plan Filter" open={open} onToggle={() => setOpen(!open)}>
      {Object.keys(PlanType)
        .map((key) => PlanType[key])
        .filter((planType) => planType !== PlanType.Y2022)
        .map((planType) => (
          <NavItem key={planType} selected={filters[planType]} onClick={() => onPlanButtonClick(planType)}>
            {PlanTitleType[planType]}
          </NavItem>
        ))}
    </NavSection>
  );
}
