"use client";

import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import { EntryNotes } from "~/components/EntryNotes";
import { GitHubRepoLink } from "~/components/GitHubRepoLink";
import { useSearch } from "~/context/SearchContext";
import data from "~/public/data.json";
import { type LibraryType } from "~/types/data-types";
import getCleanPackageName from "~/utils/getCleanPackageName";

import Tooltip from "./Tooltip";

const columnHelper = createColumnHelper<LibraryType>();

function formatStatus(info: CellContext<LibraryType, any>) {
  switch (info.getValue()) {
    case "success":
      return <span className="select-none">🟢</span>;
    case "failure":
      const runUrl =
        info.row.original.results[info.cell.id.split(".")[1]]?.runUrl;
      if (runUrl) {
        return (
          <Tooltip content="See the GitHub action run">
            <a href={runUrl} target="_blank">
              <span className="select-none">🔴</span>
            </a>
          </Tooltip>
        );
      } else {
        return <span className="select-none">🔴</span>;
      }
    default:
      return <span className="text-secondary select-none">-</span>;
  }
}

type Props = {
  platform: "android" | "ios";
};

export default function Table({ platform }: Props) {
  const { query } = useSearch();

  const columns = [
    columnHelper.accessor(`installCommand`, {
      header: () => <span className="block">Library</span>,
      cell: (info) => {
        const entry = info.getValue();
        const notes = info.row.original.notes;

        if (!entry.includes(" ")) {
          const repositoryURL =
            info.row.original.repositoryURLs?.[getCleanPackageName(entry)];
          return (
            <div className="flex items-center gap-1.5">
              {entry}
              <div className="flex items-center gap-1.5 ml-auto">
                <EntryNotes notes={notes} />
                <GitHubRepoLink repositoryURL={repositoryURL} />
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col">
            {entry.split(" ").map((lib: string) => {
              const repositoryURL =
                info.row.original.repositoryURLs?.[getCleanPackageName(lib)];
              return (
                <div className="flex items-center gap-1.5" key={lib}>
                  {lib}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <EntryNotes notes={notes} />
                    <GitHubRepoLink repositoryURL={repositoryURL} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
      filterFn: "includesString",
    }),
    ...Object.keys(data[0].results)
      .reverse()
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
