import Link from "next/link";

const Breadcrumbs = ({ pages }) => {
  return (
    <nav className="mb-4 text-sm">
      <ol className="flex space-x-2">
        {pages.map((page, index) => (
          <li key={index} className="flex items-center">
            {index < pages.length - 1 ? (
              <Link href={page.path} className="text-yellow-600 hover:underline">
                {page.name}
              </Link>
            ) : (
              <span className="text-gray-500">{page.name}</span>
            )}
            {index < pages.length - 1 && <span className="mx-2 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
