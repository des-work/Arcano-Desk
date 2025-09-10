import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './useRedux';
import { addNotification } from '../store/slices/uiSlice';

interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: any) => void;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: any;
  reconnectAttempts: number;
}

export const useWebSocket = (options: WebSocketOptions) => {
  const dispatch = useAppDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    reconnectAttempts: 0,
  });

  const {
    url,
    protocols,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  // Send message
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        wsRef.current.send(message);
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Close connection
  const closeConnection = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    
    heartbeatTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping' });
        startHeartbeat();
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, sendMessage]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
  }, []);

  // Reconnect
  const reconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setState(prev => ({
        ...prev,
        error: 'Max reconnection attempts reached',
        isConnecting: false,
      }));
      return;
    }

    reconnectAttemptsRef.current += 1;
    
    setState(prev => ({
      ...prev,
      isConnecting: true,
      reconnectAttempts: reconnectAttemptsRef.current,
    }));

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [maxReconnectAttempts, reconnectInterval]);

  // Connect
  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      wsRef.current = new WebSocket(url, protocols);
      
      wsRef.current.onopen = () => {
        console.log('🧙‍♂️ WebSocket connected');
        reconnectAttemptsRef.current = 0;
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        }));
        
        startHeartbeat();
        onOpen?.();
      };
      
      wsRef.current.onclose = (event) => {
        console.log('🧙‍♂️ WebSocket disconnected:', event.code, event.reason);
        
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
        
        stopHeartbeat();
        onClose?.();
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnect();
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('🧙‍♂️ WebSocket error:', error);
        
        setState(prev => ({
          ...prev,
          error: 'Connection error occurred',
          isConnecting: false,
        }));
        
        onError?.(error);
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle heartbeat response
          if (data.type === 'pong') {
            return;
          }
          
          setState(prev => ({
            ...prev,
            lastMessage: data,
          }));
          
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to create connection',
        isConnecting: false,
      }));
    }
  }, [url, protocols, onOpen, onClose, onError, onMessage, startHeartbeat, stopHeartbeat, reconnect, maxReconnectAttempts]);

  // Initialize connection
  useEffect(() => {
    connect();
    
    return () => {
      closeConnection();
    };
  }, [connect, closeConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  return {
    ...state,
    sendMessage,
    connect,
    disconnect: closeConnection,
    reconnect,
  };
};

// Real-time updates hook for Ollama
export const useOllamaWebSocket = () => {
  const dispatch = useAppDispatch();
  
  const { sendMessage, ...wsState } = useWebSocket({
    url: 'ws://localhost:11434/ws',
    onMessage: (data) => {
      // Handle Ollama WebSocket messages
      if (data.type === 'model_update') {
        dispatch(addNotification({
          type: 'info',
          message: `Model ${data.model} has been updated`,
        }));
      } else if (data.type === 'generation_progress') {
        // Handle generation progress updates
        console.log('Generation progress:', data.progress);
      }
    },
    onError: (error) => {
      dispatch(addNotification({
        type: 'error',
        message: 'WebSocket connection to Ollama failed',
      }));
    },
  });

  const sendGenerationRequest = useCallback((request: any) => {
    return sendMessage({
      type: 'generate',
      ...request,
    });
  }, [sendMessage]);

  const subscribeToModel = useCallback((modelName: string) => {
    return sendMessage({
      type: 'subscribe',
      model: modelName,
    });
  }, [sendMessage]);

  const unsubscribeFromModel = useCallback((modelName: string) => {
    return sendMessage({
      type: 'unsubscribe',
      model: modelName,
    });
  }, [sendMessage]);

  return {
    ...wsState,
    sendGenerationRequest,
    subscribeToModel,
    unsubscribeFromModel,
  };
};

// Real-time collaboration hook
export const useCollaborationWebSocket = (roomId: string) => {
  const dispatch = useAppDispatch();
  
  const { sendMessage, ...wsState } = useWebSocket({
    url: `ws://localhost:3001/collaboration/${roomId}`,
    onMessage: (data) => {
      if (data.type === 'user_joined') {
        dispatch(addNotification({
          type: 'info',
          message: `${data.username} joined the session`,
        }));
      } else if (data.type === 'user_left') {
        dispatch(addNotification({
          type: 'info',
          message: `${data.username} left the session`,
        }));
      } else if (data.type === 'file_updated') {
        dispatch(addNotification({
          type: 'info',
          message: `${data.username} updated ${data.filename}`,
        }));
      }
    },
  });

  const joinRoom = useCallback((username: string) => {
    return sendMessage({
      type: 'join',
      username,
      roomId,
    });
  }, [sendMessage, roomId]);

  const leaveRoom = useCallback(() => {
    return sendMessage({
      type: 'leave',
      roomId,
    });
  }, [sendMessage, roomId]);

  const shareFile = useCallback((fileId: string, content: string) => {
    return sendMessage({
      type: 'share_file',
      fileId,
      content,
      roomId,
    });
  }, [sendMessage, roomId]);

  const updateFile = useCallback((fileId: string, changes: any) => {
    return sendMessage({
      type: 'update_file',
      fileId,
      changes,
      roomId,
    });
  }, [sendMessage, roomId]);

  return {
    ...wsState,
    joinRoom,
    leaveRoom,
    shareFile,
    updateFile,
  };
};
