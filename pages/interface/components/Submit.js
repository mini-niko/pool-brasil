import Box from "./Box";

function Submit({ onClick, label }) {
  console.log(onClick);

  return (
    <Box box={true} flex={true} color={"dark"} className="rounded-md">
      <button
        className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-white"
        type={onClick ? "button" : "submit"}
        onClick={onClick}
      >
        {label}
      </button>
    </Box>
  );
}

export default Submit;
