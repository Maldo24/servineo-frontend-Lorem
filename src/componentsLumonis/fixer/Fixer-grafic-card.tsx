// src/Components/fixer/Fixer-grafic-card.tsx
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface FixerGraficCardProps {
  completedJobs: number;
  cancelledJobs: number;
}

interface FixerGraficCardProps {
  completedJobs: number;
  cancelledJobs: number;
  monthlyData?: { month: string; completados: number; cancelados: number }[];
}

export default function FixerGraficCard({ completedJobs, cancelledJobs }: FixerGraficCardProps) {

  console.log("Completed Jobs:", completedJobs);
  console.log("Cancelled Jobs:", cancelledJobs);
  const monthlyData = [
    { month: "Ene", completados: 8, cancelados: 1 },
    { month: "Feb", completados: 30, cancelados: 2 },
    { month: "Mar", completados: 15, cancelados: 0 },
    { month: "Abr", completados: 20, cancelados: 3 },
    { month: "May", completados: 22, cancelados: 1 },
    { month: "Jun", completados: 20, cancelados: 2 },
  ];

  // 🔥 Calcular totales del año desde monthlyData
  const yearlyCompleted = monthlyData.reduce((sum, month) => sum + month.completados, 0);
  const yearlyCancelled = monthlyData.reduce((sum, month) => sum + month.cancelados, 0);
  const totalJobs = yearlyCompleted + yearlyCancelled;
  const completionRate = totalJobs > 0 ? Math.round((yearlyCompleted / totalJobs) * 100) : 0;

  // 🔥 Escala lineal normal (sin logaritmo) para mejor visualización
  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.completados, m.cancelados)), 1);
  
  // Función para escalar valores linealmente
  const scaleValue = (value: number) => {
    if (value === 0) return 0;
    return (value / maxValue) * 100;
  };

  return (
    <div className="bg-white rounded-3xl border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-600" />
          Desempeño Mensual
        </h3>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{yearlyCompleted}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Completados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <XCircle className="w-7 h-7 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{yearlyCancelled}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Cancelados</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-5xl font-bold text-green-600">{completionRate}%</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Tasa de éxito</p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-6 gap-6">
          {monthlyData.map((data, index) => {
            const completedHeight = scaleValue(data.completados);
            const cancelledHeight = scaleValue(data.cancelados);

            // Calcular % de éxito del mes
            const monthTotal = data.completados + data.cancelados;
            const successRate = monthTotal > 0 ? Math.round((data.completados / monthTotal) * 100) : 0;

            return (
              <div key={index} className="flex flex-col items-center space-y-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-gray-700">{data.month}</span>
                  <p className="text-[10px] font-semibold text-green-600">{successRate}%</p>
                </div>

                <div className="flex items-end gap-2 h-64 w-full">
                  
                  {/* ⭐ Barra Completados */}
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-700 ease-out shadow-lg"
                      style={{
                        height: `${completedHeight}%`,
                        minHeight: data.completados > 0 ? "24px" : "0px",
                      }}
                    />
                    <span className="text-xs font-bold text-green-700">{data.completados}</span>
                  </div>

                  {/* ⭐ Barra Cancelados */}
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div
                      className="w-full bg-red-500 rounded-t-lg transition-all duration-700 ease-out shadow-lg"
                      style={{
                        height: `${cancelledHeight}%`,
                        minHeight: data.cancelados > 0 ? "20px" : "0px",
                        opacity: data.cancelados > 0 ? 1 : 0.35,
                      }}
                    />
                    <span className="text-xs font-bold text-red-700">{data.cancelados}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-gray-600">
                  {data.completados + data.cancelados}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-10 mt-10 text-sm font-medium">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span>Completados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span>Cancelados</span>
          </div>
        </div>
      </div>
    </div>
  );
}