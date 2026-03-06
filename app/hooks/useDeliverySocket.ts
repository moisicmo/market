import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { coffeApi } from '@/services';
import { getEnvVariables } from '@/helpers';
import { useErrorStore } from '.';
import type { OrderModel } from '@/models';

const { VITE_HOST_BACKEND } = getEnvVariables();

export const useDeliverySocket = (branchId: string) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { handleError } = useErrorStore();

  const fetchInitial = async () => {
    try {
      const res = await coffeApi.get(`/order/delivery?branchId=${branchId}`);
      setOrders(res.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!branchId) return;

    fetchInitial();

    const socket = io(`${VITE_HOST_BACKEND}/delivery`, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('delivery:new', (order: OrderModel) => {
      if (order.branch.id === branchId) {
        setOrders((prev) => {
          if (prev.find((o) => o.id === order.id)) return prev;
          return [...prev, order];
        });
      }
    });

    socket.on('delivery:done', ({ id }: { id: string }) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId]);

  const deliverOrder = async (id: string) => {
    try {
      await coffeApi.patch(`/order/${id}/deliver`);
    } catch (error) {
      handleError(error);
    }
  };

  return { orders, connected, deliverOrder };
};
