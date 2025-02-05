import Link from "next/link";

const Breadcrumbs = ({ currentPage }) => {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex space-x-2">
        <li className="flex items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li>
          <span className="text-gray-500">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;