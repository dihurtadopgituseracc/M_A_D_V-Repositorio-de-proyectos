import { semi, reg } from "@/constants/styles"
import InstagramPostCard from "@/components/instagram/InstagramPostCard"

// El post que se muestra se configura en src/data/instagram-post.ts.
export default function EventsPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-crema px-5 pb-16 pt-10 text-tinta sm:px-8 sm:pt-14 lg:px-10 lg:pb-20">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center">
        <h1
          className={`${semi} text-center text-[56px] leading-[1] tracking-[-0.03em] text-tinta sm:text-[88px] lg:text-[112px]`}
        >
          Eventos
        </h1>

        <section
          aria-labelledby="lugar-gdd"
          className="mt-8 w-full max-w-[620px] border-y border-tinta/20 py-6 text-center sm:mt-10"
        >
          <h2
            id="lugar-gdd"
            className={`${semi} text-[22px] leading-[1.25] text-tinta sm:text-[28px]`}
          >
            ¿Y en dónde puedo asistir a GDD?
          </h2>
          <p
            className={`${reg} mt-3 text-[17px] leading-[1.5] text-grafito sm:text-[19px]`}
          >
            <span className={semi}>Lugar:</span> El salón nº 304 - CYT
          </p>
          
        </section>
        <h2
            id="siguiente-evento"
            className={`${semi} mt-4 text-[20px] leading-[1.25] text-tinta sm:text-[28px]`}
          >
            El siguiente evento es:
          </h2>

        <div className="mt-10 flex w-full justify-center sm:mt-12">
          <InstagramPostCard />
        </div>
      </div>
    </main>
  )
}
