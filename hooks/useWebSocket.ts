import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  
  // Keep track of whether the component is mounted to prevent zombie reconnections
  const isMounted = useRef(false); 
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    isMounted.current = true; // Component mounted

    const connect = () => {
      // Prevent multiple connections
      if (ws.current?.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        if (isMounted.current) {
          console.log('WebSocket Connected');
          setReadyState(WebSocket.OPEN);
        }
      };

      ws.current.onmessage = (e) => {
        if (isMounted.current) {
          const message = JSON.parse(e.data);
          setLastMessage(message);
        }
      };

      ws.current.onclose = () => {
        if (isMounted.current) {
          console.log('WebSocket Disconnected');
          setReadyState(WebSocket.CLOSED);
          // Only attempt reconnect if the component is still mounted
          setTimeout(() => {
             if (isMounted.current) connect(); 
          }, 1000);
        }
      };

      ws.current.onerror = (e) => {
        if (isMounted.current) {
          console.error('WebSocket Error', e);
          setReadyState(WebSocket.CLOSING);
        }
      };
    };

    connect();

    return () => {
      isMounted.current = false; // Mark as unmounted
      if (ws.current) {
        // Remove the listener to ensure the close event doesn't trigger a reconnect
        ws.current.onclose = null; 
        ws.current.close();
      }
    };
  }, [url]);

  return { lastMessage, readyState };
};