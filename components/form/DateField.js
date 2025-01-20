export default ({ field, title, date, setDate }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm" htmlFor={field}>
        {title}
      </label>
      <input
        className="text-sm p-1 rounded-md"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        id={field}
        name={field}
      />
    </div>
  );
};
