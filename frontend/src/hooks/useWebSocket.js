import { useEffect, useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import { roomService } from '../services/roomService';

/**
 * Custom hook to handle real-time room communication via WebSockets (SockJS + STOMP) with E2EE.
 */
export const useWebSocket = (roomCode, token, currentUser) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!roomCode || !token) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL 
      ? `${import.meta.env.VITE_API_BASE_URL}/ws` 
      : 'http://localhost:8080/ws';

    // Initialize STOMP client over SockJS
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // Reconnect after 5 seconds if connection drops
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      setIsConnected(true);
      console.log('STOMP connected successfully to room:', roomCode);
      
      // Subscribe to target room messages
      stompClient.subscribe(`/topic/room/${roomCode}`, async (message) => {
        try {
          const body = JSON.parse(message.body);

          // Handle WebSocket seen messages
          if (body.messageType === 'SEEN') {
            const viewer = body.sender;
            setMessages((prev) => 
              prev.map((msg) => {
                if (msg.sender !== viewer && (!msg.seenBy || !msg.seenBy.includes(viewer))) {
                  return {
                    ...msg,
                    seenBy: [...(msg.seenBy || []), viewer]
                  };
                }
                return msg;
              })
            );
            return;
          }

          if (body.messageType === 'TEXT' && body.encryptedMessage) {
            try {
              body.encryptedMessage = await decryptMessage(body.encryptedMessage, roomCode);
            } catch (decErr) {
              console.error('Failed to decrypt incoming message:', decErr);
            }
          }

          if (body.replyToText) {
            try {
              body.replyToText = await decryptMessage(body.replyToText, roomCode);
            } catch (decErr) {
              console.error('Failed to decrypt incoming parent message:', decErr);
            }
          }

          setMessages((prev) => [...prev, {
            id: body.id,
            sender: body.sender,
            encryptedMessage: body.encryptedMessage,
            messageType: body.messageType,
            timestamp: body.sentAt || new Date().toISOString(),
            seenBy: body.seenBy || [],
            replyToId: body.replyToId,
            replyToSender: body.replyToSender,
            replyToText: body.replyToText
          }]);

          // Auto mark as seen if message is sent by someone else
          const currentUsername = currentUser?.username || currentUser?.email;
          if (body.sender !== currentUsername) {
            roomService.markMessagesAsSeen(roomCode).catch(err => {
              console.error('Failed to mark message as seen:', err);
            });
          }
        } catch (e) {
          console.error('STOMP message body parsing failed:', e);
        }
      });
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);
      console.log('STOMP disconnected.');
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP protocol error:', frame.headers['message']);
      toast.error('Real-time connection error. Retrying...');
    };

    clientRef.current = stompClient;

    // Load message history first, decrypt it, then activate socket connection
    const loadHistoryAndConnect = async () => {
      try {
        const history = await roomService.getRoomMessages(roomCode);
        const decryptedHistory = await Promise.all(
          history.map(async (msg) => {
            let plainText = msg.encryptedMessage;
            try {
              plainText = await decryptMessage(msg.encryptedMessage, roomCode);
            } catch (err) {
              console.error('Failed to decrypt history message:', err);
            }

            let parentText = msg.replyToText;
            if (parentText) {
              try {
                parentText = await decryptMessage(parentText, roomCode);
              } catch (err) {
                console.error('Failed to decrypt history parent message:', err);
              }
            }

            return {
              id: msg.id,
              sender: msg.sender,
              encryptedMessage: plainText,
              messageType: 'TEXT',
              timestamp: msg.sentAt,
              seenBy: msg.seenBy || [],
              replyToId: msg.replyToId,
              replyToSender: msg.replyToSender,
              replyToText: parentText
            };
          })
        );
        setMessages(decryptedHistory);
      } catch (err) {
        console.error('Failed to load message history:', err);
      }

      // Activate WebSocket connection
      if (clientRef.current) {
        clientRef.current.activate();
      }
    };

    loadHistoryAndConnect();

    // Cleanup connection on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setIsConnected(false);
      setMessages([]);
    };
  }, [roomCode, token, currentUser]);

  const sendMessage = useCallback(async (messageText, replyToId = null) => {
    if (!clientRef.current || !isConnected) {
      toast.error('Cannot send message. Connection is inactive.');
      return;
    }

    try {
      const encrypted = await encryptMessage(messageText, roomCode);

      const payload = {
        roomCode,
        encryptedMessage: encrypted,
        messageType: 'TEXT',
        replyToId: replyToId
      };

      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Message encryption failed:', err);
      toast.error('Failed to encrypt message before sending.');
    }
  }, [roomCode, isConnected]);

  return { messages, isConnected, sendMessage };
};
