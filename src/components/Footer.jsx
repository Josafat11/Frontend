import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaBriefcase,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa"; // Importamos los íconos
import Image from "next/image";
import logo from "./../../public/assets/munoz-logo.png";

function Footer() {
  return (
    <footer className="bg-pakistanGreen text-white py-8">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 py-4">
          <Image src={logo} alt="Muñoz Logo" width={120} height={120} />
        </div>
        {/* Iconos de redes sociales */}
        <div className="flex justify-center space-x-6 py-4">
          <FaFacebook className="w-6 h-6 cursor-pointer" />
          <FaTwitter className="w-6 h-6 cursor-pointer" />
          <FaInstagram className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Enlaces de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm py-8 text-center">
          <div>
            <h3 className="font-bold mb-4 text-lg">ENCUENTRA</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ubicacion">
                  <p className="hover:text-green-700 text-lg">Ubicacion</p>
                </Link>
              </li>
              <li>
                <Link href="/marca">
                  <p className="hover:text-green-700 text-lg">
                    Busca por Marca
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/modelo">
                  <p className="hover:text-green-700 text-lg">
                    Busca por Modelo
                  </p>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">INFORMACIÓN</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros">
                  <p className="hover:text-green-700 text-lg">
                    Acerca de Muñoz AutoPartes
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/politicas">
                  <p className="hover:text-green-700 text-lg">
                    Politicas de Privacidad
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <p className="hover:text-green-700 text-lg">
                    Terminos y Condiciones
                  </p>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">SERVICIO AL CLIENTE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/facturacion">
                  <p className="hover:text-green-700 text-lg">
                    Facturación Electrónica
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/contacto">
                  <p className="hover:text-green-700 text-lg">Contáctanos</p>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <p className="hover:text-green-700 text-lg">
                    Preguntas frecuentes
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
