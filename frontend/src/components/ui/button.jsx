export const Button = ({ children, onClick, className = "" }) => {
    return (
      <button
        onClick={onClick}
        className={`bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 ${className}`}
      >
        {children}
      </button>
    );
  };
  