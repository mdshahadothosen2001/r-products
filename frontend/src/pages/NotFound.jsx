import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/" className="text-blue-600 underline">Go back home</Link>
    </div>
  );
}
