import { createContext, useContext, useEffect, useRef, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("app-theme") || "default"
  );
  const userModuleRef = useRef(null);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const userModule = userModuleRef.current;

    if (userModule) {
      userModule.classList.remove("default", "dark", "green", "brick", "olive");
      userModule.classList.add(theme);

      if (windowWidth <= 1024) {
        userModule.classList.add("left-side-collapsed");
      } else {
        userModule.classList.remove("left-side-collapsed");
      }
    }

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={"user-module body background-main " + theme}
        id="text-spacing"
        ref={userModuleRef}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
