"use client";
import { useState } from "react";
import {
  resetDefaults,
  setFont,
  setColor,
  setBgColor,
  setNavColor,
  handleNavDirection,
  setDarkColor,
} from "../../store/themeSlice";
import { useDispatch, useSelector } from "react-redux";

const themes = [
  { name: "#00a76f", textColor: "#00a76f", bgColor: "#00a76f14", Dark: "#007867" },
  { name: "Blue", textColor: "#407BFF", bgColor: "#407BFF14", Dark: "#063ba7" },
  { name: "Orange", textColor: "#ffab00", bgColor: "#ffab0014", Dark: "#b66816" },
  { name: "#7635dc", textColor: "#7635dc", bgColor: "#7635dc14", Dark: "#431a9e" },
  { name: "Red", textColor: "#ff3030", bgColor: "#ff563014", Dark: "#b71833" },
  { name: "#04b4f1", textColor: "#04b4f1", bgColor: "#04b4f114", Dark: "#0351ab" },
  { name: "#6950e8", textColor: "#6950e8", bgColor: "#6950e814", Dark: "#3d2aa5" },
];

export default function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dispatch = useDispatch();
  const { activeFont, color, activeNavColor, activeNavStyle, mode } =
    useSelector((state: any) => state.theme);

  function handleThemeChange(theme: any) {
    dispatch(setColor(theme.textColor));
    dispatch(setDarkColor(theme.Dark));
    dispatch(setBgColor(theme.bgColor));
  }

  function handleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.body.requestFullscreen();
      setIsFullscreen(true);
    }
  }

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`md:p-2 p-1 cursor-pointer rounded-xl md:shadow-lg ${
          mode === "light"
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
        }`}
      >
        <svg
          className={`md:w-5.5 md:h-5.5 w-4.5 h-4.5 transition-transform duration-[1500ms] ease-in-out ${
            !open ? "animate-[spin_5s_linear_infinite]" : "rotate-0"
          } ${mode === "light" ? "fill-gray-500" : "fill-gray-300"}`}
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
        className={`fixed z-[100] top-0 right-0 h-full w-[360px] shadow-lg p-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${
          mode === "light"
            ? "bg-gray-100 border-l border-gray-200"
            : "bg-gradient-to-tr from-[#151b23] via-[#151b23] to-[#162932] border-l border-gray-700"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${mode === "light" ? "text-gray-900" : "text-gray-100"}`}>
          Settings
        </h2>
        <div className="h-[92dvh] scroll-hide overflow-scroll">
          
          <div className="my-6 grid grid-cols-3 relative gap-3 p-3.5 pt-10 pb-5 rounded-xl border border-gray-200">
            <h3 className={`text-xs flex items-center gap-1 -top-3 left-2.5 absolute font-semibold p-1 px-2 max-w-max rounded-xl mb-2 ${mode === "light" ? "text-white bg-gray-900" : "text-gray-100 bg-gray-700"}`}>
              {color !== "#00a76f" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(setColor("#00a76f"));
                    dispatch(setDarkColor("#007867"));
                    dispatch(setBgColor("#00a76f14"));
                  }}
                  style={{ width: "14px", height: "14px", flexShrink: 0, display: "flex", boxSizing: "border-box" }}
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
                style={{ backgroundColor: color === theme.textColor ? theme.bgColor : "" }}
                className={`w-22 h-16 flex cursor-pointer justify-center items-center rounded-lg transition-transform transform hover:scale-110 ${
                  color === theme.textColor && "shadow-xs"
                }`}
              >
                <div style={{ backgroundColor: theme.textColor, width: "24px", height: "24px", borderRadius: "50%" }} />
              </button>
            ))}
          </div>

          <div className="my-6 border border-gray-200 rounded-xl p-4">
             <div className="font-bold mb-3">Fonts</div>
             <button onClick={() => dispatch(setFont("Public Sans"))} className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">Public Sans</button>
             <button onClick={() => dispatch(setFont("Inter"))} className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">Inter</button>
             <button onClick={() => dispatch(setFont("DM Sans"))} className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">DM Sans</button>
             <button onClick={() => dispatch(setFont("Nunito Sans"))} className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">Nunito Sans</button>
          </div>
          
        </div>

        <button
          title="Close"
          onClick={() => setOpen(false)}
          className={`absolute cursor-pointer ${mode === "light" ? "text-gray-500" : "text-gray-300"} top-4 right-6 text-3xl font-thin`}
        >
          ×
        </button>
        <button
          title="Reset Defaults"
          onClick={() => dispatch(resetDefaults())}
          className={`absolute cursor-pointer ${mode === "light" ? "text-gray-500" : "text-gray-400"} top-7 right-16 text-3xl font-normal`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24">
            <path fill="currentColor" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2v2a8 8 0 1 1-5.135 1.865L9 8V2H3l2.446 2.447A9.98 9.98 0 0 0 2 12" strokeWidth={0.2} stroke="currentColor" />
          </svg>
        </button>
        <button
          title="Full Screen"
          onClick={() => handleFullScreen()}
          className={`absolute cursor-pointer top-6 right-26 text-3xl font-normal`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill={isFullscreen ? color : "currentColor"}>
            <path fillRule="evenodd" d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176m3.39 2.324a.75.75 0 0 1 .745.757c-.008.85-.034 1.576-.152 2.179c-.122.623-.352 1.166-.798 1.612s-.99.676-1.612.798c-.603.118-1.329.144-2.18.152a.75.75 0 1 1-.012-1.5c.856-.008 1.453-.036 1.903-.124c.429-.084.666-.212.84-.386c.175-.175.303-.412.387-.84c.088-.45.116-1.048.124-1.904a.75.75 0 0 1 .756-.744m3.99 0a.75.75 0 0 1 .757.744c.007.856.036 1.453.124 1.903c.084.429.212.666.386.84c.174.175.412.303.84.387c.45.088 1.048.116 1.904.124a.75.75 0 0 1-.013 1.5c-.85-.008-1.577-.034-2.179-.152c-.623-.122-1.167-.352-1.613-.798s-.675-.99-.797-1.612c-.118-.603-.145-1.329-.152-2.18a.75.75 0 0 1 .744-.756M5.25 13.994a.75.75 0 0 1 .757-.744c.85.007 1.576.034 2.179.152c.623.122 1.166.351 1.612.797s.676.99.798 1.613c.118.602.144 1.328.152 2.179a.75.75 0 0 1-1.5.013c-.008-.856-.036-1.454-.124-1.904c-.084-.428-.212-.666-.386-.84s-.412-.302-.84-.386c-.45-.088-1.048-.117-1.904-.124a.75.75 0 0 1-.744-.756m13.497 0a.75.75 0 0 1-.743.756c-.856.007-1.454.036-1.904.124c-.428.084-.666.212-.84.386s-.302.412-.386.84c-.088.45-.117 1.048-.124 1.904a.75.75 0 0 1-1.5-.013c.007-.85.034-1.577.152-2.179c.122-.623.351-1.167.797-1.613s.99-.675 1.613-.797c.602-.118 1.328-.145 2.179-.152a.75.75 0 0 1 .756.744" />
          </svg>
        </button>
      </div>
    </div>
  );
}
