'use client';

import { Card } from '@/Components/Card';

interface TermsStepProps {
  accepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  error?: string;
}

export function TermsStep({ accepted, onAcceptChange, error }: TermsStepProps) {
  return (
    <Card title='Términos y Condiciones'>
      <div className='space-y-4'>
        <div className='max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'>
          <h3 className='font-bold text-gray-900 mb-3 text-base'>
            Términos y Condiciones – Plataforma Fixers
          </h3>

          <div className='space-y-4'>
            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>1. ACEPTACIÓN DE TÉRMINOS</h4>
              <p className='text-xs leading-relaxed'>
                Al acceder y utilizar la plataforma Fixers, usted acepta cumplir y estar sujeto a
                los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de
                estos términos, no podrá acceder ni utilizar el servicio.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>2. DESCRIPCIÓN DEL SERVICIO</h4>
              <p className='text-xs leading-relaxed mb-2'>
                Fixers es una plataforma digital que conecta trabajadores independientes (Fixers)
                con personas o empresas que requieren servicios específicos. A través del sistema,
                los usuarios pueden:
              </p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>Registrar su cuenta como Fixer (trabajador) o como cliente.</li>
                <li>Crear y publicar ofertas de trabajo.</li>
                <li>Ver listados de trabajos disponibles.</li>
                <li>Visualizar en el mapa las ofertas publicadas cercanas a su ubicación.</li>
              </ul>
              <p className='text-xs leading-relaxed mt-2'>
                Fixers actúa únicamente como intermediario tecnológico entre las partes, sin asumir
                responsabilidad directa por la ejecución de los trabajos ni la relación contractual
                entre usuario y fixer.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>3. USO DEL SERVICIO</h4>
              <p className='text-xs leading-relaxed mb-2'>
                Usted se compromete a utilizar el servicio de manera responsable y conforme a las
                leyes aplicables. Está prohibido utilizar Fixers para cualquier propósito ilegal,
                fraudulento o no autorizado.
              </p>
              <p className='text-xs leading-relaxed mb-1'>Como usuario, usted es responsable de:</p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>Mantener la confidencialidad de su cuenta y contraseña.</li>
                <li>
                  Verificar la veracidad de la información que publica (datos personales, ofertas o
                  servicios).
                </li>
                <li>No publicar contenido ofensivo, engañoso o que viole derechos de terceros.</li>
              </ul>
              <p className='text-xs leading-relaxed mt-2'>
                El incumplimiento de estas normas puede derivar en la suspensión o eliminación de la
                cuenta.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>4. REGISTRO DE FIXERS</h4>
              <p className='text-xs leading-relaxed'>
                Para registrarse como Fixer (trabajador), deberá proporcionar información veraz,
                completa y actualizada. El registro implica aceptar que su perfil y ubicación puedan
                mostrarse en el mapa o listados de trabajos con fines de conexión laboral. Fixers
                podrá verificar la información proporcionada, pero no garantiza la exactitud ni
                autenticidad de los datos de los usuarios registrados.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>
                5. PUBLICACIÓN Y GESTIÓN DE OFERTAS
              </h4>
              <p className='text-xs leading-relaxed'>
                Los fixers pueden crear y publicar ofertas de trabajo o servicios. Toda publicación
                debe cumplir con las políticas de la plataforma y no contener información falsa,
                discriminatoria o inapropiada. El sistema se reserva el derecho de eliminar
                cualquier oferta que incumpla estas normas o afecte la calidad del servicio.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>6. PRIVACIDAD Y DATOS PERSONALES</h4>
              <p className='text-xs leading-relaxed'>
                La recopilación y uso de la información personal se rige por nuestra Política de
                Privacidad. Al utilizar Fixers, usted consiente que procesemos sus datos con el fin
                de mejorar la experiencia del servicio, mostrar trabajos en el mapa y facilitar la
                comunicación entre usuarios. Nos comprometemos a proteger su información y a no
                compartirla con terceros sin su consentimiento, salvo en los casos legalmente
                permitidos.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>
                7. MODIFICAR DATOS DEL PERFIL (REQUESTER)
              </h4>
              <p className='text-xs leading-relaxed mb-2'>
                Esta funcionalidad permite al usuario con rol Requester modificar ciertos datos
                personales de su cuenta, específicamente:
              </p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>
                  <strong>Número de teléfono:</strong> utilizado como medio principal de contacto y
                  verificación.
                </li>
                <li>
                  <strong>Ubicación:</strong> información geográfica del usuario, obtenida de manera
                  manual o automática (GPS).
                </li>
              </ul>
              <p className='text-xs leading-relaxed mt-2 mb-1'>
                <strong>Validación y restricciones:</strong>
              </p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>
                  El sistema verifica que el número de teléfono no esté registrado por otro usuario.
                </li>
                <li>Solo puede actualizar 3 veces al mes (máximo) su ubicación.</li>
                <li>Solo puede actualizar 2 veces al mes su número (máximo) de teléfono.</li>
              </ul>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>8. TÉRMINOS DE PAGO</h4>
              <p className='text-xs leading-relaxed mb-2'>
                <strong>Métodos de Pago Aceptados:</strong>
              </p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>
                  <strong>Tarjeta de Crédito/Débito:</strong> Procesados a través de Stripe. No
                  almacenamos datos completos de tarjetas.
                </li>
                <li>
                  <strong>Pago QR:</strong> Código QR compatible con plataformas bancarias de
                  Bolivia.
                </li>
                <li>
                  <strong>Pago en Efectivo:</strong> Sistema de verificación mediante código único
                  temporal.
                </li>
              </ul>
              <p className='text-xs leading-relaxed mt-2'>
                Los reembolsos se procesarán al método de pago original. Para disputas, contactar a
                soporte dentro de 7 días desde la transacción.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>9. PROPIEDAD INTELECTUAL</h4>
              <p className='text-xs leading-relaxed'>
                Todo el contenido de la plataforma Fixers (diseño, logotipos, software, textos,
                gráficos y funcionalidades) es propiedad de Fixers o sus licenciantes, y está
                protegido por las leyes de propiedad intelectual vigentes. Queda prohibida la
                reproducción, modificación o distribución sin autorización previa y por escrito.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>
                10. LIMITACIÓN DE RESPONSABILIDAD
              </h4>
              <p className='text-xs leading-relaxed mb-1'>Fixers no se responsabiliza por:</p>
              <ul className='text-xs leading-relaxed list-disc list-inside ml-2 space-y-1'>
                <li>
                  La calidad, cumplimiento o resultados de los trabajos realizados por los Fixers.
                </li>
                <li>Cualquier daño directo o indirecto derivado del uso del servicio.</li>
                <li>Errores técnicos, interrupciones o fallas en la plataforma.</li>
              </ul>
              <p className='text-xs leading-relaxed mt-2'>
                La plataforma se ofrece &quot;tal cual&quot;, sin garantías de disponibilidad o
                resultados específicos.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>
                11. MODIFICACIONES DE LOS TÉRMINOS
              </h4>
              <p className='text-xs leading-relaxed'>
                Fixers se reserva el derecho de modificar estos términos en cualquier momento. Las
                modificaciones entrarán en vigor al ser publicadas en la plataforma. El uso
                continuado del servicio tras los cambios constituirá su aceptación de los nuevos
                términos.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>12. SUSPENSIÓN Y TERMINACIÓN</h4>
              <p className='text-xs leading-relaxed'>
                El Sistema puede suspender o eliminar cuentas que incumplan los términos
                establecidos, sin previo aviso. Las disposiciones relacionadas con propiedad
                intelectual, limitación de responsabilidad y privacidad seguirán vigentes tras la
                terminación.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>13. LEY APLICABLE</h4>
              <p className='text-xs leading-relaxed'>
                Estos términos se regirán por las leyes vigentes en Bolivia, sin perjuicio de sus
                normas sobre conflictos de leyes. Cualquier disputa será resuelta ante los
                tribunales competentes de Cochabamba.
              </p>
            </section>

            <section>
              <h4 className='font-semibold text-gray-800 mb-2'>14. CONTACTO</h4>
              <p className='text-xs leading-relaxed'>
                Si tiene preguntas o comentarios sobre estos términos, puede comunicarse con
                nosotros a través de:
                <strong> lumon@gmail.com</strong>, <strong>Innosys@gmail.com</strong> o mediante el
                formulario de contacto disponible en la plataforma.
              </p>
            </section>
          </div>
        </div>

        <label className='flex items-start gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={accepted}
            onChange={(e) => onAcceptChange(e.target.checked)}
            className='mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500'
          />
          <span className='text-sm text-gray-700'>
            He leído y acepto los términos y condiciones para convertirme en FIXER
          </span>
        </label>

        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    </Card>
  );
}
