"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TableId } from "@/constants/tableIds";

export interface TablePersistState {
  search: string;
  activeFilter: string;
  currentPage: number;
  rowsPerPage: number;
}

export const DEFAULT_TABLE_STATE: TablePersistState = {
  search: "",
  activeFilter: "All",
  currentPage: 1,
  rowsPerPage: 10,
};

const SESSION_KEY = "lms_table_state";

type TablesState = Record<string, TablePersistState>;

interface TableSliceState {
  tables: TablesState;
  hydrated: Record<string, boolean>;
}

function readSession(): TablesState {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSession(tables: TablesState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(tables));
  } catch {
    /* ignore quota errors */
  }
}

function mergeDefaults(
  saved: Partial<TablePersistState> | undefined,
  defaults: Partial<TablePersistState>,
): TablePersistState {
  return {
    search: saved?.search ?? defaults.search ?? DEFAULT_TABLE_STATE.search,
    activeFilter:
      saved?.activeFilter ?? defaults.activeFilter ?? DEFAULT_TABLE_STATE.activeFilter,
    currentPage: saved?.currentPage ?? defaults.currentPage ?? DEFAULT_TABLE_STATE.currentPage,
    rowsPerPage: saved?.rowsPerPage ?? defaults.rowsPerPage ?? DEFAULT_TABLE_STATE.rowsPerPage,
  };
}

function ensureTable(
  state: TableSliceState,
  tableId: string,
  defaults: Partial<TablePersistState> = {},
) {
  if (!state.tables[tableId]) {
    state.tables[tableId] = mergeDefaults(undefined, defaults);
  }
}

const initialState: TableSliceState = {
  tables: {},
  hydrated: {},
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    hydrateTable: (
      state,
      action: PayloadAction<{ tableId: TableId; defaults?: Partial<TablePersistState> }>,
    ) => {
      const { tableId, defaults = {} } = action.payload;
      if (state.hydrated[tableId]) return;

      const session = readSession();
      state.tables[tableId] = mergeDefaults(session[tableId], defaults);
      state.hydrated[tableId] = true;
    },

    setTableSearch: (
      state,
      action: PayloadAction<{ tableId: TableId; value: string }>,
    ) => {
      const { tableId, value } = action.payload;
      ensureTable(state, tableId);
      state.tables[tableId].search = value;
      state.tables[tableId].currentPage = 1;
      writeSession(state.tables);
    },

    setTableActiveFilter: (
      state,
      action: PayloadAction<{ tableId: TableId; value: string }>,
    ) => {
      const { tableId, value } = action.payload;
      ensureTable(state, tableId);
      state.tables[tableId].activeFilter = value;
      state.tables[tableId].currentPage = 1;
      writeSession(state.tables);
    },

    setTablePage: (
      state,
      action: PayloadAction<{ tableId: TableId; page: number }>,
    ) => {
      const { tableId, page } = action.payload;
      ensureTable(state, tableId);
      state.tables[tableId].currentPage = page;
      writeSession(state.tables);
    },

    setTableRowsPerPage: (
      state,
      action: PayloadAction<{ tableId: TableId; rowsPerPage: number }>,
    ) => {
      const { tableId, rowsPerPage } = action.payload;
      ensureTable(state, tableId);
      state.tables[tableId].rowsPerPage = rowsPerPage;
      state.tables[tableId].currentPage = 1;
      writeSession(state.tables);
    },

    resetTableFilters: (
      state,
      action: PayloadAction<{ tableId: TableId; defaults?: Partial<TablePersistState> }>,
    ) => {
      const { tableId, defaults = {} } = action.payload;
      state.tables[tableId] = mergeDefaults(
        {
          search: "",
          activeFilter: defaults.activeFilter ?? DEFAULT_TABLE_STATE.activeFilter,
          currentPage: 1,
          rowsPerPage: defaults.rowsPerPage ?? DEFAULT_TABLE_STATE.rowsPerPage,
        },
        defaults,
      );
      writeSession(state.tables);
    },
  },
});

export const {
  hydrateTable,
  setTableSearch,
  setTableActiveFilter,
  setTablePage,
  setTableRowsPerPage,
  resetTableFilters,
} = tableSlice.actions;

export default tableSlice.reducer;
