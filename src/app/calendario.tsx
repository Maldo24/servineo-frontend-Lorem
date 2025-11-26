'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Array de nombres para selección aleatoria
const availableNames = [
    "Diego Paredes",
    "Franco Lopez"
];

export default function Home() {
    const [randomName, setRandomName] = useState("John Doe");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        setRandomName(availableNames[randomIndex]);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Principal */}
            <div className="border-b border-gray-200 p-4 lg:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Contenido del header - siempre visible */}
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        {/* Avatar/Imagen de perfil */}
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-lg">
                                {randomName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{randomName}</div>
                            <div className="text-gray-500 text-sm lg:text-base">(Fixer)</div>
                        </div>
                    </div>

                    {/* Botón Ver Calendario - debajo en mobile, al lado en desktop */}
                    <div className="lg:absolute lg:top-6 lg:right-6">
                        <Link
                            href="/calendar"
                            className="block lg:inline-block w-full lg:w-auto text-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Ver Calendario
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="p-4 lg:p-8">
                <div className="max-w-4xl mx-auto">

                    {/* Sección 2.1 Net Admission */}
                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">Informacion de Perfil</h2>

                        {/* Experiencia Previa */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 mb-4">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">Experiencia Previa</h3>
                            <div className="text-gray-600">
                                <p>Información sobre experiencias y trabajos anteriores...</p>
                            </div>
                        </div>

                        {/* Reseñas */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">Reseñas</h3>
                            <div className="text-gray-600">
                                <p>Reseñas y comentarios de clientes...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
