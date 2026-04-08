"use client";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import { initTheme } from "../store/themeSlice";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initTheme());
    setMounted(true);
  }, [dispatch]);

  // To completely avoid SSR mismatch in visual trees based on store, 
  // we do not render children visually until client has mounted and store loaded.
  return (
    <div style={{ visibility: mounted ? "visible" : "hidden", display: "contents" }}>
      {children}
    </div>
  );
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeInitializer>{children}</ThemeInitializer>
    </Provider>
  );
}
