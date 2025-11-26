"use client"

import { Pie, PieChart, Cell, Tooltip } from "recharts"
import { useGetJobStatisticsQuery } from '../../app/redux/services/statisticsApi';


const COLORS = {
    Completados: "#10B981",
    "En proceso": "#3B82F6",
    Pendientes: "#F59E0B",
}



interface TooltipPayload {
    name: string;
    value: number;
    payload: {
        estado: string;
        cantidad: number;
    };
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border border-gray-300 shadow-md rounded-md text-sm">
                <p className="font-semibold text-gray-800">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        )
    }
    return null
}


export default function EstadisticasTrabajos() {
    const { data: jobLogs, isLoading, isError } = useGetJobStatisticsQuery();

    if (isLoading) {
        return <div className="text-center p-8">Cargando estadísticas...</div>;
    }
    if (isError || !jobLogs) {
        return <div className="text-center p-8 text-red-600">Error al cargar datos o datos no disponibles.</div>;
    }

    const dailyStatusLog = jobLogs
        .filter(log => log.type === 'daily_jobs_status')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (!dailyStatusLog) {
        return <div className="text-center p-8 text-gray-500">No se encontraron logs de estado de trabajos.</div>;
    }
    
    const stats = dailyStatusLog.metadata;

    const chartData = [
        { estado: "Completados", cantidad: stats.completed },
        { estado: "En proceso", cantidad: stats.inProgress },
        { estado: "Pendientes", cantidad: stats.pending },
    ];

    const totalTrabajos = stats.total;

    return (
        <div className="flex flex-col font-['Roboto'] shadow-md rounded-2xl p-4 bg-white max-w-sm mx-auto">
            <div className="flex justify-center pb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    Estadísticas de trabajos
                </h2>
            </div>
            <div className="flex flex-col items-center justify-center">
                <PieChart width={300} height={300}>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                        data={chartData}
                        dataKey="cantidad"
                        nameKey="estado"
                        outerRadius={100}
                        labelLine={false}
                        label={({ payload, ...props }) => (
                            <text
                                cx={props.cx}
                                cy={props.cy}
                                x={props.x}
                                y={props.y}
                                textAnchor={props.textAnchor}
                                dominantBaseline={props.dominantBaseline}
                                fill="#333" 
                                className="text-sm font-medium">
                                {`${payload.cantidad}`}
                            </text>
                        )}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.estado as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
            <div className="mt-4 w-full text-sm text-gray-700">
                {chartData.map((item, index) => (
                    <div 
                        key={item.estado} 
                        className={`flex justify-between px-4 py-1 ${index < chartData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <span className="font-medium flex items-center">
                            <span 
                                className="inline-block w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[item.estado as keyof typeof COLORS] }}
                            ></span>
                            {item.estado}
                        </span>
                        
                        <span>
                            {item.cantidad} trabajos 
                            <span className="ml-2 font-normal text-gray-500">
                                ({((item.cantidad / totalTrabajos) * 100).toFixed(0)}%)
                            </span>
                        </span>
                    </div>
                ))}
                
                <div className="flex justify-between px-4 py-1 mt-2 border-t-2 border-gray-300 font-bold">
                    <span>Total</span>
                    <span>{totalTrabajos} trabajos</span>
                </div>
            </div>
        </div>
    )
}