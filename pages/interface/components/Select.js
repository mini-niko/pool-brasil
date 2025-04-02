import Box from "./Box";

function Select({ children, name, label, value, setValue, placeholder }) {
  return (
    <Box id={`${name}-field-box`} flex={true} direction="col" gap={1}>
      <label
        htmlFor={name}
        className="font-bold text-pool-dark text-xl md:text-lg"
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
      >
        <option key="" value="">
          {placeholder}
        </option>
        {children}
      </select>
    </Box>
  );
}

export default Select;
