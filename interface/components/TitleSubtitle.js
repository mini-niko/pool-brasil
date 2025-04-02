import Box from "./Box";

function TitleSubtitle({ title, subtitle }) {
  return (
    <Box
      flex={true}
      direction="col"
      items="center"
      gap={2}
      className="w-64 text-center"
    >
      <h1 className="font-bold text-3xl md:text-2xl">{title}</h1>
      <p>{subtitle}</p>
    </Box>
  );
}

export default TitleSubtitle;
