"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type CellContext,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import data from "~/public/data.json";
import { type LibraryType } from "~/types/data-types";

const columnHelper = createColumnHelper<LibraryType>();

const columns = [
  columnHelper.group({
    header: "Library",
    columns: [
      columnHelper.accessor(`library`, {
        cell: (info) => {
          const entry = info.getValue();
          if (!entry.includes(" ")) {
            return entry;
          }
          return (
            <div className="flex flex-col">
              {entry.split(" ").map((lib: string) => (
                <span key={lib}>{lib}</span>
              ))}
            </div>
          );
        },
      }),
    ],
  }),
  ...Object.keys(data[0].results)
    .reverse()
    .slice(0, 7)
    .map((date) =>
      columnHelper.group({
        header: date,
        columns: [
          columnHelper.accessor(`results.${date}.android`, {
            header: () => <span className="block text-xs">Android</span>,
            cell: formatStatus,
          }),
          columnHelper.accessor(`results.${date}.ios`, {
            header: () => <span className="block text-xs">iOS</span>,
            cell: formatStatus,
          }),
        ],
      }),
    ),
];

function formatStatus(info: CellContext<LibraryType, any>) {
  switch (info.getValue()) {
    case "success":
      return "🟢";
    case "failure":
      return "🔴";
    default:
      return <span className="text-gray-400">-</span>;
  }
}

export default function Table() {
  const table = useReactTable({
    data: data as LibraryType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowsCount = table.getRowModel().rows.length;

  return (
    <div className="border border-border rounded-lg shadow-xs overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead className="bg-subtle">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => {
                if (headerGroup.depth === 1 && header.id === "library") {
                  return null;
                }
                return (
                  <th
                    className={twMerge(
                      "text-sm px-2 py-1 whitespace-nowrap",
                      headerGroup.depth === 0
                        ? "border-r border-border"
                        : "even:border-r even:border-border",
                      "last:!border-r-0",
                      header.index === 0 ? "text-left pl-3" : "text-center",
                    )}
                    colSpan={header.colSpan}
                    rowSpan={header.index === 0 ? 2 : 1}
                    key={header.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-subtle hover:bg-hover">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={twMerge(
                    "text-sm px-2 py-0.5",
                    "odd:border-r odd:border-border",
                    "last:!border-r-0",
                    row.index === 0 && "pt-1",
                    row.index === rowsCount - 1 && "pb-1",
                    cell.column.getIsFirstColumn()
                      ? "text-left whitespace-nowrap pl-3"
                      : "text-center",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
