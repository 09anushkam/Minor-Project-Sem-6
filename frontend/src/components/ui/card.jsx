export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children }) => <div>{children}</div>;
  