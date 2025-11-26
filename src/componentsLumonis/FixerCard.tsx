"use client";

import { Fixer } from "@/hooks/useFixersByJob";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface FixerCardProps {
  fixer: Fixer;
}

export function FixerCard({ fixer }: FixerCardProps) {
  return (
    <Link href={`/fixer/${fixer.id}`}>
      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            {fixer.avatar && (
              <Image
                src={fixer.avatar}
                alt={fixer.name}
                width={48}      // 12 * 4px (w-12)
                height={48}     // 12 * 4px (h-12)
                className="rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 hover:text-blue-600">
                {fixer.name}
              </h4>
              <p className="text-sm text-gray-600">{fixer.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {fixer.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
