import { render, screen } from "@testing-library/react";
import StoreContext from "../../common/Store";
import SummaryEnsembleTable from "./SummaryEnsembleTable";

function renderWith(summary) {
  const dataStore = {
    isEnsemblejsonReady: () => true,
    getEnsembleData: () => ({ schema_version: "1.0", summary }),
  };
  return render(
    <StoreContext.Provider value={{ dataStore }}>
      <SummaryEnsembleTable />
    </StoreContext.Provider>
  );
}

test("renders the summary row from ensemble.summary", () => {
  renderWith({ num_plans: 4000, num_incumbents: 14, avg_incumbent_winners: 11.9,
               avg_geo_var: 0.11, avg_pop_var: 0.09 });
  expect(screen.getByText("4000")).toBeInTheDocument();
  expect(screen.getByText("14")).toBeInTheDocument();
  expect(screen.getByText("12")).toBeInTheDocument();       // Math.round(11.9)
  expect(screen.getByText("11%")).toBeInTheDocument();      // 0.11 as percent
  expect(screen.getByText("9%")).toBeInTheDocument();       // 0.09 as percent
});
