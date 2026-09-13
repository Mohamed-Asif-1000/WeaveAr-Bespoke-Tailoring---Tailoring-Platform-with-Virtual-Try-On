import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="bg-[#FAF9F6] min-h-screen flex items-center justify-center text-gray-900">
      <div className="text-center px-6">
        <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
          Error 404
        </p>
        <h1 className="text-6xl md:text-8xl font-serif mb-8">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-12 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#D4AF37] text-white px-10 py-4 text-sm tracking-widest uppercase hover:opacity-90 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}