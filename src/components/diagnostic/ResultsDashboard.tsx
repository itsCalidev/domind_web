import { AlertTriangle, TrendingDown, Award, RefreshCw, Download } from 'lucide-react';
import type { Answer } from './DiagnosticContainer';

interface ResultsDashboardProps {
  score: number;
  answers: Answer[];
  onRestart: () => void;
}

export default function ResultsDashboard({ score, answers, onRestart }: ResultsDashboardProps) {
  // Mock data basado en el score
  const getRiskLevel = (score: number) => {
    if (score <= 2) return { label: 'Riesgo Crítico', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (score <= 3) return { label: 'Riesgo Alto', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (score <= 3.5) return { label: 'Moderado', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { label: 'Bajo Riesgo', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const riskLevel = getRiskLevel(score);

  // Mock metrics - Ajustados para coincidir con la imagen
  const metrics = [
    { label: 'Condiciones Laborales', score: score - 0.2, max: 4, icon: '🏢' },
    { label: 'Relaciones y Liderazgo', score: score - 0.5, max: 4, icon: '💬' },
    { label: 'Seguridad', score: score + 0.1, max: 4, icon: '🛡️' },
    { label: 'Riesgos Psicosociales', score: score - 0.3, max: 4, icon: '🧠' }
  ];

  const rotationRisk = Math.round(((4 - score) / 4) * 100);

  // Mock data para el gráfico de dona
  const donutData = [
    { label: 'Crítico', value: 35, color: '#dc2626' },
    { label: 'Alto', value: 25, color: '#f97316' },
    { label: 'Medio', value: 20, color: '#eab308' },
    { label: 'Bajo', value: 20, color: '#22c55e' }
  ];

  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="space-y-0">
      {/* Header con fondo azul oscuro */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-2xl shadow-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Informe de Diagnóstico <span className="font-normal">Organizacional</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/90 text-sm">
              DOMIND - {currentDate}
            </span>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-2xl shadow-2xl p-6 md:p-8">
        {/* Top Section - Gauge y Barra principal */}
        <div className="grid md:grid-cols-5 gap-6 mb-6">
          {/* Gauge */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="relative w-full max-w-xs mx-auto">
              <svg viewBox="0 0 200 120" className="w-full">
                {/* Background arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Colored segments */}
                <path
                  d="M 20 100 A 80 80 0 0 1 53 42"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 53 42 A 80 80 0 0 1 85 25"
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 85 25 A 80 80 0 0 1 115 25"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 25 A 80 80 0 0 1 147 42"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 147 42 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                
                {/* Needle - Dark gray/black */}
                <g transform={`rotate(${-90 + (score / 4) * 180} 100 100)`}>
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="40"
                    stroke="#374151"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="100" r="8" fill="#374151" />
                </g>
              </svg>

              {/* Score Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <div className="text-sm font-semibold text-gray-600 mb-1">Nivel General</div>
                <div className="text-5xl font-bold text-red-600">{score}</div>
                <div className="text-base font-bold text-red-600 mt-1">
                  {riskLevel.label}
                </div>
              </div>
            </div>
          </div>

          {/* Barra de escala principal */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="w-full">
              <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-green-500"></div>
                  <div className="flex-1 bg-lime-400"></div>
                  <div className="flex-1 bg-yellow-400"></div>
                  <div className="flex-1 bg-orange-500"></div>
                  <div className="flex-1 bg-red-500"></div>
                </div>
                
                {/* Indicator - círculo azul oscuro */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-900 rounded-full border-3 border-white shadow-xl z-10"
                  style={{ left: `${(score / 4) * 100}%`, marginLeft: '-10px' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left - Métricas individuales */}
          <div className="space-y-3">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white text-sm">
                    {metric.icon}
                  </div>
                  <span className="font-bold text-gray-800 text-sm flex-1">
                    {metric.label}
                  </span>
                </div>
                
                {/* Traffic Light Bar - Más delgada */}
                <div className="relative h-6 rounded-md overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-blue-900"></div>
                    <div className="flex-1 bg-green-500"></div>
                    <div className="flex-1 bg-lime-400"></div>
                    <div className="flex-1 bg-yellow-400"></div>
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-red-500"></div>
                    <div className="w-8 bg-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Risk Matrix */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 gap-2 aspect-square">
              {/* Top Left - Bajo Riesgo */}
              <div className="bg-green-400 rounded-lg p-4 flex items-center justify-center relative border-2 border-green-500">
                <span className="text-sm font-bold text-white text-center leading-tight">
                  Bajo Riesgo
                </span>
              </div>

              {/* Top Right - Riesgo Latente */}
              <div className="bg-lime-300 rounded-lg p-4 flex items-center justify-center relative border-2 border-lime-400">
                <span className="text-sm font-bold text-gray-800 text-center leading-tight">
                  Riesgo Latente
                </span>
                {score > 2.5 && score <= 3.2 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-xl"></div>
                  </div>
                )}
              </div>

              {/* Bottom Left - Riesgo Conductual */}
              <div className="bg-orange-400 rounded-lg p-4 flex items-center justify-center relative border-2 border-orange-500">
                <span className="text-sm font-bold text-white text-center leading-tight">
                  Riesgo Conductual
                </span>
              </div>

              {/* Bottom Right - Riesgo Crítico */}
              <div className="bg-red-500 rounded-lg p-4 flex items-center justify-center relative border-2 border-red-600">
                <span className="text-sm font-bold text-white text-center leading-tight">
                  Riesgo Crítico
                </span>
                {score <= 2.5 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-red-800 rounded-full border-4 border-white shadow-xl"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Axis labels */}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-16 h-4" viewBox="0 0 60 20">
                  <defs>
                    <marker id="arrowleft" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                      <path d="M 8 5 L 2 5 L 5 2 M 2 5 L 5 8" stroke="#9ca3af" fill="none" strokeWidth="1"/>
                    </marker>
                    <marker id="arrowright" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                      <path d="M 2 5 L 8 5 L 5 2 M 8 5 L 5 8" stroke="#9ca3af" fill="none" strokeWidth="1"/>
                    </marker>
                  </defs>
                  <line x1="5" y1="10" x2="55" y2="10" stroke="#9ca3af" strokeWidth="1.5" markerStart="url(#arrowleft)" markerEnd="url(#arrowright)"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            {score < 3 && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 border-l-4 border-yellow-400">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    Riesgo de Rotación Elevado
                  </span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 border-l-4 border-yellow-400">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    Condicionss Físicas Deficientes
                  </span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 border-l-4 border-yellow-400">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    Brecha en Liderazgo Operativo
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Gráfico de Dona - Dark background como en la imagen */}
          <div className="bg-slate-700 rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 gap-4 h-full items-center">
              {/* Donut Chart */}
              <div className="relative w-full aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="40"
                  />
                  
                  {/* Segments */}
                  {(() => {
                    let currentAngle = 0;
                    const total = donutData.reduce((sum, d) => sum + d.value, 0);
                    return donutData.map((segment, idx) => {
                      const segmentAngle = (segment.value / total) * 360;
                      const startAngle = currentAngle;
                      currentAngle += segmentAngle;
                      
                      const startRad = (startAngle - 90) * (Math.PI / 180);
                      const endRad = (currentAngle - 90) * (Math.PI / 180);
                      
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);
                      
                      const largeArc = segmentAngle > 180 ? 1 : 0;
                      
                      return (
                        <path
                          key={idx}
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                        />
                      );
                    });
                  })()}
                  
                  {/* Center hole */}
                  <circle cx="100" cy="100" r="50" fill="#334155" />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <h3 className="text-white font-bold text-sm mb-3">Categorías</h3>
                {donutData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1 bg-slate-600 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full" 
                        style={{ 
                          backgroundColor: item.color,
                          width: `${item.value}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recommendation Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-600 font-semibold text-sm mb-3">
              Recomendación Prioritaria
            </h3>
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 mb-4">
              <h4 className="text-white text-xl font-bold mb-4">
                Workshop de Clima y Seguridad
              </h4>
              <button className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg">
                Solicitar Intervención
              </button>
            </div>
          </div>

          {/* Rotation Thermometer */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-6 h-full">
              {/* Thermometer */}
              <div className="relative h-48 w-24 flex-shrink-0">
                {/* Thermometer bulb and tube */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  {/* Bulb */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full border-4 border-gray-300 relative">
                    <div className="absolute inset-2 bg-orange-500 rounded-full"></div>
                  </div>
                  
                  {/* Tube */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-40 bg-gray-200 border-4 border-gray-300 rounded-t-full">
                    {/* Fill */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-t-full transition-all duration-1000"
                      style={{ height: `${rotationRisk}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-gray-800 font-bold text-lg mb-2">
                  Probabilidad de Rotación: <span className="text-orange-500">{rotationRisk}%</span>
                </h3>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}