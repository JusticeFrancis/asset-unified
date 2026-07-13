"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialPageSize?: number;
  emptyMessage?: string;
  className?: string;
};

function buildPageItems(pageIndex: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  if (pageIndex <= 2) {
    return [0, 1, 2, 3, "ellipsis-left", pageCount - 2, pageCount - 1] as const;
  }

  if (pageIndex >= pageCount - 3) {
    return [0, 1, "ellipsis-right", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1] as const;
  }

  return [0, "ellipsis-right", pageIndex - 1, pageIndex, pageIndex + 1, "ellipsis-left", pageCount - 1] as const;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialPageSize = 7,
  emptyMessage = "No data available.",
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageItems = buildPageItems(pageIndex, pageCount);

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="pb-3 text-left text-[12px] font-medium uppercase text-[#919191]"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="border-t border-[#dff0f8]"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="h-12 py-[6px]" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="h-20 border-t border-[#dff0f8] text-center text-sm text-[#919191]"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#dff0f8] pt-4">
        <p className="text-[12px] font-medium text-[#919191]">
          Page {pageIndex + 1} of {pageCount}
        </p>
        <div className="flex items-center gap-0.5 text-[#919191]">
          <button
            className="flex size-6 items-center justify-center disabled:opacity-40"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            type="button"
          >
            <ChevronLeft className="size-4" strokeWidth={1.8} />
          </button>
          {pageItems.map((item, index) =>
            typeof item === "number" ? (
              <button
                className={cn(
                  "rounded px-2 py-[2px] text-[12px]",
                  pageIndex === item
                    ? "bg-[#5c60cc] text-white"
                    : "text-[#919191]",
                )}
                key={`${item}-${index}`}
                onClick={() => table.setPageIndex(item)}
                type="button"
              >
                {item + 1}
              </button>
            ) : (
              <span className="px-2 text-[12px]" key={`${item}-${index}`}>
                ...
              </span>
            ),
          )}
          <button
            className="flex size-6 items-center justify-center disabled:opacity-40"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            type="button"
          >
            <ChevronRight className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
