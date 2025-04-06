export const Textarea = ({ value, onChange, placeholder, className = "" }) => {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded p-2 w-full h-32 resize-none ${className}`}
      />
    );
  };
  