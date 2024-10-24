import Image from 'next/image';

function HomePage() {
  // Lista de productos para llenar las cartas
  const productos = [
    {
      id: 1,
      nombre: 'Batería para auto',
      descripcion: 'Batería de alto rendimiento para cualquier tipo de vehículo.',
      precio: '$1,200 MXN',
      imagen: '', 
    },
    {
      id: 2,
      nombre: 'Aceite para motor',
      descripcion: 'Aceite sintético premium para mayor durabilidad del motor.',
      precio: '$500 MXN',
      imagen: '',
    },
    {
      id: 3,
      nombre: 'Filtro de aire',
      descripcion: 'Filtro de aire para mejorar la eficiencia del combustible.',
      precio: '$300 MXN',
      imagen: '',
    },
    {
      id: 4,
      nombre: 'Bujías',
      descripcion: 'Juego de 4 bujías de encendido de alto rendimiento.',
      precio: '$450 MXN',
      imagen: '',
    },
    {
      id: 5,
      nombre: 'Pastillas de freno',
      descripcion: 'Pastillas de freno resistentes para mayor seguridad.',
      precio: '$750 MXN',
      imagen: '',
    },
  ];

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-4">{producto.descripcion}</p>
              <p className="text-lg font-bold mb-4">{producto.precio}</p>
              <button className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
