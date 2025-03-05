import Image from "next/image";
import Box from "./Box";
import Submit from "./Submit";

function Form({
  children,
  title,
  fields,
  onSubmit,
  onBack,
  buttonLabel,
  onClick,
}) {
  return (
    <Box
      box={true}
      flex={true}
      direction="col"
      items="center"
      justify="center"
      gap={4}
      color={"white"}
      className="w-fit px-8 py-24 md:px-12 gap-4 z-20 flex-1 justify-center relative"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="place-self-start mb-4 md:text-sm text-pool-dark"
        >
          <Image
            height={500}
            width={500}
            className="h-6 w-6"
            src="/icons/arrow-left.svg"
            alt=""
          />
        </button>
      )}
      {title}
      <form className="flex flex-col items-center gap-8" onSubmit={onSubmit}>
        <Box
          id="fields-box"
          flex={true}
          direction="col"
          items="start"
          justify="center"
          gap={8}
          className="gap-4"
        >
          {fields}
        </Box>
        <Submit label={buttonLabel} onClick={onClick} />
      </form>
      {children}
    </Box>
  );
}

export default Form;
