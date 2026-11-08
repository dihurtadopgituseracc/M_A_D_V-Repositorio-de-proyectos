import { reg, semi } from "@/constants/styles"

const faqs = [
  {
    question: "¿Estos proyectos son de GDD?",
    answer:
      "No. Todos los proyectos pertenecen a sus respectivos autores y equipos de trabajo. GDD es un punto de encuentro para impulsar su crecimiento y facilitar que sus integrantes puedan conocerse, compartir conocimientos y, sobre todo, disfrutar del proceso.",
  },
  {
    question:
      "¿Qué tengo que hacer si quiero agregar mi proyecto al repositorio?",
    answer:
      "Si deseas agregar tu proyecto al repositorio abierto, primero debes participar presencialmente en los espacios de GDD. No necesitas asistir de manera permanente, pero sí mantener cierta continuidad en tu participación.",
  },
  {
    question: "¿Y si quiero colaborar en un proyecto?",
    answer:
      "¡Puedes hacerlo! Los proyectos pueden necesitar colaboraciones puntuales en diferentes etapas de su desarrollo. Puedes acercarte a conocerlos y conversar con sus responsables para identificar cómo podrías aportar.",
  },
  {
    question: "¿Tengo que registrarme como parte del equipo para colaborar?",
    answer:
      "No. Las colaboraciones pueden darse en procesos puntuales, sin que necesariamente tengas que integrarte al equipo. La decisión de unirte o no a un proyecto depende de ti y debe conversarse directamente con sus responsables.",
  },
  {
    question: "¿Tengo que ser estudiante de la UNAL?",
    answer:
      "No. No es requisito ser estudiante ni pertenecer a la comunidad universitaria para participar en las colaboraciones.",
  },
  {
    question: "¿Es necesario pertenecer a alguna facultad en específico?",
    answer:
      "¡Para nada! No hay una facultad específica a la que debas pertenecer. Lo importante es tu interés y lo que puedas aportar al proyecto.",
  },
  {
    question: "¿Necesito tener experiencia para colaborar en un proyecto?",
    answer:
      "No necesariamente. Cada proyecto tiene necesidades diferentes y puede haber oportunidades para personas con distintos niveles de experiencia. Lo importante es conocer qué necesita el equipo y qué puedes aportar.",
  },
  {
    question: "¿Cómo puedo conocer más sobre un proyecto que me interesa?",
    answer:
      "Puedes consultar la información disponible en su perfil y acercarte a los espacios de encuentro de GDD para conocer a sus responsables, conversar sobre el proyecto y resolver tus dudas.",
  },
  {
    question:
      "¿Puedo proponer una colaboración o aportar una idea a un proyecto?",
    answer:
      "¡Claro! Puedes acercarte a los responsables del proyecto y compartir tus ideas, habilidades o propuestas de colaboración. Cada equipo podrá evaluar cómo integrarlas según sus necesidades y el estado actual del desarrollo.",
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-oro px-5 pb-16 pt-10 text-tinta sm:px-8 sm:pt-14 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className={`${semi} text-[11px] uppercase text-coral`}>
              Preguntas frecuentes
            </p>
            <h1
              className={`${semi} mt-3 max-w-[420px] text-[30px] leading-[1.12] text-tinta sm:text-[38px]`}
            >
              Todo lo que necesitas saber para participar.
            </h1>
          </div>

          <div className="border-t border-tinta/25">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-tinta/25"
              >
                <summary
                  className={`${semi} flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] leading-[1.35] text-tinta marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tinta [&::-webkit-details-marker]:hidden`}
                >
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[30px] font-normal leading-none transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p
                  className={`${reg} max-w-[680px] pb-5 pr-10 text-[22px] leading-[1.7] text-grafito`}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
