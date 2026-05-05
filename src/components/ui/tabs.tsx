import React, { useState, createContext, useContext, ReactNode, useMemo, forwardRef } from 'react';

// 1. Context and Custom Hook
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs sub-components must be rendered within a <Tabs /> provider.');
  }
  return context;
};

// 2. Main Tabs Provider
interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, children, className }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    // Memoize value to prevent unnecessary re-renders of all triggers/content
    const contextValue = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={className}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

// 3. Tabs List (Container for Triggers)
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className = "" }, ref) => (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={`inline-flex items-center justify-center p-1 bg-gray-100 rounded-xl ${className}`}
    >
      {children}
    </div>
  )
);
TabsList.displayName = "TabsList";

// 4. Tabs Trigger (The Buttons)
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className = "" }, ref) => {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(value)}
        className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
          ${isActive 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          } ${className}`}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

// 5. Tabs Content (The Panels)
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, className = "" }, ref) => {
    const { activeTab } = useTabs();

    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={`mt-4 animate-in fade-in zoom-in-95 duration-300 focus-visible:outline-none ${className}`}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";