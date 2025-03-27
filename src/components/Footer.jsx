import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaBriefcase,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaClock
} from "react-icons/fa";
import Image from "next/image";
import logo from "./../../public/assets/munoz-logo.png";

function Footer() {
  // Datos de contacto (fáciles de modificar)
  const contactInfo = {
    address: "Av. Principal #123, Ciudad, País",
    phone: "+1 234 567 890",
    email: "contacto@munozautoparts.com",
    hours: "Lunes a Viernes: 8:00 AM - 6:00 PM"
  };

  return (
    <footer className="bg-green-800 text-white">
      {/* Sección superior */}
      <div className="container mx-auto px-4 py-12">
        {/* Logo y contacto */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Image 
              src={logo} 
              alt="Muñoz Logo" 
              width={150} 
              height={150}
              className="mb-4"
            />
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-300" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-300" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-300" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-green-300" />
                <span>{contactInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full md:w-auto">
            <div>
              <h3 className="font-bold text-xl mb-6 pb-2 border-b border-green-300/30">ENCUENTRA</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/ubicacion" className="hover:text-green-300 transition-colors flex items-center gap-2">
                    <FaMapMarkerAlt /> Ubicación
                  </Link>
                </li>
                <li>
                  <Link href="/marca" className="hover:text-green-300 transition-colors flex items-center gap-2">
                    <FaBriefcase /> Busca por Marca
                  </Link>
                </li>
                <li>
                  <Link href="/modelo" className="hover:text-green-300 transition-colors flex items-center gap-2">
                    <FaBoxOpen /> Busca por Modelo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 pb-2 border-b border-green-300/30">INFORMACIÓN</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/nosotros" className="hover:text-green-300 transition-colors">
                    Acerca de Muñoz AutoPartes
                  </Link>
                </li>
                <li>
                  <Link href="/politicas" className="hover:text-green-300 transition-colors">
                    Políticas de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-green-300 transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 pb-2 border-b border-green-300/30">SERVICIO AL CLIENTE</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/facturacion" className="hover:text-green-300 transition-colors">
                    Facturación Electrónica
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-green-300 transition-colors">
                    Contáctanos
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-green-300 transition-colors">
                    Preguntas frecuentes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-center gap-6">
          <h4 className="text-lg font-medium">Síguenos en redes sociales</h4>
          <div className="flex gap-6">
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="bg-[#004d33] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} Muñoz AutoPartes. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="/politicas" className="hover:text-green-300 transition-colors">
                Políticas
              </Link>
              <Link href="/terms" className="hover:text-green-300 transition-colors">
                Términos
              </Link>
              <Link href="/cookies" className="hover:text-green-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;