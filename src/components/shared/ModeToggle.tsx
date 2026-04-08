"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../store/themeSlice";

export default function ModeToggle() {
  const dispatch = useDispatch();
  const { mode, activeNavColor, activeNavStyle } = useSelector(
    (state: any) => state.theme
  );

  const toggleMode = () => {
    dispatch(setMode(mode === "light" ? "dark" : "light"));
  };
  
  return (
    <motion.button
      onClick={toggleMode}
      whileTap={{ scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className={clsx(`md:p-2 p-1 md:flex hidden rounded-full md:rounded-xl items-center justify-center cursor-pointer transition-colors ${mode === "light" && " shadow-gray-300/50 shadow-md "}
        ${mode === "light"
          ? (activeNavStyle === "nav-top"
            ? (activeNavColor === "light"
              ? "text-amber-300 bg-gray-300/30 hover:bg-gray-300/50"
              : "text-gray-400 hover:bg-gray-700/30")
            : "text-orange-900/30 bg-gradient-radial-amber  hover:bg-gray-200/20")
          : (activeNavStyle === "nav-top"
            ? (activeNavColor === "light"
              ? "text-gray-100 bg-gray-800 hover:bg-gray-700"
              : "text-gray-400 hover:bg-gray-700/30")
            : "text-gray-100 bg-gradient-to-br from-blue-900 to-rose-900 via-indigo-900 hover:bg-gray-700")}
      `)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Icon icon="ph:lightbulb-filament-duotone" className="md:w-5 md:h-5 w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Icon icon="duo-icons:moon-stars" className="md:w-5 md:h-5 w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
