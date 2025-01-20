import { useState } from "react";

export default ({ field, title, password, setPassword }) => {
  const [seePassword, setSeePassword] = useState("password");

  return (
    <div className="flex flex-col items-start justify-start">
      <label className="text-sm" htmlFor={field}>
        {title}
      </label>
      <input
        className="text-sm w-56 p-1 rounded-md"
        type={seePassword}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id={field}
        name={field}
      />
      <button
        type="button"
        className="text-sm self-end"
        onClick={() =>
          seePassword === "password"
            ? setSeePassword("text")
            : setSeePassword("password")
        }
      >
        Ver senha
      </button>
    </div>
  );
};
