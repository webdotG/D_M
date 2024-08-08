import { useEffect, useState, useRef } from 'react';
import { handleWebSocketMessage } from '../webSocket';

const useWebSocket = (url) => {
  const [ws, setWs] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
      }
    };

    wsRef.current = new WebSocket(url);
    wsRef.current.addEventListener('message', handleMessage);
    setWs(wsRef.current);

    return () => {
      if (wsRef.current) {
        wsRef.current.removeEventListener('message', handleMessage);
        wsRef.current.close();
      }
    };
  }, [url]);

  return ws;
};

export default useWebSocket;
