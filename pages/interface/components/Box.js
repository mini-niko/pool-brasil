import classNames from "classnames";

const colors = {
  dark: "bg-pool-dark shadow-pool-dark/25",
  light: "bg-pool-light shadow-pool-dark/25",
  white: "bg-pool-white shadow-pool-dark/25",
};

function Box({
  children,
  className = "",
  flex,
  direction = "row",
  items = "start",
  justify = "start",
  gap = 0,
  box,
  color,
}) {
  const boxStyle = box ? "rounded-2xl shadow-2xl" : "";

  const boxColor = color ? colors[color] : "";

  const flexStyle = flex
    ? classNames({
        flex: true,
        [`items-${items}`]: true,
        [`justify-${justify}`]: true,
        [`flex-${direction}`]: true,
        [`gap-${gap}`]: true,
      })
    : "";

  const finalClassName = classNames(boxStyle, boxColor, flexStyle, className);

  return <div className={finalClassName}>{children}</div>;
}

export default Box;
