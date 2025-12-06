import React from 'react';

interface NoInternetPopUpProps {
	open: boolean;
	onClose: () => void;
}

const NoInternetPopUp: React.FC<NoInternetPopUpProps> = ({ open, onClose }) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
				<h2 className="text-xl font-bold mb-4">Sin conexión a Internet</h2>
				<p className="mb-4">No se pudo abrir el formulario porque no tienes conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.</p>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					onClick={onClose}
				>
					Cerrar
				</button>
			</div>
		</div>
	);
};

export default NoInternetPopUp;
