function NumberField({ field, title, number, setNumber }) {
  return (
    <div className="flex flex-col items-start justify-start">
      <label className="text-sm" htmlFor={field}>
        {title}
      </label>
      <input
        className="text-sm w-24 p-1 rounded-md"
        type="number"
        value={number}
        onChange={setNumber}
        id={field}
        name={field}
      />
    </div>
  );
}

export default NumberField;
