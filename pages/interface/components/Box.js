const colors = {
  light: "bg-pool-light shadow-pool-light/25",
  white: "bg-pool-white shadow-pool-light/25",
};

function Box({
  children,
  className,
  flex,
  direction = "row",
  items = "start",
  justify = "start",
  gap = 0,
  box,
  color,
}) {
  const boxStyle = box ? "rounded-2xl shadow-2xl w-fit h-fit" : "";

  const boxColor = color ? colors[color] : "";

  const flexStyle = flex
    ? `flex flex-${direction} items-${items} justify-${justify} gap-${gap}`
    : "";

  console.log(flexStyle);

  return (
    <div className={`${boxStyle} ${boxColor} ${flexStyle} ${className}`}>
      {children}
    </div>
  );
}

export default Box;
