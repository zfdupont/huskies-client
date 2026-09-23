import * as React from "react";
import { useContext } from "react";
import StoreContext from "../../common/Store";
import Panel from "../../ui/Panel";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../ui/Table";

export default function StateInfoTable() {
  const { mapStore, dataStore } = useContext(StoreContext);
  if (!dataStore.isReadyToDisplayCurrentMap()) return null;
  const modelData = dataStore.getStateModelData(mapStore.plan, mapStore.state);
  const summaryData = modelData.summaryData;

  return (
    <Panel className="p-2">
      <Table>
        <Thead>
          <Tr>
            <Th>Total Districts</Th>
            <Th>Incumbents</Th>
            <Th>Dem winners</Th>
            <Th>Rep winners</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{summaryData.numOfDistrics}</Td>
            <Td>{summaryData.numOfIncumbents}</Td>
            <Td>{summaryData.numOfDemocratWinners}</Td>
            <Td>{summaryData.numOfRepublicanWinners}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Panel>
  );
}
