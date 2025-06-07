import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { sendLocalNotification } from '@/services/notifications/sendLocalNotification';

export function useTurnNotification(activityId: number) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    const socket = new SockJS('http://192.168.0.19:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log('WebSocket conectado');

      client.subscribe(`/topic/activity/${activityId}`, (message) => {
        const turns = JSON.parse(message.body);
        console.log('Turnos nuevos recibidos:', turns);

        sendLocalNotification("Nuevos turnos disponibles", `Se han agregado ${turns.length} nuevos turnos a la actividad.`);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [activityId]);
}