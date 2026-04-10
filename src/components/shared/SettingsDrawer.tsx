import { useState } from "react";
import {
  resetDefaults,
  setFont,
  setBgColor,
  setNavColor,
  handleNavDirection,
  setDarkColor,
  setColor,
} from "../../store/themeSlice";
import { useDispatch, useSelector } from "react-redux";

const themes = [
  {
    name: "#00a76f",
    textColor: "#00a76f",
    bgColor: "#00a76f14",
    Dark: "#007867",
  },
  { name: "Blue", textColor: "#407BFF", bgColor: "#407BFF14", Dark: "#063ba7" },
  {
    name: "Orange",
    textColor: "#ffab00",
    bgColor: "#ffab0014",
    Dark: "#b66816",
  },
  {
    name: "#7635dc",
    textColor: "#7635dc",
    bgColor: "#7635dc14",
    Dark: "#431a9e",
  },
  { name: "Red", textColor: "#ff3030", bgColor: "#ff563014", Dark: "#b71833" },
  {
    name: "#04b4f1",
    textColor: "#04b4f1",
    bgColor: "#04b4f114",
    Dark: "#0351ab",
  },
  {
    name: "#6950e8",
    textColor: "#6950e8",
    bgColor: "#6950e814",
    Dark: "#3d2aa5",
  },
];

