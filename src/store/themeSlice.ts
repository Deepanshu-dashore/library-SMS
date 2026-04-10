"use client";
import { createSlice } from "@reduxjs/toolkit";

const defaultTheme = {
  color: "#00a76f",
  darkColor: "#007867",
  bgColor: "#00a76f14",
  mode: "light",
  activeNavStyle: "nav-open",
  activeNavColor: "light",
  activeFont: "Public Sans",
  isCollapsed: false,
};

const applyThemeEffects = (theme: any) => {
  if (typeof window === "undefined") return;
  const FONT_CLASSES: Record<string, string> = {
    "Public Sans": "publicFont",
    "Inter": "InterFont",
    "DM Sans": "DMSansFont",
    "Nunito Sans": "NunitoFont",
  };
  document.body.className = FONT_CLASSES[theme.activeFont] || "";

  if (theme.mode === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  localStorage.setItem("selectedTheme", JSON.stringify(theme));
};

const themeSlice = createSlice({
  name: "theme",
  // Crucial: Server and Client must perfectly match on first render
  initialState: defaultTheme, 
  reducers: {
    initTheme: (state) => {
      if (typeof window !== "undefined") {
        try {
          const saved = JSON.parse(localStorage.getItem("selectedTheme") as string);
          if (saved) {
            Object.assign(state, saved);
          }
        } catch {}
        applyThemeEffects(state);
      }
    },
    setColor: (state, action) => {
      state.color = action.payload;
      applyThemeEffects(state);
    },
    setDarkColor: (state, action) => {
      state.darkColor = action.payload;
      applyThemeEffects(state);
    },
    setBgColor: (state, action) => {
      state.bgColor = action.payload;
      applyThemeEffects(state);
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      state.activeNavColor = action.payload === "light" ? "light" : "dark";
      applyThemeEffects(state);
    },
    setNavStyle: (state, action) => {
      state.activeNavStyle = action.payload;
      state.isCollapsed = action.payload === "nav-close";
      applyThemeEffects(state);
    },
    setNavColor: (state, action) => {
      state.activeNavColor = action.payload;
      applyThemeEffects(state);
    },
    setFont: (state, action) => {
      state.activeFont = action.payload;
      applyThemeEffects(state);
    },
    setIsCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
      applyThemeEffects(state);
    },
    resetDefaults: (state) => {
      Object.assign(state, defaultTheme);
      if (typeof window !== "undefined") {
        localStorage.removeItem("selectedTheme");
      }
      applyThemeEffects(state);
    },
    handleNavDirection: (state, action) => {
      const direction = action.payload;
      if (direction === "nav-open") {
        state.isCollapsed = false;
        state.activeNavStyle = "nav-open";
      } else if (direction === "nav-close") {
        state.isCollapsed = true;
        state.activeNavStyle = "nav-close";
      } else if (direction === "nav-top") {
        state.isCollapsed = false;
        state.activeNavStyle = "nav-top";
      }
      applyThemeEffects(state);
    },
  },
});

export const {
  initTheme,
  setColor,
  setDarkColor,
  setBgColor,
  setMode,
  setNavStyle,
  setNavColor,
  setFont,
  setIsCollapsed,
  resetDefaults,
  handleNavDirection,
} = themeSlice.actions;

export default themeSlice.reducer;
