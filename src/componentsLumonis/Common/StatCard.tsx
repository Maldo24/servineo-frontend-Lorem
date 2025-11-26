import React from 'react';

interface StatCardProps {
  number: string;
  text: string;
}

export default function StatCard({ number, text }: StatCardProps) {
  return (
    <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
      <p className="text-3xl md:text-5xl font-bold text-primary mb-2">{number}</p>
      <p className="text-gray-700 text-lg font-medium">{text}</p>
    </div>
  );
}