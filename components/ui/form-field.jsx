import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function FormField({
  className = "",
  id,
  prefix = "",
  label,
  type = "text",
  placeholder,
  error,
  register,
  autoComplete = "off",
}) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input
        className={`${className}` + (error ? ` border-red-400` : "")}
        id={id}
        type={type}
        {...register((prefix && `${prefix}.`) + id)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </>
  );
}

export default FormField;
