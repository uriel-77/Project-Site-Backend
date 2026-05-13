import React from 'react';
import ChecklistPartial from '../components/ChecklistPartial';
import { cerrarSesion } from '../utils/localStorage';
import { fetchAsignaciones } from '../services/contenidoApi';

function buildChecklist(parcial, asignaciones) {
  return {
    parcial,
    nombre: `Parcial ${parcial}`,
    descripcion: 'Asignaciones dinámicas publicadas por moderación y administración.',
    actividades: asignaciones.map((asignacion) => ({
      id: asignacion.id,
      nombre: asignacion.titulo,
      porcentaje: asignacion.porcentaje,
      entregable: asignacion.entregable,
      descripcion: asignacion.descripcion,
      rubrica: asignacion.rubrica,
      videos: asignacion.videos || [],
    })),
  };
}

const StudentDashboard = ({ usuario, onNavigate, onLogout }) => {
  const [parcialActivo, setParcialActivo] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [asignaciones, setAsignaciones] = React.useState([]);

  const cargarAsignaciones = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAsignaciones({
        periodo: parcialActivo,
        grupo: usuario?.grupo || undefined,
      });
      setAsignaciones(data.filter((item) => item.activa));
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar tus asignaciones.');
    } finally {
      setLoading(false);
    }
  }, [parcialActivo, usuario?.grupo]);

  React.useEffect(() => {
    cargarAsignaciones();
  }, [cargarAsignaciones]);

  const handleCerrarSesion = () => {
    cerrarSesion();
    if (onLogout) onLogout();
    if (onNavigate) onNavigate('Inicio');
  };

  const checklist = buildChecklist(parcialActivo, asignaciones);

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="bg-gradient-to-r from-[#6b2132] to-[#1f4f46] text-white p-8 rounded-xl mb-8 shadow-lg">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard del alumno</h1>
            <p className="text-lg opacity-90">
              {usuario?.nombre} {usuario?.apellido}
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-2">
                <i data-lucide="mail" className="w-4 h-4"></i>
                {usuario?.email}
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <i data-lucide="users" className="w-4 h-4"></i>
                Grupo: {usuario?.grupo}
              </span>
            </div>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-200">
          {[1, 2, 3].map((parcial) => (
            <button
              key={parcial}
              onClick={() => setParcialActivo(parcial)}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                parcialActivo === parcial
                  ? 'border-[#6b2132] text-[#6b2132]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Parcial {parcial}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{checklist.nombre}</h2>
          <p className="text-gray-600">{checklist.descripcion}</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando asignaciones...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : (
          <ChecklistPartial
            checklist={checklist}
            parcial={parcialActivo}
            grupo={usuario?.grupo}
            estudianteId={usuario?.id}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
