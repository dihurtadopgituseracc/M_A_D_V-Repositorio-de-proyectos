// Indicador mostrado mientras se descarga una vista cargada bajo demanda.
export default function PageLoading() {
  return (
    <div
      data-page-loading=""
      role="status"
      aria-live="polite"
      className="flex min-h-[60dvh] w-full items-center justify-center"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60 motion-reduce:animate-none" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
