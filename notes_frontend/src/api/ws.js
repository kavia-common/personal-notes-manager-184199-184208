import { config } from './config';

let socket = null;

// PUBLIC_INTERFACE
export function connectWS({ onOpen, onClose, onMessage, onError } = {}) {
  if (!config.wsUrl) return () => {};
  try {
    socket = new WebSocket(config.wsUrl);
    if (onOpen) socket.addEventListener('open', onOpen);
    if (onClose) socket.addEventListener('close', onClose);
    if (onMessage) socket.addEventListener('message', onMessage);
    if (onError) socket.addEventListener('error', onError);
    return () => {
      if (!socket) return;
      if (onOpen) socket.removeEventListener('open', onOpen);
      if (onClose) socket.removeEventListener('close', onClose);
      if (onMessage) socket.removeEventListener('message', onMessage);
      if (onError) socket.removeEventListener('error', onError);
    };
  } catch {
    return () => {};
  }
}

// PUBLIC_INTERFACE
export function disconnectWS() {
  if (socket) {
    try { socket.close(); } catch { /* noop */ }
    socket = null;
  }
}
