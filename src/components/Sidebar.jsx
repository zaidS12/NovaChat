import React, { useState } from 'react';
import { Panel } from 'react-resizable-panels';
import { Plus, X } from 'lucide-react';

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <Panel
      defaultSize={20}
      minSize={10}
      maxSize={20}
      className={`flex flex-col h-full bg-gray-200 dark:bg-gray-800 p-4 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-[70px]' : 'w-[240px]'}`}
    >
      <div className="flex items-center justify-between mb-4">
        {!sidebarCollapsed && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sidebar</h2>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sidebarCollapsed ? <Plus size={20} /> : <X size={20} />}
        </button>
      </div>
      {/* Placeholder for Sidebar content */}
      {!sidebarCollapsed && (
        <div className="flex-grow">
          <p className="text-gray-700 dark:text-gray-300">This is the sidebar content.</p>
        </div>
      )}
    </Panel>
  );
};

export default Sidebar;