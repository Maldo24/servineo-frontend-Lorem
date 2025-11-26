'use client'
import { usePathname,useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from 'lucide-react';


export const TranslationButton = () => {
    const router = useRouter();
    const pathName = usePathname();
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => setShowMenu(!showMenu);
    const handleLanguageChange = (lang: string) => {
        const segments= pathName.split('/');
        segments[1] = lang;
        router.push(segments.join('/'));
    };
    return (
    <div className="flex justify-center mb-6">
        <div className="relative">
            <button 
                onClick={toggleMenu} 
                className="cursor-pointer"
            >
            <Globe size={50} className="m-4 hover:scale-105 transition-transform" />
            </button>
    
            {/* Dropdown */}
            {showMenu && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-800 rounded-lg shadow-lg w-32 p-2 ">
                    <button
                        onClick={() => handleLanguageChange('es')}
                                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md hover:scale-105 transition-transform"
                                    >
                                        es Español
                    </button>
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md hover:scale-105 transition-transform"
                    >
                        en English
                    </button>
                </div>
                )}
        </div>
    </div>
  )
}
