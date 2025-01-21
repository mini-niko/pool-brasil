function DateField({ field, title, date, setDate }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm" htmlFor={field}>
        {title}
      </label>
      <input
        className="text-sm p-1 rounded-md"
        type="date"
        value={date}
        onChange={setDate}
        id={field}
        name={field}
      />
    </div>
  );
}

export default DateField;
