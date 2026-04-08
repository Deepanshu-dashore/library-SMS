"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { setIsCollapsed, handleNavDirection } from "../store/themeSlice";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_ITEMS } from "@/constants/menuItems";

export const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { color, darkColor, mode, isCollapsed } = useSelector(
    (state: any) => state.theme
  );

  const handleMenuClick = (index: number, path: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      setOpenMenu(openMenu === index ? null : index);
    } else if (path) {
      router.push(path);
      setOpenMenu(null);
    }
  };

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    dispatch(setIsCollapsed(newCollapsed));
    dispatch(handleNavDirection(newCollapsed ? "nav-close" : "nav-open"));
  };

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <motion.div
      className="h-screen border-r relative overflow-visible"
      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
      initial={{ width: isCollapsed ? "4rem" : "16rem" }}
      animate={{ width: isCollapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapse Button */}
      <button
        onClick={handleCollapseToggle}
        className={`p-1.5 absolute cursor-pointer ${isCollapsed ? "top-5 -right-4" : "top-5 right-3"
          } z-50 rounded-md transition-all duration-200 hover:scale-105`}
        style={{
          backgroundColor: mode === "light" ? "var(--gray-200)" : "var(--gray-800)",
          color: "var(--gray-500)",
          border: "1px solid var(--border)",
        }}
      >
        <Icon
          icon={isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"}
          className="text-sm"
        />
      </button>

      {/* Logo */}
      <div className="p-2.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 overflow-visible px-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-blue-600 to-purple-600 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-lg font-extrabold" style={{ color: "var(--text)" }}>
                  Library SMS
                </h1>
                <p className="text-[9px]" style={{ color: "var(--gray-500)" }}>
                  Smart Management System
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
        {MENU_ITEMS.map((item: any, index: number) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Parent */}
            <div
              className={`flex items-center justify-between cursor-pointer p-2 rounded-md transition-all duration-200 hover:bg-opacity-50`}
              style={{
                backgroundColor: isActiveRoute(item.path)
                  ? `${color}15`
                  : item.subItems && openMenu === index
                    ? `var(--gray-100)`
                    : "transparent",
                color: isActiveRoute(item.path)
                  ? color
                  : item.subItems && openMenu === index
                    ? `var(--gray-600)`
                    : "var(--gray-500)",
              }}
              onClick={() => handleMenuClick(index, item.path, !!item.subItems)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 text-lg rounded-md transition-all duration-200"
                  style={{
                    backgroundColor: isActiveRoute(item.path)
                      ? `${color}20`
                      : item.subItems && openMenu === index
                        ? `var(--gray-200)`
                        : `var(--gray-100)`,
                    color: isActiveRoute(item.path)
                      ? color
                      : item.subItems && openMenu === index
                        ? `var(--gray-600)`
                        : "var(--gray-400)",
                  }}
                >
                  <item.icon className="w-5 h-5"/>
                </div>
                {!isCollapsed && (
                  <span className="text-[13.5px] font-medium">{item.title}</span>
                )}
              </div>

              {!isCollapsed && item.subItems && (
                <Icon
                  icon={
                    openMenu === index
                      ? "lucide:chevron-up"
                      : "lucide:chevron-down"
                  }
                  className="text-xs"
                  style={{ color: "var(--gray-400)" }}
                />
              )}
            </div>

            {/* Sub-Items */}
            <AnimatePresence>
              {item.subItems && openMenu === index && !isCollapsed && (
                <motion.div
                  className="ml-6 mt-1 mb-2 space-y-0.5 pl-3"
                  style={{ borderColor: "var(--border)" }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.subItems.map((sub: any, subIndex: number) => (
                    <div
                      key={subIndex}
                      className={`cursor-pointer relative -left-3.5 flex ${subIndex === 0 ? "pt-2" : ""}`}
                    >
                      <span
                        className={`w-3 ${subIndex === 0 ? "h-6 -top-0" : "h-11.5 -top-7"
                          } rounded-bl-sm border-l-2 border-b-2 border-[var(--gray-300)] absolute`}
                      ></span>
                      <Link
                        key={subIndex}
                        href={sub.path}
                        className="block px-2 w-11/12 ml-3 py-2 text-xs rounded-md transition-all duration-200 hover:bg-opacity-50"
                        style={{
                          backgroundColor: isActiveRoute(sub.path)
                            ? `${color}10`
                            : "transparent",
                          color: isActiveRoute(sub.path)
                            ? color
                            : "var(--gray-600)",
                        }}
                      >
                        {sub.name}
                      </Link>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
