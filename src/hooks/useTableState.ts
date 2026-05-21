"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TableId } from "@/constants/tableIds";
import {
  DEFAULT_TABLE_STATE,
  hydrateTable,
  resetTableFilters,
  setTableActiveFilter,
  setTablePage,
  setTableRowsPerPage,
  setTableSearch,
  type TablePersistState,
} from "@/store/tableSlice";
import type { RootState } from "@/store/store";

export interface UseTableStateOptions {
  defaultActiveFilter?: string;
  defaultRowsPerPage?: number;
}

export function useTableState(tableId: TableId, options: UseTableStateOptions = {}) {
  const dispatch = useDispatch();
  const defaults: Partial<TablePersistState> = {
    activeFilter: options.defaultActiveFilter ?? DEFAULT_TABLE_STATE.activeFilter,
    rowsPerPage: options.defaultRowsPerPage ?? DEFAULT_TABLE_STATE.rowsPerPage,
  };

  const table = useSelector((state: RootState) => {
    const t = state.tables.tables[tableId];
    if (t) return t;
    return {
      ...DEFAULT_TABLE_STATE,
      activeFilter: defaults.activeFilter!,
      rowsPerPage: defaults.rowsPerPage!,
    };
  });

  const hydrated = useSelector(
    (state: RootState) => state.tables.hydrated[tableId] ?? false,
  );

  useEffect(() => {
    dispatch(hydrateTable({ tableId, defaults }));
  }, [dispatch, tableId]);

  return {
    /** True after sessionStorage values are loaded into Redux */
    hydrated,
    searchTerm: table.search,
    activeFilter: table.activeFilter,
    /** Alias for activeFilter (status tabs) */
    statusFilter: table.activeFilter,
    currentPage: table.currentPage,
    rowsPerPage: table.rowsPerPage,
    setSearchTerm: (value: string) =>
      dispatch(setTableSearch({ tableId, value })),
    setActiveFilter: (value: string) =>
      dispatch(setTableActiveFilter({ tableId, value })),
    setStatusFilter: (value: string) =>
      dispatch(setTableActiveFilter({ tableId, value })),
    setCurrentPage: (page: number) =>
      dispatch(setTablePage({ tableId, page })),
    setRowsPerPage: (rowsPerPage: number) =>
      dispatch(setTableRowsPerPage({ tableId, rowsPerPage })),
    clearFilters: () => dispatch(resetTableFilters({ tableId, defaults })),
  };
}
