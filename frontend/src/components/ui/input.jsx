export const Input = ({ value, onChange, placeholder, className = "" }) => {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded p-2 w-full ${className}`}
      />
    );
  };
  