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
import logo from "./../../public/assets/munoz-logo-alt.png";

function Footer() {
  // Datos de contacto (fáciles de modificar)
  const contactInfo = {
    address: "43000, La Lomita, Huejutla de Reyes, Hgo.",
    phone: "789 896 1084",
    email: "munozautopartes@gmail.com",
    hours: "Lunes a Viernes: 8:00 A.M. - 6:30 P.M.",
    hours_weekend: "Sábado a Domingo: 8:00 A.M. - 5:00 P.M."
  };

  return (
    <footer className="text-white bg-green-800">
      {/* Sección superior */}
      <div className="container px-3 py-10 mx-auto">
        {/* Logo y contacto */}
        <div className="flex flex-col items-center justify-between gap-8 mb-12 md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <Image 
              src={logo} 
              alt="Muñoz Logo" 
                unoptimized 
              width={250} 
              height={250}
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
              <div className="flex items-center gap-3">
                <FaClock className="text-green-300" />
                <span>{contactInfo.hours_weekend}</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:w-auto">
            <div>
              <h3 className="pb-2 mb-6 text-xl font-bold border-b border-green-300/30">ENCUENTRA</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/ubicacion" className="flex items-center gap-2 transition-colors hover:text-green-300">
                    <FaMapMarkerAlt /> Ubicación
                  </Link>
                </li>
                <li>
                  <Link href="/marcas" className="flex items-center gap-2 transition-colors hover:text-green-300">
                    <FaBriefcase /> Busca por Marca
                  </Link>
                </li>

              </ul>
            </div>

            <div>
              <h3 className="pb-2 mb-6 text-xl font-bold border-b border-green-300/30">INFORMACIÓN</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/nosotros" className="transition-colors hover:text-green-300">
                    Acerca de Muñoz AutoPartes
                  </Link>
                </li>
                <li>
                  <Link href="/politicas" className="transition-colors hover:text-green-300">
                    Políticas de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-green-300">
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="pb-2 mb-6 text-xl font-bold border-b border-green-300/30">SERVICIO AL CLIENTE</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/facturacion" className="transition-colors hover:text-green-300">
                    Facturación Electrónica
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="transition-colors hover:text-green-300">
                    Contáctanos
                  </Link>
                </li>
                <li>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-center gap-6">
          <h4 className="text-lg font-medium">Síguenos en redes sociales</h4>
          <div className="flex gap-6">
            <a href="#" className="p-3 transition-colors duration-300 rounded-full group bg-white/10 hover:bg-yellow-500/70">
              <FaFacebook className="text-xl text-white transition-colors duration-300 group-hover:text-gray-900" />
            </a>
            <a href="#" className="p-3 transition-colors duration-300 rounded-full group bg-white/10 hover:bg-yellow-500/70">
              <FaTwitter className="text-xl text-white transition-colors duration-300 group-hover:text-gray-900" />
            </a>
            <a href="#" className="p-3 transition-colors duration-300 rounded-full group bg-white/10 hover:bg-yellow-500/70">
              <FaInstagram className="text-xl text-white transition-colors duration-300 group-hover:text-gray-900" />
            </a>
            <a href="#" className="p-3 transition-colors duration-300 rounded-full group bg-white/10 hover:bg-yellow-500/70">
              <FaYoutube className="text-xl text-white transition-colors duration-300 group-hover:text-gray-900" />
            </a>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="bg-[#004d33] py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p>© {new Date().getFullYear()} Muñoz AutoPartes. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="/politicas" className="transition-colors hover:text-green-300">
                Políticas
              </Link>
              <Link href="/terms" className="transition-colors hover:text-green-300">
                Términos
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-green-300">
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