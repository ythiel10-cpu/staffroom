export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold mb-3">Kein Zugriff</h1>
        <p className="text-zinc-300">
          Du bist eingeloggt, aber kein Admin. Setze in Supabase in der Tabelle
          <b> profiles </b> bei deinem User <b>role = admin</b>.
        </p>
      </div>
    </div>
  );
}
