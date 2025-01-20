export default ({ field, title, text, setText }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm" htmlFor={field}>
        {title}
      </label>
      <input
        className="text-sm w-56 p-1 rounded-md"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        id={field}
        name={field}
      />
    </div>
  );
};
