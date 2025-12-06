import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext();

export const Tabs = ({ defaultValue, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 p-1 text-slate-400",
      className
    )}
  >
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, handleTabChange } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => handleTabChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-slate-950 text-white shadow-sm"
          : "hover:bg-slate-800 hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== value) return null;
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animation-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
};
