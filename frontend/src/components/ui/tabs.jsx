export const Tabs = ({ children }) => <div>{children}</div>;

export const TabsList = ({ children, className = "" }) => (
  <div className={`flex space-x-2 mb-4 ${className}`}>{children}</div>
);

export const TabsTrigger = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    } transition`}
  >
    {label}
  </button>
);

export const TabsContent = ({ children, isActive }) => {
  return isActive ? <div>{children}</div> : null;
};
