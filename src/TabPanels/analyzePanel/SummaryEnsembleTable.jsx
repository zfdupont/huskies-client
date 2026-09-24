import * as React from "react";
import { useContext } from "react";
import StoreContext from "../../common/Store";
import Panel from "../../ui/Panel";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../ui/Table";

export default function SummaryEnsembleTable() {
  const { dataStore } = useContext(StoreContext);
  if (!dataStore.isEnsemblejsonReady()) return null;

  const data = dataStore.getEnsembleData().summary;
  if (!data) return null;

  return (
    <Panel className="p-2">
      <Table>
        <Thead>
          <Tr>
            <Th>Plans</Th>
            <Th>Incumbents</Th>
            <Th>Predicted Winners</Th>
            <Th>Avg Geo Var</Th>
            <Th>Avg Pop Var</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{data.num_plans}</Td>
            <Td>{data.num_incumbents}</Td>
            <Td>{Math.round(data.avg_incumbent_winners)}</Td>
            <Td>{data.avg_geo_var.toLocaleString("en", { style: "percent" })}</Td>
            <Td>{data.avg_pop_var.toLocaleString("en", { style: "percent" })}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Panel>
  );
}
