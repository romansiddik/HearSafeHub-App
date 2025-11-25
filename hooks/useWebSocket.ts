
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setReadyState(WebSocket.OPEN);
      };

      ws.current.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setLastMessage(message);
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setReadyState(WebSocket.CLOSED);
        // Optional: attempt to reconnect
        setTimeout(() => connect(), 1000);
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket Error', e);
        setReadyState(WebSocket.CLOSING);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { lastMessage, readyState };
};
