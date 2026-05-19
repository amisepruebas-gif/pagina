// Placeholder de la sección admin.
// Fase E sustituye este archivo con el dashboard real protegido por custom claim role=admin.
export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="rounded border border-gray-200 bg-white p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">/admin</h1>
        <p className="mt-3 text-sm text-gray-600">
          Reservado para staff. Se implementa en Fase E con guard por <code className="rounded bg-gray-100 px-1">role=admin</code>.
        </p>
      </div>
    </main>
  );
}
