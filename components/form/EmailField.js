export default ({ email, setEmail }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm" htmlFor="email">
        Email
      </label>
      <input
        className="text-sm w-56 p-1 rounded-md"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        id="email"
        name="email"
      />
    </div>
  );
};
