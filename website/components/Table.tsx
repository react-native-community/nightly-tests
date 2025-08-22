"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type CellContext,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import data from "~/public/data.json";
import { type LibraryType } from "~/types/data-types";
import { useSearch } from "~/context/SearchContext";

const columnHelper = createColumnHelper<LibraryType>();

function formatStatus(info: CellContext<LibraryType, any>) {
  switch (info.getValue()) {
    case "success":
      return "🟢";
    case "failure":
      return "🔴";
    default:
      return <span className="text-secondary">-</span>;
  }
}

type Props = {
  platform: "android" | "ios";
};

export default function Table({ platform }: Props) {
  const { query } = useSearch();

  const columns = [
    columnHelper.accessor(`library`, {
      header: () => <span className="block">Library</span>,
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
      filterFn: "includesString",
    }),
    ...Object.keys(data[0].results)
      .reverse()
      .slice(0, 7)
      .map((date) =>
        columnHelper.accessor((row) => row.results?.[date]?.[platform], {
          id: `results.${date}.${platform}`,
          header: () => <span className="block text-xs">{date}</span>,
          cell: formatStatus,
        }),
      ),
  ];

  const table = useReactTable({
    data: data as LibraryType[],
    columns,
    state: {
      globalFilter: query,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  const rowsCount = table.getRowModel().rows.length;

  return (
    <div className="border border-border rounded-lg shadow-xs overflow-hidden overflow-x-auto mb-4">
      <table className="w-full">
        <thead className="bg-subtle">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  className={twMerge(
                    "text-sm px-2 py-2 whitespace-nowrap border-r border-border",
                    "last:!border-r-0",
                    header.index === 0
                      ? "text-left pl-3 min-w-[300px]"
                      : "text-center",
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rowsCount > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-subtle hover:bg-hover">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={twMerge(
                      "text-sm px-2 py-0.5 border-r border-border",
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
            ))
          ) : (
            <tr>
              <td className="text-center text-secondary/50 py-6" colSpan={8}>
                No libraries matching "{query}" query.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
