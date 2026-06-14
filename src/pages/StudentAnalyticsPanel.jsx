import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
// Ajusta esta ruta a donde tengas guardado tu evaluacionApi.js
import { fetchKpisGrupo } from '../services/evaluacionApi'; 

const StudentAnalyticsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grupoActivo, setGrupoActivo] = useState('4CV1');

  useEffect(() => {
    const cargarAnaliticas = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Llamada real a tu API GraphQL usando la función que ya creaste
        const kpisReales = await fetchKpisGrupo(grupoActivo);

        // 2. Mapeo de datos para inyectar en las gráficas
        // Aseguramos que si viene null, tenga valores por defecto para no tronar el front
        const kpis = kpisReales || {
          totalAlumnos: 0,
          entregasRealizadas: 0,
          tasaCumplimiento: 0,
          alumnosEnRiesgo: []
        };

        setData({
          kpis,
          // La gráfica de dona se alimenta 100% de la tasa de cumplimiento real
          distribucion: [
            { name: 'Entregado', value: kpis.tasaCumplimiento, color: '#701a2e' }, // Guinda institucional
            { name: 'Pendiente', value: 100 - kpis.tasaCumplimiento, color: '#e2e8f0' }, // Gris neutro
          ],
          // NOTA TÉCNICA: La tendencia por unidades y detalles de alumnos requieren 
          // endpoints adicionales en el futuro. Por ahora usamos mock data visual 
          // estructurada para no romper el diseño minimalista.
          tendenciaUnidades: [
            { name: 'U1', entregas: Math.floor(kpis.entregasRealizadas * 0.2) || 0 }, 
            { name: 'U2', entregas: Math.floor(kpis.entregasRealizadas * 0.4) || 0 },
            { name: 'U3', entregas: Math.floor(kpis.entregasRealizadas * 0.3) || 0 }, 
            { name: 'U4', entregas: Math.floor(kpis.entregasRealizadas * 0.1) || 0 },
          ]
        });
      } catch (err) {
        console.error("Error al cargar KPIs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarAnaliticas();
  }, [grupoActivo]);

  // Estados de carga y error minimalistas
  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-rose-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 tracking-widest uppercase">Sincronizando Base de Datos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-50 text-red-700 rounded-xl m-6 border border-red-100">
      <h3 className="font-bold mb-2">Error de Conexión</h3>
      <p className="text-sm">{error}. Verifica que el backend esté corriendo.</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* HEADER Y FILTROS MINIMALISTAS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rendimiento Académico</h2>
          <p className="text-sm text-slate-500 mt-1">Análisis de entregas y riesgo de deserción</p>
        </div> 
        
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm overflow-x-auto">
          {['TC-01', 'TC-03', 'TC-04', 'Todos'].map((g) => (
            <button
              key={g}
              onClick={() => setGrupoActivo(g)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                grupoActivo === g 
                  ? 'bg-rose-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {g === 'Todos' ? 'Todos los grupos' : `Grupo ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS DE KPIs (SaaS Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Matrícula', val: data.kpis.totalAlumnos, bg: 'bg-slate-100', text: 'text-slate-800' },
          { label: 'Entregas Registradas', val: data.kpis.entregasRealizadas, bg: 'bg-slate-100', text: 'text-slate-800' },
          { label: 'Cumplimiento Global', val: `${Math.round(data.kpis.tasaCumplimiento)}%`, bg: 'bg-emerald-50', text: 'text-emerald-700' },
          { label: 'Alumnos en Riesgo', val: data.kpis.alumnosEnRiesgo.length, bg: 'bg-rose-50', text: 'text-rose-700' },
        ].map((kpi, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-slate-100 ${kpi.bg} transition duration-300 hover:shadow-sm`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{kpi.label}</p>
            <h3 className={`text-4xl font-black tracking-tighter ${kpi.text}`}>{kpi.val}</h3>
          </div>
        ))}
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tendencia (BarChart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800">Volumen de Entregas por Unidad</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.tendenciaUnidades} margin={{ top: 20 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="entregas" fill="#701a2e" radius={[6, 6, 0, 0]} barSize={40}>
                <LabelList dataKey="entregas" position="top" fill="#701a2e" fontWeight="bold" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución (PieChart) */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 mb-6 text-center">Efectividad del Grupo</h3>
          <div className="h-48 relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.distribucion} 
                  innerRadius={65} 
                  outerRadius={85} 
                  dataKey="value" 
                  stroke="none"
                >
                  {data.distribucion.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto centrado en la dona */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{Math.round(data.kpis.tasaCumplimiento)}%</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#701a2e]"></div><span className="text-xs font-medium text-slate-600">Entregado</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200"></div><span className="text-xs font-medium text-slate-600">Pendiente</span></div>
          </div>
        </div>
      </div>

      {/* TABLA DE ATENCIÓN PRIORITARIA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Atención Prioritaria</h3>
          <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {data.kpis.alumnosEnRiesgo.length} Alumnos
          </span>
        </div>
        
        {data.kpis.alumnosEnRiesgo.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Identificador del Alumno</th>
                <th className="px-6 py-4 font-semibold">Grupo</th>
                <th className="px-6 py-4 font-semibold text-right">Acción Requerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.kpis.alumnosEnRiesgo.map((nombre, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{nombre}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{grupoActivo}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-rose-700 bg-white border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                      Revisar Expediente
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 text-xl">✓</div>
            <p className="text-slate-600 font-medium">No hay alumnos en riesgo actualmente.</p>
            <p className="text-sm text-slate-400">El cumplimiento del grupo es óptimo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnalyticsPanel;