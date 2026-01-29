import { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className={dark ? "dark bg-gray-900 text-white" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
