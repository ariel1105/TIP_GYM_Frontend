import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { sendLocalNotification } from '@/services/notifications/sendLocalNotification';

export function useTurnNotification(activityIds: number[]) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);

  useEffect(() => {
    // Si no hay actividades para suscribirse, no conectar al WebSocket
    if (!activityIds || activityIds.length === 0) return;

    Notifications.requestPermissionsAsync();

    const socket = new SockJS('http://192.168.1.49:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log('WebSocket conectado');

      activityIds.forEach((activityId) => {
        const sub = client.subscribe(`/topic/activity/${activityId}`, (message) => {
          const turns = JSON.parse(message.body);
          console.log(`Turnos nuevos recibidos para actividad ${activityId}:`, turns);
          if (turns.length > 0) {
            const activityName = turns[0].activityName;
            sendLocalNotification(
              'Nuevos turnos disponibles',
              `Se han agregado ${turns.length} nuevos turnos a la actividad ${activityName}.`
            );
          }

        });

        subscriptionsRef.current.push(sub);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];
      client.deactivate();
    };
  }, [JSON.stringify(activityIds)]);

}