export default function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dispatch = useDispatch();
  const { activeFont, color, activeNavColor, activeNavStyle, mode } =
    useSelector((state: any) => state.theme);
  // console.log("selectedColor",color)

  function handleThemeChange(theme: any) {
    console.log("select theme", theme);
    dispatch(setColor(theme.textColor));
    dispatch(setDarkColor(theme.Dark));
    dispatch(setBgColor(theme.bgColor));
    // Save to localStorage
    localStorage.setItem("selectedTheme", JSON.stringify(theme));
  }

  function handleFullScreen() {
    if (document.fullscreenElement) {
      window.document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      window.document.body.requestFullscreen();
      setIsFullscreen(true);
    }
  }


  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`md:p-2 p-1 cursor-pointer rounded-xl md:shadow-lg ${mode === "light"
          ? activeNavStyle === "nav-top"
            ? activeNavColor === "dark"
              ? "text-gray-300"
              : "md:bg-gray-200 bg-transparent text-gray-700"
            : "md:bg-gray-200 bg-transparent text-gray-600"
          : activeNavStyle === "nav-top"
            ? activeNavColor === "dark"
              ? "text-gray-300"
              : "md:bg-gray-800 bg-transparent text-gray-100"
            : "md:bg-gray-800 bg-transparent text-gray-100"
          }
          `}
      >
        <svg
          className={`md:w-5.5 md:h-5.5 w-4.5 h-4.5 
             transition-transform duration-[1500ms] ease-in-out  
          ${!open ? "animate-[spin_5s_linear_infinite]" : "rotate-0"}
         
            ${mode === "light" ? "fill-gray-500" : "fill-gray-300"

            }`}
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083"
            clipRule="evenodd"
            opacity="0.5"
          />
          <path
            fill="currentColor"
            d="M15.523 12c0 1.657-1.354 3-3.023 3c-1.67 0-3.023-1.343-3.023-3S10.83 9 12.5 9c1.67 0 3.023 1.343 3.023 3"
          />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={`fixed z-10 top-0 right-0 h-full w-[360px] shadow-lg p-5 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          } ${mode === "light"
            ? "bg-gray-100 border-l border-gray-200"
            : "bg-gradient-to-tr from-[#151b23] via-[#151b23] to-[#162932] border-l border-gray-700"
          }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${mode === "light" ? "text-gray-900" : "text-gray-100"
            }`}
        >
          Settings
        </h2>
        <div className="h-[92dvh] scroll-hide overflow-scrol">
          <div
            className="my-6"
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              padding: "32px 16px 16px",
              borderRadius: "16px",
              border:
                mode === "light"
                  ? "0.888889px solid rgba(145, 158, 171, 0.12)"
                  : "0.888889px solid rgba(75, 85, 99, 0.3)",
              gap: "20px",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                top: "-12px",
                lineHeight: "22px",
                borderRadius: "22px",
                position: "absolute",
                WebkitBoxAlign: "center",
                alignItems: "center",
                display: "flex",
                padding: "0px 10px",
                fontSize: "13px",
                color:
                  mode === "light"
                    ? "rgb(255, 255, 255)"
                    : "rgb(243, 244, 246)",
                fontWeight: 600,
                backgroundColor:
                  mode === "light" ? "rgb(28, 37, 46)" : "rgb(55, 65, 81)",
                boxSizing: "border-box",
              }}
            >
              Nav
              <span title="Dashboard only">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  aria-label="Dashboard only"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  style={{
                    width: "14px",
                    height: "14px",
                    flexShrink: 0,
                    display: "flex",
                    marginLeft: "4px",
                    marginRight: "-4px",
                    opacity: "0.48",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"
                    style={{ boxSizing: "border-box" }}
                  ></path>
                  <circle
                    cx="12"
                    cy="8"
                    r="1"
                    fill="currentColor"
                    style={{ boxSizing: "border-box" }}
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M12 10a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1"
                    style={{ boxSizing: "border-box" }}
                  ></path>
                </svg>
              </span>
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <button
                tabIndex={0}
                type="button"
                style={{
                  display: "flex",
                  WebkitBoxAlign: "center",
                  alignItems: "center",
                  WebkitBoxPack: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  outline: "rgb(28, 37, 46) none 0px",
                  border: "0px none rgb(28, 37, 46)",
                  margin: "0px",
                  borderRadius: "0px",
                  padding: "0px",
                  userSelect: "none",
                  verticalAlign: "middle",
                  appearance: "none",
                  textDecoration: "none solid rgb(28, 37, 46)",
                  fontFamily:
                    '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  lineHeight: "16px",
                  alignSelf: "flex-start",
                  gap: "2px",
                  fontSize: "11px",
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  color:
                    mode === "light"
                      ? "rgb(28, 37, 46)"
                      : activeNavStyle === "nav-open"
                        ? "#919eab"
                        : "rgb(243, 244, 246)",
                  fontWeight: 700,
                }}
              >
                {activeNavStyle !== "nav-open" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(handleNavDirection("nav-open"));
                    }}
                    style={{
                      width: "14px",
                      height: "14px",
                      flexShrink: 0,
                      display: "flex",
                      boxSizing: "border-box",
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162"
                      style={{ boxSizing: "border-box" }}
                    ></path>
                  </svg>
                )}
                Layout
              </button>
              <div
                style={{
                  gap: "12px",
                  display: "grid",
                  gridTemplateColumns: "87.4028px 87.4028px 87.4167px",
                  boxSizing: "border-box",
                }}
              >
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(handleNavDirection("nav-open"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeNavStyle !== "nav-open"
                        ? "rgba(0, 0, 0, 0)"
                        : mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46,1)",
                    outline: "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    padding: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration: "none solid rgb(145, 158, 171)",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    boxShadow:
                      activeNavStyle === "nav-open" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    color:
                      mode === "light"
                        ? "rgb(145, 158, 171)"
                        : "rgb(156, 163, 175)",
                    fontWeight: 600,
                    fontSize: "13px",
                    height: "64px",
                    border: "0.888889px solid rgba(145, 158, 171, 0.08)",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      width: "100%",
                      height: "62.2222px",
                      color:
                        mode === "light"
                          ? "rgb(145, 158, 171)"
                          : "rgb(156, 163, 175)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-cllw2t"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 86 64"
                      width="86"
                      height="64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1153_603)">
                        <mask id="path-2-inside-1_1153_603" fill="white">
                          <path d="M0 0H32V64H0V0Z" />
                        </mask>
                        <path
                          d="M31 0V64H33V0H31Z"
                          fill="currentColor"
                          fillOpacity="0.08"
                          mask="url(#path-2-inside-1_1153_603)"
                        />
                        <circle
                          opacity="0.8"
                          cx="11"
                          cy="11"
                          r="5"
                          fill={
                            activeNavStyle === "nav-open"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.48"
                          x="6"
                          y="20"
                          width="20"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-open"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.24"
                          x="6"
                          y="28"
                          width="14"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-open"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.2"
                          x="36"
                          y="4"
                          width="46"
                          height="56"
                          rx="8"
                          fill={
                            activeNavStyle === "nav-open"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1153_603">
                          <path
                            d="M0 12C0 5.37258 5.37258 0 12 0H74C80.6274 0 86 5.37258 86 12V52C86 58.6274 80.6274 64 74 64H12C5.37258 64 0 58.6274 0 52V12Z"
                            fill="white"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </button>
                <button
                 tabIndex={0}
                  onClick={() => dispatch(handleNavDirection("nav-top"))}
                  type="button"
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    outline:
                      activeNavStyle === "nav-top"
                        ? "rgb(28, 37, 46) none 0px"
                        : "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    padding: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration: "none solid rgb(28, 37, 46)",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      mode === "light"
                        ? "rgb(28, 37, 46)"
                        : "rgb(243, 244, 246)",
                    fontWeight: 600,
                    fontSize: "13px",
                    backgroundColor:
                      activeNavStyle !== "nav-top"
                        ? "rgba(0, 0, 0, 0)"
                        : mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46,1)",
                    boxShadow:
                      activeNavStyle === "nav-top" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    height: "64px",
                    border: "0.888889px solid rgba(145, 158, 171, 0.08)",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      width: "100%",
                      height: "62.2222px",
                      color:
                        mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(243, 244, 246)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-cllw2t"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 86 64"
                      width="86"
                      height="64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1153_596)">
                        <mask id="path-2-inside-1_1153_596" fill="white">
                          <path d="M0 0H86V22H0V0Z" />
                        </mask>
                        <path
                          d="M86 21H0V23H86V21Z"
                          fill="currentColor"
                          fillOpacity="0.08"
                          mask="url(#path-2-inside-1_1153_596)"
                        />
                        <circle
                          opacity="0.8"
                          cx="11"
                          cy="11"
                          r="5"
                          fill={
                            activeNavStyle === "nav-top"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.48"
                          x="20"
                          y="9"
                          width="16"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-top"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.24"
                          x="40"
                          y="9"
                          width="10"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-top"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.2"
                          x="4"
                          y="26"
                          width="78"
                          height="34"
                          rx="8"
                          fill={
                            activeNavStyle === "nav-top"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1153_596">
                          <path
                            d="M0 12C0 5.37258 5.37258 0 12 0H74C80.6274 0 86 5.37258 86 12V52C86 58.6274 80.6274 64 74 64H12C5.37258 64 0 58.6274 0 52V12Z"
                            fill="white"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </button>
                <button
                 tabIndex={0}
                  onClick={() => dispatch(handleNavDirection("nav-close"))}
                  type="button"
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeNavStyle !== "nav-close"
                        ? "rgba(0, 0, 0, 0)"
                        : mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46,1)",
                    outline: "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    padding: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration: "none solid rgb(145, 158, 171)",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      mode === "light"
                        ? "rgb(145, 158, 171)"
                        : "rgb(156, 163, 175)",
                    boxShadow:
                      activeNavStyle === "nav-close" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    fontWeight: 600,
                    fontSize: "13px",
                    height: "64px",
                    border: "0.888889px solid rgba(145, 158, 171, 0.08)",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      width: "100%",
                      height: "62.2222px",
                      color:
                        mode === "light"
                          ? "rgb(145, 158, 171)"
                          : "rgb(156, 163, 175)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-cllw2t"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 86 64"
                      width="86"
                      height="64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1153_589)">
                        <mask id="path-2-inside-1_1153_589" fill="white">
                          <path d="M0 0H22V64H0V0Z" />
                        </mask>
                        <path
                          d="M21 0V64H23V0H21Z"
                          fill="currentColor"
                          fillOpacity="0.08"
                          mask="url(#path-2-inside-1_1153_589)"
                        />
                        <circle
                          opacity="0.8"
                          cx="11"
                          cy="11"
                          r="5"
                          fill={
                            activeNavStyle === "nav-close"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.48"
                          x="6"
                          y="20"
                          width="10"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-close"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.24"
                          x="6"
                          y="28"
                          width="10"
                          height="4"
                          rx="2"
                          fill={
                            activeNavStyle === "nav-close"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                        <rect
                          opacity="0.2"
                          x="26"
                          y="4"
                          width="56"
                          height="56"
                          rx="8"
                          fill={
                            activeNavStyle === "nav-close"
                              ? color
                              : "rgb(145, 158, 171)"
                          }
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1153_589">
                          <path
                            d="M0 12C0 5.37258 5.37258 0 12 0H74C80.6274 0 86 5.37258 86 12V52C86 58.6274 80.6274 64 74 64H12C5.37258 64 0 58.6274 0 52V12Z"
                            fill="white"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            {/* Nav color dark and light style chnager  */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <button
               tabIndex={0}
                type="button"
                style={{
                  display: "flex",
                  WebkitBoxAlign: "center",
                  alignItems: "center",
                  WebkitBoxPack: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  outline: "rgb(99, 115, 129) none 0px",
                  border: "0px none rgb(99, 115, 129)",
                  margin: "0px",
                  borderRadius: "0px",
                  padding: "0px",
                  userSelect: "none",
                  verticalAlign: "middle",
                  appearance: "none",
                  textDecoration: "none solid rgb(99, 115, 129)",
                  fontFamily:
                    '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  cursor: "default",
                  lineHeight: "16px",
                  alignSelf: "flex-start",
                  gap: "2px",
                  fontSize: "11px",
                  color:
                    mode === "light"
                      ? "rgb(28, 37, 46)"
                      : activeNavColor === "light"
                        ? "#919eab"
                        : "rgb(243, 244, 246)",
                  fontWeight: 600,
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {activeNavColor !== "light" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setNavColor("light"));
                    }}
                    style={{
                      width: "14px",
                      height: "14px",
                      flexShrink: 0,
                      display: "flex",
                      boxSizing: "border-box",
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162"
                      style={{ boxSizing: "border-box" }}
                    ></path>
                  </svg>
                )}
                Color
              </button>
              <div
                style={{
                  gap: "12px",
                  display: "grid",
                  gridTemplateColumns: "137.111px 137.111px",
                  boxSizing: "border-box",
                }}
              >
                <button
                  onClick={() => dispatch(setNavColor("light"))}
                 tabIndex={0}
                  type="button"
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    outline: "rgb(28, 37, 46) none 0px",
                    margin: "0px",
                    padding: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration: "none solid rgb(28, 37, 46)",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeNavColor === "light"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(243, 244, 246)"
                        : "rgb(145, 158, 171)",
                    borderWidth: activeNavColor === "light" && "0.888889px",
                    borderStyle: activeNavColor === "light" && "solid",
                    borderColor: "var(--border)",
                    borderImage: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    backgroundColor:
                      activeNavColor === "light"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    boxShadow:
                      activeNavColor === "light" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    gap: "12px",
                    height: "56px",
                    textTransform: "capitalize",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      flexShrink: 0,
                      display: "flex",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-ia94qz"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.557 2.25C16.395 2.25 17.851 2.25 18.99 2.403C20.162 2.561 21.111 2.893 21.86 3.641C22.608 4.39 22.94 5.339 23.098 6.511C23.251 7.651 23.251 9.106 23.251 10.944V13.056C23.251 14.894 23.251 16.35 23.098 17.489C22.94 18.661 22.608 19.61 21.86 20.359C21.111 21.107 20.162 21.439 18.99 21.597C17.85 21.75 16.395 21.75 14.557 21.75H9.53498C9.51097 21.7508 9.48695 21.7505 9.46298 21.749C8.07898 21.745 6.93998 21.722 6.01198 21.597C4.83998 21.439 3.89098 21.107 3.14198 20.359C2.39398 19.61 2.06198 18.661 1.90398 17.489C1.75098 16.349 1.75098 14.894 1.75098 13.056V10.944C1.75098 9.106 1.75098 7.65 1.90398 6.511C2.06198 5.339 2.39398 4.39 3.14198 3.641C3.89098 2.893 4.83998 2.561 6.01198 2.403C6.93998 2.278 8.07898 2.255 9.46198 2.251C9.4863 2.24984 9.51066 2.24984 9.53498 2.251L10.445 2.25H14.557ZM10.251 3.75H14.501C16.408 3.75 17.762 3.752 18.791 3.89C19.796 4.025 20.376 4.279 20.799 4.702C21.222 5.125 21.476 5.705 21.611 6.711C21.749 7.739 21.751 9.093 21.751 11V13C21.751 14.907 21.749 16.262 21.611 17.29C21.476 18.295 21.222 18.875 20.799 19.298C20.376 19.721 19.796 19.975 18.79 20.11C17.762 20.248 16.408 20.25 14.501 20.25H10.251V3.75ZM8.75098 20.244C7.71698 20.234 6.89298 20.202 6.21098 20.11C5.20598 19.975 4.62598 19.721 4.20298 19.298C3.77998 18.875 3.52598 18.295 3.39098 17.289C3.25298 16.262 3.25098 14.907 3.25098 13V11C3.25098 9.093 3.25298 7.739 3.39098 6.71C3.52598 5.705 3.77998 5.125 4.20298 4.702C4.62598 4.279 5.20598 4.025 6.21198 3.89C6.89198 3.798 7.71698 3.767 8.75098 3.756V20.244Z"
                        fill={
                          activeNavColor === "light"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                      <path
                        d="M4.49991 9C4.49991 8.58579 4.8357 8.25 5.24991 8.25H6.74991C7.16412 8.25 7.49991 8.58579 7.49991 9C7.49991 9.41421 7.16412 9.75 6.74991 9.75H5.24991C4.8357 9.75 4.49991 9.41421 4.49991 9Z"
                        fill={
                          activeNavColor === "light"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                      <path
                        d="M4.49991 12C4.49991 11.5858 4.8357 11.25 5.24991 11.25H6.74991C7.16412 11.25 7.49991 11.5858 7.49991 12C7.49991 12.4142 7.16412 12.75 6.74991 12.75H5.24991C4.8357 12.75 4.49991 12.4142 4.49991 12Z"
                        fill={
                          activeNavColor === "light"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                      <path
                        d="M4.49991 15C4.49991 14.5858 4.8357 14.25 5.24991 14.25H6.74991C7.16412 14.25 7.49991 14.5858 7.49991 15C7.49991 15.4142 7.16412 15.75 6.74991 15.75H5.24991C4.8357 15.75 4.49991 15.4142 4.49991 15Z"
                        fill={
                          activeNavColor === "light"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                    </svg>
                  </span>
                  integrate
                </button>
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(setNavColor("dark"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeNavColor === "dark"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    outline: "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    padding: "0px",
                    cursor: "pointer",
                    borderWidth: activeNavColor === "dark" && "0.888889px",
                    borderStyle: activeNavColor === "dark" && "solid",
                    borderColor: "var(--border)",
                    borderImage: "none",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration: "none solid rgb(145, 158, 171)",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeNavColor === "dark"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(243, 244, 246)"
                        : "rgb(145, 158, 171)",
                    boxShadow:
                      activeNavColor === "dark" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    fontWeight: 600,
                    fontSize: "13px",
                    gap: "12px",
                    height: "56px",
                    textTransform: "capitalize",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      flexShrink: 0,
                      display: "flex",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-ia94qz"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.99 2.403C17.851 2.25 16.395 2.25 14.557 2.25H10.445L9.53498 2.251C9.51066 2.24984 9.4863 2.24984 9.46198 2.251C8.07898 2.255 6.93998 2.278 6.01198 2.403C4.83998 2.561 3.89098 2.893 3.14198 3.641C2.39398 4.39 2.06198 5.339 1.90398 6.511C1.75098 7.65 1.75098 9.106 1.75098 10.944V13.056C1.75098 14.894 1.75098 16.349 1.90398 17.489C2.06198 18.661 2.39398 19.61 3.14198 20.359C3.89098 21.107 4.83998 21.439 6.01198 21.597C6.93998 21.722 8.07898 21.745 9.46298 21.749C9.48695 21.7505 9.51097 21.7508 9.53498 21.75H14.557C16.395 21.75 17.85 21.75 18.99 21.597C20.162 21.439 21.111 21.107 21.86 20.359C22.608 19.61 22.94 18.661 23.098 17.489C23.251 16.35 23.251 14.894 23.251 13.056V10.944C23.251 9.106 23.251 7.651 23.098 6.511C22.94 5.339 22.608 4.39 21.86 3.641C21.111 2.893 20.162 2.561 18.99 2.403ZM14.501 3.75H10.251V20.25H14.501C16.408 20.25 17.762 20.248 18.79 20.11C19.796 19.975 20.376 19.721 20.799 19.298C21.222 18.875 21.476 18.295 21.611 17.29C21.749 16.262 21.751 14.907 21.751 13V11C21.751 9.093 21.749 7.739 21.611 6.711C21.476 5.705 21.222 5.125 20.799 4.702C20.376 4.279 19.796 4.025 18.791 3.89C17.762 3.752 16.408 3.75 14.501 3.75ZM4.49993 9C4.49993 8.58579 4.83571 8.25 5.24993 8.25H6.74993C7.16414 8.25 7.49993 8.58579 7.49993 9C7.49993 9.41421 7.16414 9.75 6.74993 9.75H5.24993C4.83571 9.75 4.49993 9.41421 4.49993 9ZM4.49993 12C4.49993 11.5858 4.83571 11.25 5.24993 11.25H6.74993C7.16414 11.25 7.49993 11.5858 7.49993 12C7.49993 12.4142 7.16414 12.75 6.74993 12.75H5.24993C4.83571 12.75 4.49993 12.4142 4.49993 12ZM5.24993 14.25C4.83571 14.25 4.49993 14.5858 4.49993 15C4.49993 15.4142 4.83571 15.75 5.24993 15.75H6.74993C7.16414 15.75 7.49993 15.4142 7.49993 15C7.49993 14.5858 7.16414 14.25 6.74993 14.25H5.24993Z"
                        fill={
                          activeNavColor === "dark"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                    </svg>
                  </span>
                  apparent
                </button>
              </div>
            </div>
          </div>

          {/* theme chnager  */}
          <div
            style={{ border: "0.888889px solid rgba(145, 158, 171, 0.12)" }}
            className="grid grid-cols-3 relative gap-3 p-3.5 pt-10 pb-5 rounded-xl"
          >
            <h3
              className={`text-xs flex items-center gap-1 -top-3 left-2.5 absolute font-semibold p-1 px-2 max-w-max rounded-xl mb-2 ${mode === "light"
                ? "text-white bg-gray-900"
                : "text-gray-100 bg-gray-700"
                }`}
            >
              {color !== "#00a76f" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(setColor("#00a76f"));
                    dispatch(setDarkColor("#007867"));
                    dispatch(setBgColor("#00a76f14"));
                  }}
                  style={{
                    width: "14px",
                    height: "14px",
                    flexShrink: 0,
                    display: "flex",
                    boxSizing: "border-box",
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162"
                    style={{ boxSizing: "border-box" }}
                  ></path>
                </svg>
              )}
              Presets
            </h3>
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme)}
                style={{
                  backgroundColor:
                    color === theme.textColor ? theme.bgColor : "",
                }}
                className={`w-22 h-16 flex cursor-pointer justify-center items-center rounded-lg transition-transform transform hover:scale-110 ${color === theme.textColor && "shadow-xs"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill={theme.name}
                    fillRule="evenodd"
                    d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22"
                    clipRule="evenodd"
                    opacity={0.5}
                  ></path>
                  <path
                    fill={theme.name}
                    d="M6 13.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm5.51-14.99l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                  ></path>
                </svg>
              </button>
            ))}
          </div>
          {/* font chnager   */}
          <div
            className="my-6"
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              padding: "32px 16px 16px",
              borderRadius: "16px",
              border: "0.888889px solid rgba(145, 158, 171, 0.12)",
              gap: "20px",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                top: "-12px",
                lineHeight: "22px",
                borderRadius: "22px",
                position: "absolute",
                WebkitBoxAlign: "center",
                alignItems: "center",
                display: "flex",
                padding: "0px 10px",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgb(255, 255, 255)",
                backgroundColor:
                  mode === "light" ? "rgb(17, 24, 39)" : "rgb(55, 65, 81)",
                boxSizing: "border-box",
              }}
            >
              Font
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <button
               tabIndex={0}
                type="button"
                style={{
                  display: "flex",
                  WebkitBoxAlign: "center",
                  alignItems: "center",
                  WebkitBoxPack: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  outline: "rgb(28, 37, 46) none 0px",
                  border: "0px none rgb(28, 37, 46)",
                  margin: "0px",
                  borderRadius: "0px",
                  padding: "0px",
                  userSelect: "none",
                  verticalAlign: "middle",
                  appearance: "none",
                  textDecoration: "none solid rgb(28, 37, 46)",
                  fontFamily:
                    '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  lineHeight: "16px",
                  alignSelf: "flex-start",
                  gap: "2px",
                  fontSize: "11px",
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  color:
                    mode === "light"
                      ? "rgb(28, 37, 46)"
                      : activeFont === "Public Sans"
                        ? "#919eab"
                        : "rgb(243, 244, 246)",
                  fontWeight: 700,
                }}
              >
                {activeFont !== "Public Sans" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    className="cursor-pointer"
                    viewBox="0 0 24 24"
                    onClick={() => dispatch(setFont("Public Sans"))}
                    style={{
                      width: "14px",
                      height: "14px",
                      flexShrink: 0,
                      display: "flex",
                      boxSizing: "border-box",
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162"
                      style={{ boxSizing: "border-box" }}
                    ></path>
                  </svg>
                )}
                Family
              </button>
              <div
                style={{
                  gap: "12px",
                  display: "grid",
                  gridTemplateColumns: "137.111px 137.111px",
                  boxSizing: "border-box",
                }}
              >
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(setFont("Public Sans"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeFont === "Public Sans"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    outline:
                      activeFont === "Public Sans"
                        ? "rgb(28, 37, 46) none 0px"
                        : "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration:
                      activeFont === "Public Sans"
                        ? mode === "light"
                          ? "none solid rgb(28, 37, 46)"
                          : "none solid rgb(145, 158, 171)"
                        : "none solid rgb(145, 158, 171)",
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeFont === "Public Sans"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)"
                        : "rgb(145, 158, 171)",
                    borderWidth: activeFont === "Public Sans" && "0.888889px",
                    borderStyle: activeFont === "Public Sans" && "solid",
                    borderImage: activeFont === "Public Sans" && "none",
                    borderColor:
                      activeFont === "Public Sans"
                        ? "rgba(145, 158, 171, 0.08)"
                        : " rgba(0, 0, 0, 0)",
                    fontWeight: 600,
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    boxShadow:
                      activeFont === "Public Sans" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    gap: "6px",
                    flexDirection: "column",
                    fontFamily:
                      '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      boxShadow:
                        activeFont === "Public Sans" &&
                        "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                      width: "28px",
                      height: "28px",
                      color:
                        activeFont === "Public Sans"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-952deb"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M17.1229 18.16C16.5754 18.16 16.0833 18.0577 15.6464 17.8531C15.2096 17.6485 14.864 17.3526 14.6096 16.9656C14.3552 16.5729 14.228 16.0974 14.228 15.5389C14.228 14.5988 14.5792 13.8855 15.2814 13.3989C15.9837 12.9067 17.0924 12.6523 18.6076 12.6357L19.6776 12.6192V12.1049C19.6776 11.7123 19.5615 11.4109 19.3292 11.2008C19.1025 10.9851 18.7486 10.88 18.2675 10.8856C17.9136 10.8911 17.5763 10.974 17.2556 11.1344C16.9404 11.2948 16.7247 11.574 16.6086 11.9722H14.593C14.6262 11.3528 14.8059 10.8441 15.1321 10.446C15.4584 10.0423 15.9008 9.74368 16.4593 9.55013C17.0233 9.35106 17.662 9.25153 18.3754 9.25153C19.2546 9.25153 19.9596 9.36212 20.4905 9.58331C21.0214 9.79897 21.4057 10.1114 21.6435 10.5206C21.8812 10.9243 22.0001 11.4054 22.0001 11.9639V17.9941H19.9762L19.7772 16.5176C19.4841 17.137 19.1163 17.5655 18.674 17.8033C18.2371 18.0411 17.7201 18.16 17.1229 18.16ZM17.9357 16.5674C18.1569 16.5674 18.3698 16.5287 18.5744 16.4513C18.7846 16.3683 18.9698 16.2605 19.1302 16.1278C19.2961 15.9896 19.4288 15.8347 19.5283 15.6633C19.6278 15.4919 19.6776 15.3149 19.6776 15.1324V13.8634L18.8067 13.8799C18.403 13.8855 18.027 13.9352 17.6786 14.0292C17.3302 14.1177 17.0482 14.2643 16.8326 14.4689C16.6224 14.6735 16.5174 14.95 16.5174 15.2983C16.5174 15.6965 16.6556 16.0089 16.9321 16.2356C17.2086 16.4568 17.5431 16.5674 17.9357 16.5674Z"
                        fill={
                          activeFont === "Public Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                      <path
                        d="M2 17.9941L6.29663 6H8.85139L13.1397 17.9941H10.726L9.74721 15.2154H5.43399L4.43033 17.9941H2ZM5.97314 13.1002H9.16658L7.5823 8.33909L5.97314 13.1002Z"
                        fill={
                          activeFont === "Public Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                    </svg>
                  </span>
                  Public Sans
                </button>
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(setFont("Inter"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeFont === "Inter"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    outline:
                      activeFont === "Inter"
                        ? "rgb(28, 37, 46) none 0px"
                        : "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration:
                      activeFont === "Inter"
                        ? "none solid rgb(28, 37, 46)"
                        : "none solid rgb(145, 158, 171)",
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeFont === "Inter"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)"
                        : "rgb(145, 158, 171)",
                    borderWidth: activeFont === "Inter" && "0.888889px",
                    borderStyle: activeFont === "Inter" && "solid",
                    borderImage: activeFont === "Inter" && "none",
                    borderColor:
                      activeFont === "Inter"
                        ? "rgba(145, 158, 171, 0.08)"
                        : " rgba(0, 0, 0, 0)",
                    fontWeight: 600,
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    gap: "6px",
                    flexDirection: "column",
                    boxShadow:
                      activeFont === "Inter" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    fontFamily:
                      '"Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      boxShadow:
                        activeFont === "Inter" &&
                        "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                      width: "28px",
                      height: "28px",
                      color:
                        activeFont === "Inter"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-952deb"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M17.1229 18.16C16.5754 18.16 16.0833 18.0577 15.6464 17.8531C15.2096 17.6485 14.864 17.3526 14.6096 16.9656C14.3552 16.5729 14.228 16.0974 14.228 15.5389C14.228 14.5988 14.5792 13.8855 15.2814 13.3989C15.9837 12.9067 17.0924 12.6523 18.6076 12.6357L19.6776 12.6192V12.1049C19.6776 11.7123 19.5615 11.4109 19.3292 11.2008C19.1025 10.9851 18.7486 10.88 18.2675 10.8856C17.9136 10.8911 17.5763 10.974 17.2556 11.1344C16.9404 11.2948 16.7247 11.574 16.6086 11.9722H14.593C14.6262 11.3528 14.8059 10.8441 15.1321 10.446C15.4584 10.0423 15.9008 9.74368 16.4593 9.55013C17.0233 9.35106 17.662 9.25153 18.3754 9.25153C19.2546 9.25153 19.9596 9.36212 20.4905 9.58331C21.0214 9.79897 21.4057 10.1114 21.6435 10.5206C21.8812 10.9243 22.0001 11.4054 22.0001 11.9639V17.9941H19.9762L19.7772 16.5176C19.4841 17.137 19.1163 17.5655 18.674 17.8033C18.2371 18.0411 17.7201 18.16 17.1229 18.16ZM17.9357 16.5674C18.1569 16.5674 18.3698 16.5287 18.5744 16.4513C18.7846 16.3683 18.9698 16.2605 19.1302 16.1278C19.2961 15.9896 19.4288 15.8347 19.5283 15.6633C19.6278 15.4919 19.6776 15.3149 19.6776 15.1324V13.8634L18.8067 13.8799C18.403 13.8855 18.027 13.9352 17.6786 14.0292C17.3302 14.1177 17.0482 14.2643 16.8326 14.4689C16.6224 14.6735 16.5174 14.95 16.5174 15.2983C16.5174 15.6965 16.6556 16.0089 16.9321 16.2356C17.2086 16.4568 17.5431 16.5674 17.9357 16.5674Z"
                        fill={
                          activeFont === "Inter"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                      <path
                        d="M2 17.9941L6.29663 6H8.85139L13.1397 17.9941H10.726L9.74721 15.2154H5.43399L4.43033 17.9941H2ZM5.97314 13.1002H9.16658L7.5823 8.33909L5.97314 13.1002Z"
                        fill={
                          activeFont === "Inter"
                            ? color
                            : mode === "light"
                              ? "rgb(145, 158, 171)"
                              : "rgb(156, 163, 175)"
                        }
                      />
                    </svg>
                  </span>
                  Inter
                </button>
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(setFont("DM Sans"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    backgroundColor:
                      activeFont === "DM Sans"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    outline:
                      activeFont === "DM Sans"
                        ? "rgb(28, 37, 46) none 0px"
                        : "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration:
                      activeFont === "DM Sans"
                        ? "none solid rgb(28, 37, 46)"
                        : "none solid rgb(145, 158, 171)",
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeFont === "DM Sans"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)"
                        : "rgb(145, 158, 171)",
                    borderWidth: activeFont === "DM Sans" && "0.888889px",
                    borderStyle: activeFont === "DM Sans" && "solid",
                    borderImage: activeFont === "DM Sans" && "none",
                    borderColor:
                      activeFont === "DM Sans"
                        ? "rgba(145, 158, 171, 0.08)"
                        : " rgba(0, 0, 0, 0)",
                    fontWeight: 600,
                    boxShadow:
                      activeFont === "DM Sans" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    gap: "6px",
                    flexDirection: "column",
                    fontFamily:
                      '"DM Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      boxShadow:
                        activeFont === "DM Sans" &&
                        "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                      width: "28px",
                      height: "28px",
                      color:
                        activeFont === "DM Sans"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-952deb"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M17.1229 18.16C16.5754 18.16 16.0833 18.0577 15.6464 17.8531C15.2096 17.6485 14.864 17.3526 14.6096 16.9656C14.3552 16.5729 14.228 16.0974 14.228 15.5389C14.228 14.5988 14.5792 13.8855 15.2814 13.3989C15.9837 12.9067 17.0924 12.6523 18.6076 12.6357L19.6776 12.6192V12.1049C19.6776 11.7123 19.5615 11.4109 19.3292 11.2008C19.1025 10.9851 18.7486 10.88 18.2675 10.8856C17.9136 10.8911 17.5763 10.974 17.2556 11.1344C16.9404 11.2948 16.7247 11.574 16.6086 11.9722H14.593C14.6262 11.3528 14.8059 10.8441 15.1321 10.446C15.4584 10.0423 15.9008 9.74368 16.4593 9.55013C17.0233 9.35106 17.662 9.25153 18.3754 9.25153C19.2546 9.25153 19.9596 9.36212 20.4905 9.58331C21.0214 9.79897 21.4057 10.1114 21.6435 10.5206C21.8812 10.9243 22.0001 11.4054 22.0001 11.9639V17.9941H19.9762L19.7772 16.5176C19.4841 17.137 19.1163 17.5655 18.674 17.8033C18.2371 18.0411 17.7201 18.16 17.1229 18.16ZM17.9357 16.5674C18.1569 16.5674 18.3698 16.5287 18.5744 16.4513C18.7846 16.3683 18.9698 16.2605 19.1302 16.1278C19.2961 15.9896 19.4288 15.8347 19.5283 15.6633C19.6278 15.4919 19.6776 15.3149 19.6776 15.1324V13.8634L18.8067 13.8799C18.403 13.8855 18.027 13.9352 17.6786 14.0292C17.3302 14.1177 17.0482 14.2643 16.8326 14.4689C16.6224 14.6735 16.5174 14.95 16.5174 15.2983C16.5174 15.6965 16.6556 16.0089 16.9321 16.2356C17.2086 16.4568 17.5431 16.5674 17.9357 16.5674Z"
                        fill={
                          activeFont === "DM Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                      <path
                        d="M2 17.9941L6.29663 6H8.85139L13.1397 17.9941H10.726L9.74721 15.2154H5.43399L4.43033 17.9941H2ZM5.97314 13.1002H9.16658L7.5823 8.33909L5.97314 13.1002Z"
                        fill={
                          activeFont === "DM Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                    </svg>
                  </span>
                  DM Sans
                </button>
                <button
                 tabIndex={0}
                  type="button"
                  onClick={() => dispatch(setFont("Nunito Sans"))}
                  style={{
                    display: "flex",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxSizing: "border-box",
                    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    outline:
                      activeFont === "Nunito Sans"
                        ? "rgb(28, 37, 46) none 0px"
                        : "rgb(145, 158, 171) none 0px",
                    margin: "0px",
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    appearance: "none",
                    textDecoration:
                      activeFont === "Nunito Sans"
                        ? "none solid rgb(28, 37, 46)"
                        : "none solid rgb(145, 158, 171)",
                    width: "100%",
                    borderRadius: "12px",
                    lineHeight: "18px",
                    color:
                      activeFont === "Nunito Sans"
                        ? mode === "light"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)"
                        : "rgb(145, 158, 171)",
                    borderWidth: activeFont === "Nunito Sans" && "0.888889px",
                    borderStyle: activeFont === "Nunito Sans" && "solid",
                    borderImage: activeFont === "Nunito Sans" && "none",
                    borderColor:
                      activeFont === "Nunito Sans"
                        ? "rgba(145, 158, 171, 0.08)"
                        : " rgba(0, 0, 0, 0)",
                    fontWeight: 600,
                    backgroundColor:
                      activeFont === "Nunito Sans"
                        ? mode === "light"
                          ? "rgb(255, 255, 255)"
                          : "rgb(28, 37, 46)"
                        : "rgba(0, 0, 0, 0)",
                    boxShadow:
                      activeFont === "Nunito Sans" &&
                      mode === "light" &&
                      "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    gap: "6px",
                    flexDirection: "column",
                    fontFamily:
                      '"Nunito Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      boxShadow:
                        activeFont === "Nunito Sans" &&
                        "rgba(145, 158, 171, 0.12) -8px 8px 20px -4px",
                      flexDirection: "column",
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      color:
                        activeFont === "Nunito Sans"
                          ? "rgb(28, 37, 46)"
                          : "rgb(145, 158, 171)",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-952deb"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M17.1229 18.16C16.5754 18.16 16.0833 18.0577 15.6464 17.8531C15.2096 17.6485 14.864 17.3526 14.6096 16.9656C14.3552 16.5729 14.228 16.0974 14.228 15.5389C14.228 14.5988 14.5792 13.8855 15.2814 13.3989C15.9837 12.9067 17.0924 12.6523 18.6076 12.6357L19.6776 12.6192V12.1049C19.6776 11.7123 19.5615 11.4109 19.3292 11.2008C19.1025 10.9851 18.7486 10.88 18.2675 10.8856C17.9136 10.8911 17.5763 10.974 17.2556 11.1344C16.9404 11.2948 16.7247 11.574 16.6086 11.9722H14.593C14.6262 11.3528 14.8059 10.8441 15.1321 10.446C15.4584 10.0423 15.9008 9.74368 16.4593 9.55013C17.0233 9.35106 17.662 9.25153 18.3754 9.25153C19.2546 9.25153 19.9596 9.36212 20.4905 9.58331C21.0214 9.79897 21.4057 10.1114 21.6435 10.5206C21.8812 10.9243 22.0001 11.4054 22.0001 11.9639V17.9941H19.9762L19.7772 16.5176C19.4841 17.137 19.1163 17.5655 18.674 17.8033C18.2371 18.0411 17.7201 18.16 17.1229 18.16ZM17.9357 16.5674C18.1569 16.5674 18.3698 16.5287 18.5744 16.4513C18.7846 16.3683 18.9698 16.2605 19.1302 16.1278C19.2961 15.9896 19.4288 15.8347 19.5283 15.6633C19.6278 15.4919 19.6776 15.3149 19.6776 15.1324V13.8634L18.8067 13.8799C18.403 13.8855 18.027 13.9352 17.6786 14.0292C17.3302 14.1177 17.0482 14.2643 16.8326 14.4689C16.6224 14.6735 16.5174 14.95 16.5174 15.2983C16.5174 15.6965 16.6556 16.0089 16.9321 16.2356C17.2086 16.4568 17.5431 16.5674 17.9357 16.5674Z"
                        fill={
                          activeFont === "Nunito Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                      <path
                        d="M2 17.9941L6.29663 6H8.85139L13.1397 17.9941H10.726L9.74721 15.2154H5.43399L4.43033 17.9941H2ZM5.97314 13.1002H9.16658L7.5823 8.33909L5.97314 13.1002Z"
                        fill={
                          activeFont === "Nunito Sans"
                            ? color
                            : "rgb(145, 158, 171)"
                        }
                      />
                    </svg>
                  </span>
                  Nunito Sans
                </button>
              </div>
            </div>
          </div>
        </div>
        <div title="Close">
          <button
            onClick={() => setOpen(false)}
            className={`absolute cursor-pointer ${mode === "light" ? "text-gray-500" : "text-gray-300"
              } top-4 right-6 text-3xl font-thin`}
          >
            ×
          </button>
        </div>
        <div title="Reset Defaults">
          <button
            onClick={() => dispatch(resetDefaults())}
            className={`absolute cursor-pointer ${mode === "light" ? "text-gray-500" : "text-gray-400"
              } top-7 right-16 text-3xl font-normal`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-65"
              width={17}
              height={17}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2v2a8 8 0 1 1-5.135 1.865L9 8V2H3l2.446 2.447A9.98 9.98 0 0 0 2 12"
                strokeWidth={0.2}
                stroke="currentColor"
              ></path>
            </svg>
          </button>
        </div>
        <div title="Full Screen">
          <button
            onClick={() => {
              handleFullScreen();
            }}
            className={`absolute cursor-pointer top-6.5 right-26 text-3xl font-normal`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              color={
                isFullscreen ? color : mode === "light" ? "#6a7282 " : "#99a1af"
              }
              viewBox="0 0 24 24"
              style={{
                width: "20px",
                flexShrink: 0,
                height: "20px",
                display: "flex",
                boxSizing: "border-box",
              }}
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176m3.39 2.324a.75.75 0 0 1 .745.757c-.008.85-.034 1.576-.152 2.179c-.122.623-.352 1.166-.798 1.612s-.99.676-1.612.798c-.603.118-1.329.144-2.18.152a.75.75 0 1 1-.012-1.5c.856-.008 1.453-.036 1.903-.124c.429-.084.666-.212.84-.386c.175-.175.303-.412.387-.84c.088-.45.116-1.048.124-1.904a.75.75 0 0 1 .756-.744m3.99 0a.75.75 0 0 1 .757.744c.007.856.036 1.453.124 1.903c.084.429.212.666.386.84c.174.175.412.303.84.387c.45.088 1.048.116 1.904.124a.75.75 0 0 1-.013 1.5c-.85-.008-1.577-.034-2.179-.152c-.623-.122-1.167-.352-1.613-.798s-.675-.99-.797-1.612c-.118-.603-.145-1.329-.152-2.18a.75.75 0 0 1 .744-.756M5.25 13.994a.75.75 0 0 1 .757-.744c.85.007 1.576.034 2.179.152c.623.122 1.166.351 1.612.797s.676.99.798 1.613c.118.602.144 1.328.152 2.179a.75.75 0 0 1-1.5.013c-.008-.856-.036-1.454-.124-1.904c-.084-.428-.212-.666-.386-.84s-.412-.302-.84-.386c-.45-.088-1.048-.117-1.904-.124a.75.75 0 0 1-.744-.756m13.497 0a.75.75 0 0 1-.743.756c-.856.007-1.454.036-1.904.124c-.428.084-.666.212-.84.386s-.302.412-.386.84c-.088.45-.117 1.048-.124 1.904a.75.75 0 0 1-1.5-.013c.007-.85.034-1.577.152-2.179c.122-.623.351-1.167.797-1.613s.99-.675 1.613-.797c.602-.118 1.328-.145 2.179-.152a.75.75 0 0 1 .756.744"
                clipRule="evenodd"
                style={{ boxSizing: "border-box" }}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
