"use client";

import { useAuth } from "../../context/authContext";

export default function TermsAndDeslindePage() {
  const { theme } = useAuth();

  // Datos fijos OFFLINE
  const terms = {
    title: "Términos y Condiciones 2025",
    effectiveDate: "2025-12-30",
    createdAt: "2025-07-07",
    content: `
Bienvenido a nuestro sitio web. Al acceder y usar este sitio, aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente, ya que regulan el uso de nuestros servicios, productos, y la interacción con nuestro sitio.

1. Aceptación de los Términos
Al navegar en nuestro sitio y realizar compras, aceptas cumplir con estos términos y condiciones, así como con las políticas adicionales mencionadas en el sitio. Si no estás de acuerdo, te solicitamos no utilizar el sitio.

2. Registro y Cuenta del Usuario
Para realizar compras, es necesario crear una cuenta en el sitio. Al registrarte, garantizas que la información proporcionada es precisa, actual y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, así como de todas las actividades que ocurran bajo tu cuenta.

3. Uso Permitido del Sitio
Este sitio está destinado únicamente para fines personales y comerciales lícitos. Te comprometes a no usar el sitio para:
- Realizar actividades ilegales o no autorizadas
- Vulnerar derechos de propiedad intelectual
- Distribuir virus informáticos o software dañino.

4. Productos y Precios
Hacemos nuestro mejor esfuerzo para que la información de los productos sea precisa y actual. Sin embargo, no garantizamos la disponibilidad ni exactitud total de la información en cuanto a precios, descripciones o imágenes. Los precios están sujetos a cambio sin previo aviso y se aplicarán los vigentes al momento de la compra.

5. Política de Compra y Envío
- Compras: Al realizar una compra, aceptas las condiciones de venta y confirmas que la información proporcionada es correcta.
- Envíos: Procesamos y enviamos pedidos en los tiempos especificados, aunque pueden presentarse retrasos por causas ajenas a nuestra voluntad. Los costos de envío se calcularán al momento de la compra y dependerán de la ubicación del cliente.
- Devoluciones: Revisa nuestra política de devoluciones para conocer los casos en los que aplican devoluciones o cambios de productos.

6. Limitación de Responsabilidad
En ningún caso Muñoz Autopartes será responsable de daños directos, indirectos, incidentales o consecuentes derivados del uso del sitio, de sus productos o de la imposibilidad de acceder a ellos, salvo en los casos especificados por la ley aplicable.

7. Propiedad Intelectual
Todo el contenido de este sitio, incluidos textos, gráficos, logotipos, imágenes y software, es propiedad de [Nombre de la Empresa] o de sus proveedores, y está protegido por leyes de propiedad intelectual. Queda prohibido el uso no autorizado del contenido sin el consentimiento previo por escrito.

8. Privacidad
La protección de tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal.

9. Modificaciones de los Términos y Condiciones
Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento. Notificaremos sobre cambios relevantes en esta página y recomendamos revisarla periódicamente. Tu uso continuo del sitio después de cualquier cambio constituye la aceptación de los nuevos términos.

10. Legislación Aplicable
Estos términos y condiciones están regidos por las leyes de [País/Estado], y cualquier disputa que surja en relación con ellos será resuelta en los tribunales correspondientes.

11. Contacto
Para cualquier duda o aclaración sobre estos términos y condiciones, puedes contactarnos en el correo electrónico oficial.
`
  };

  const deslinde = {
    title: "Deslinde Legal Web – Muñoz Autopartes 2025",
    effectiveDate: "2025-12-30",
    createdAt: "2025-07-07",
    content: `
Limitación de Responsabilidad
En ningún caso Muñoz Autopartes será responsable de daños directos, indirectos, incidentales o consecuentes derivados del uso del sitio, de sus productos o de la imposibilidad de acceder a ellos, salvo en los casos especificados por la ley aplicable.

Propiedad Intelectual
Todo el contenido de este sitio, incluidos textos, gráficos, logotipos, imágenes y software, es propiedad de [Nombre de la Empresa] o de sus proveedores, y está protegido por leyes de propiedad intelectual. Queda prohibido el uso no autorizado del contenido sin el consentimiento previo por escrito.

Privacidad
La protección de tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal.

Modificaciones de los Términos y Condiciones
Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento. Notificaremos sobre cambios relevantes en esta página y recomendamos revisarla periódicamente. Tu uso continuo del sitio después de cualquier cambio constituye la aceptación de los nuevos términos.

Legislación Aplicable
Estos términos y condiciones están regidos por las leyes de [País/Estado], y cualquier disputa que surja en relación con ellos será resuelta en los tribunales correspondientes.
`
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-7xl rounded-lg shadow-lg mt-16 mb-16 ${
          theme === "dark"
            ? "bg-gray-700 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >

        {/* Términos */}
        <div className="w-full p-8 rounded-lg shadow-lg mb-16">
          <h1 className="mb-6 text-3xl font-bold text-center">{terms.title}</h1>

          <p className="mb-4 text-sm text-center">
            <span className="font-semibold">Vigencia:</span>{" "}
            {new Date(terms.effectiveDate).toLocaleDateString()}
          </p>

          <hr className="mb-6 border-gray-300" />

          <div className="leading-relaxed whitespace-pre-line text-justify">
            {terms.content}
          </div>

          <p className="mt-8 text-xs text-center">
            <span className="font-semibold">Creado el:</span>{" "}
            {new Date(terms.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Deslinde */}
        <div className="w-full p-8 rounded-lg shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-center">
            {deslinde.title}
          </h1>

          <p className="mb-4 text-sm text-center">
            <span className="font-semibold">Vigencia:</span>{" "}
            {new Date(deslinde.effectiveDate).toLocaleDateString()}
          </p>

          <hr className="mb-6 border-gray-300" />

          <div className="leading-relaxed whitespace-pre-line text-justify">
            {deslinde.content}
          </div>

          <p className="mt-8 text-xs text-center">
            <span className="font-semibold">Creado el:</span>{" "}
            {new Date(deslinde.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
