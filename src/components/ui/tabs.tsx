import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within <Tabs />');
  return context;
};

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <div
    role="tablist"
    className={`flex gap-2 p-1 bg-gray-100 rounded-xl ${className}`}
  >
    {children}
  </div>
);

export const TabsTrigger: React.FC<{ value: string; children: ReactNode; className?: string }> = ({
  value,
  children,
  className = ""
}) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg 
        ${isActive
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: ReactNode }> = ({ value, children }) => {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className="mt-4 animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      {children}
    </div>
  );
};