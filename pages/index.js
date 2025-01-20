function index() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-5xl font-bold">Pool Brasil</h1>
      <nav className="text-xl">
        <a className="mr-4" href="/login">
          Login
        </a>
        <a href="/register">Registro</a>
      </nav>
    </div>
  );
}

export default index;
