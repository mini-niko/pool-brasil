import Link from "next/link";

function index() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-5xl font-bold">Pool Brasil</h1>
      <nav className="text-xl">
        <Link className="mr-4" href="/login">
          Login
        </Link>
        <Link href="/register">Registro</Link>
      </nav>
    </div>
  );
}

export default index;
