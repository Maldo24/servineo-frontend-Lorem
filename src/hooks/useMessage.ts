import { useState, useCallback } from 'react';

type MessageType = 'warning' | 'error' | 'info' | 'success';

interface MessageConfig {
    message: string;
    type?: MessageType;
    title?: string;
    onCloseCallback?: () => void;
}

export default function useMessage() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<MessageType>('info');
    const [title, setTitle] = useState('');
    // Funcion agregada para ejecutar algo al cerrar el modal
    const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(null); 

    const showMessage = useCallback((config: MessageConfig) => {
        setMessage(config.message);
        setType(config.type || 'info');
        setTitle(config.title || '');
        setOnCloseCallback(() => config.onCloseCallback || null);
        setIsOpen(true);
    }, []);

    const hideMessage = useCallback(() => {
        setIsOpen(false);
        
        // Ejecutar al momento de cerrar
        if (onCloseCallback) {
            onCloseCallback();
            setOnCloseCallback(null); // Limpiar el callback después de usarlo
        }
    }, [onCloseCallback]);

    return {
        showMessage,
        hideMessage,
        messageState: {
            isOpen,
            message,
            type,
            title,
            onClose: hideMessage
        }
    };
}