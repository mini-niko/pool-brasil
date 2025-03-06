import classNames from "classnames";
import Box from "./Box";

function Input({
  children,
  label,
  name,
  type = name,
  value,
  setValue,
  placeholder = "",
  className = "",
}) {
  return (
    <Box id={`${name}-field-box`} flex={true} direction="col" gap={1}>
      <label
        htmlFor={name}
        className="font-bold text-pool-dark text-xl md:text-lg"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        className={`focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {children}
    </Box>
  );
}

export default Input;
