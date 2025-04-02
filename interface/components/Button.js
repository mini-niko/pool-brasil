import Box from "./Box";

function Button({ children, color, onClick }) {
  return (
    <Box box={true} flex={true} color={color} className="rounded-md mb-4">
      <button
        onClick={onClick}
        className="py-4 px-8 md:py-3 md:px-6 text-lg md:text-sm text-pool-white"
        type="submit"
      >
        {children}
      </button>
    </Box>
  );
}

export default Button;
