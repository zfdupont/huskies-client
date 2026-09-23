import { render, screen } from "@testing-library/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Table";

test("Table primitives compose a real table", () => {
  render(
    <Table>
      <Thead><Tr><Th>Districts</Th></Tr></Thead>
      <Tbody><Tr><Td>26</Td></Tr></Tbody>
    </Table>
  );
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByRole("columnheader", { name: "Districts" })).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "26" })).toBeInTheDocument();
});
