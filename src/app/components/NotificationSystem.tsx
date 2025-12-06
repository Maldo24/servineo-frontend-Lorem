'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
    <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
  </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className='p-4 space-y-4'>
    {[1, 2, 3].map((i) => (
      <div key={i} className='animate-pulse'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0 w-2 h-2 rounded-full bg-gray-300 mt-2'></div>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='h-4 bg-gray-300 rounded w-20'></div>
              <div className='h-3 bg-gray-300 rounded w-16'></div>
            </div>
            <div className='h-4 bg-gray-300 rounded w-full'></div>
            <div className='h-4 bg-gray-300 rounded w-3/4'></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

type NotificationType =
  | 'todos'
  | 'whatsapp'
  | 'email'
  | 'citas'
  | 'ofertas_promociones'
  | 'billetera'
  | 'no_leidas';

interface INotification {
  _id: string;
  appointment_id?: string;
  recipient_phone?: string;
  notification_type?: 'whatsapp' | 'email' | 'citas' | 'ofertas' | 'billetera';
  message_content?: string;
  send_status?: string;
  error_details?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  users_id?: string;
  tipo?: string;
  estado?: string;
  creado?: string;
  siguiente?: string;
  saldo?: number;
  leido?: boolean;
  action_url?: string; // URL para redirección
}

const NOTIFICATIONS_PER_PAGE = 20;
const POLLING_INTERVAL = 5000; // 5 segundos para actualizaciones en tiempo real
const SKELETON_DELAY = 300; // ms antes de mostrar skeleton
const JOB_OFFERS_ROUTE = '/es/job-offer-list?sort=recent&page=1&limit=10';

const isSaldoNotification = (notification: INotification): boolean => {
  const tipoLower = notification.tipo?.toLowerCase() ?? '';
  return tipoLower.includes('saldo');
};

const filterNotificationsByRole = (
  notifications: INotification[],
  role: 'fixer' | 'requester',
): INotification[] =>
  notifications.filter((notification) => {
    const tipoLower = notification.tipo?.trim().toLowerCase();

    if (role === 'requester') {
      return !isSaldoNotification(notification) && notification.saldo === undefined;
    }

    if (tipoLower === 'desconexion 2 dias') {
      return false;
    }

    return true;
  });

interface NotificationSystemProps {
  userId?: string;
  userName?: string;
  isAuthenticated?: boolean;
  userRole?: 'fixer' | 'requester'; // NUEVO: rol del usuario
}

const normalizeApiBase = (rawBase?: string | null): string => {
  const fallback = 'http://localhost:8000';
  const sanitized = (rawBase && rawBase.trim()) || fallback;
  const withoutTrailingSlash = sanitized.replace(/\/+$/, '');
  if (withoutTrailingSlash.endsWith('/api')) {
    return withoutTrailingSlash;
  }
  return `${withoutTrailingSlash}/api`;
};

const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
const NOTIFICATIONS_API_URL = `${API_BASE_URL}/notifications`;
const OFFERS_COUNT_API_URL = `${API_BASE_URL}/offers/count-since`;
const PROMOTIONS_COUNT_API_URL = `${API_BASE_URL}/promotions/count-since`;

// Función para enmascarar datos sensibles
const maskSensitiveData = (text: string | undefined): string => {
  if (!text) return '';

  // Si parece un número de tarjeta (16 dígitos) o teléfono largo
  const cardPattern = /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?)(\d{4})/;
  const phonePattern = /(\d{4}[\s-]?\d{4}[\s-]?)(\d{4})/;

  if (cardPattern.test(text)) {
    return text.replace(cardPattern, '**** **** **** $2');
  }

  if (phonePattern.test(text) && text.length > 8) {
    const last4 = text.slice(-4);
    return `****${last4}`;
  }

  // Si contiene números de más de 8 dígitos, enmascarar
  if (/\d{9,}/.test(text)) {
    return text.replace(/\d(?=\d{4})/g, '*');
  }

  return text;
};

export default function NotificationSystem({
  userId,
  userName,
  isAuthenticated,
  userRole = 'requester',
}: NotificationSystemProps) {
  const API_URL = NOTIFICATIONS_API_URL;
  const [offersCountMap, setOffersCountMap] = useState<{ [key: string]: number }>({});
  const [promotionsCountMap, setPromotionsCountMap] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<NotificationType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notification_filter');
      return (saved as NotificationType) || 'todos';
    }
    return 'todos';
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState<INotification[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const canRequestProtectedData = Boolean(authToken && userId);
  const displayName =
    userName?.split(' ')[0] ?? userId ?? (userRole === 'fixer' ? 'fixer' : 'requester');
  const showLoginPrompt = !canRequestProtectedData;
  const storageKey = useCallback(
    (base: string) => (userId ? `${base}_${userId}` : `${base}_anonymous`),
    [userId],
  );

  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar estado persistido al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey('cached_notifications'), JSON.stringify(notifications));
    }

    setReadNotifications(new Set());
    setNotifications([]);
    setUnreadCount(0);
    setPage(1);

    let loadedReadNotifications = new Set<string>();

    const savedRead = localStorage.getItem(storageKey('read_notifications'));
    if (savedRead) {
      try {
        const readIds = JSON.parse(savedRead);
        loadedReadNotifications = new Set(readIds);
        setReadNotifications(loadedReadNotifications);
      } catch (e) {
        console.error('Error loading read notifications:', e);
      }
    }

    const savedNotifications = localStorage.getItem(storageKey('cached_notifications'));
    if (savedNotifications) {
      try {
        const cached = JSON.parse(savedNotifications);
        setNotifications(filterNotificationsByRole(cached, userRole));
      } catch (e) {
        console.error('Error loading cached notifications:', e);
      }
    }

    const savedPage = localStorage.getItem(storageKey('notification_page'));
    if (savedPage) {
      setPage(parseInt(savedPage, 10));
    }
  }, [storageKey, userRole]);

  useEffect(() => {
    setNotifications((prev) => {
      const filtered = filterNotificationsByRole(prev, userRole);
      if (filtered.length === prev.length) {
        let isSame = true;
        for (let i = 0; i < filtered.length; i += 1) {
          if (filtered[i] !== prev[i]) {
            isSame = false;
            break;
          }
        }
        if (isSame) {
          return prev;
        }
      }
      return filtered;
    });
  }, [userRole]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const token = localStorage.getItem('servineo_token');
      setAuthToken(token);
    } catch (error) {
      console.error('Error al recuperar el token de autenticación:', error);
      setAuthToken(null);
    }
  }, [userId, isAuthenticated]);

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} min`;
    return `hace ${Math.floor(seconds)} seg`;
  };

  const authorizedFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      if (!authToken) {
        throw new Error('AUTH_REQUIRED');
      }

      const headers = new Headers(init.headers || {});
      headers.set('Authorization', `Bearer ${authToken}`);

      return fetch(input, {
        ...init,
        headers,
      });
    },
    [authToken],
  );

  const syncPendingNotifications = useCallback(async () => {
    setPendingSync((currentPending) => {
      if (currentPending.length === 0 || !isOnline || !canRequestProtectedData) {
        return currentPending;
      }

      (async () => {
        try {
          for (const notification of currentPending) {
            await authorizedFetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(notification),
            });
          }
          setPendingSync([]);
        } catch (err) {
          console.error('Error syncing notifications:', err);
        }
      })();

      return currentPending;
    });
  }, [isOnline, canRequestProtectedData, authorizedFetch, API_URL]);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar cuando vuelve la conexión
  useEffect(() => {
    if (isOnline) {
      syncPendingNotifications();
    }
  }, [isOnline, syncPendingNotifications]);

  useEffect(() => {
    if (!canRequestProtectedData) {
      setNotifications([]);
      setUnreadCount(0);
      setHasLoadedOnce(false);
      setError(null);
    }
  }, [canRequestProtectedData]);

  // Guardar estado en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification_filter', filter);
      localStorage.setItem(
        storageKey('read_notifications'),
        JSON.stringify(Array.from(readNotifications)),
      );
      localStorage.setItem(storageKey('notification_page'), page.toString());
      if (notifications.length > 0) {
        localStorage.setItem(storageKey('cached_notifications'), JSON.stringify(notifications));
      } else {
        localStorage.removeItem(storageKey('cached_notifications'));
      }
    }
  }, [filter, readNotifications, page, notifications, storageKey]);

  // Función para cargar solo el contador de notificaciones no leídas según el filtro activo
  const fetchUnreadCount = useCallback(
    async (currentFilter: string = filter) => {
      if (!canRequestProtectedData) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await authorizedFetch(API_URL);
        if (!response.ok) {
          throw new Error('Error al cargar notificaciones');
        }

        const data: INotification[] = await response.json();
        const sanitizedData = filterNotificationsByRole(data, userRole);

        // Aplicar filtro si no es 'todos'
        let filteredData = sanitizedData;
        if (currentFilter !== 'todos' && currentFilter !== 'no_leidas') {
          if (currentFilter === 'ofertas_promociones') {
            // Solo para requester
            if (userRole === 'requester') {
              filteredData = sanitizedData.filter((n) => {
                if (!n.tipo || typeof n.tipo !== 'string') return false;
                const tipoLower = n.tipo.trim().toLowerCase();
                return tipoLower === 'oferta' || tipoLower === 'desconexion 2 dias';
              });
            } else {
              filteredData = [];
            }
          } else if (currentFilter === 'billetera') {
            // Solo para fixer
            if (userRole === 'fixer') {
              filteredData = sanitizedData.filter(
                (n) => n.tipo === 'billetera' || n.saldo !== undefined || isSaldoNotification(n),
              );
            } else {
              filteredData = [];
            }
          } else {
            filteredData = sanitizedData.filter((n) => {
              if (currentFilter === 'citas' && n.appointment_id) return true;
              if (n.notification_type) {
                return n.notification_type === currentFilter;
              }
              if (n.tipo) {
                return n.tipo === currentFilter;
              }
              return false;
            });
          }
        }

        // Calcular el total de notificaciones NO LEÍDAS según el filtro
        const totalUnreadCount = filteredData.filter(
          (n) => !(n.leido || readNotifications.has(n._id)),
        ).length;
        setUnreadCount(totalUnreadCount);
      } catch (err: unknown) {
        console.error('Error fetching unread count:', err);
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(storageKey('cached_notifications'));
          if (cached) {
            try {
              const cachedData: INotification[] = JSON.parse(cached);
              const sanitizedCached = filterNotificationsByRole(cachedData, userRole);
              let filteredCached = sanitizedCached;
              if (currentFilter !== 'todos' && currentFilter !== 'no_leidas') {
                filteredCached = sanitizedCached.filter((n: INotification) => {
                  if (currentFilter === 'citas' && n.appointment_id) return true;
                  if (currentFilter === 'ofertas_promociones' && userRole === 'requester') {
                    if (!n.tipo || typeof n.tipo !== 'string') return false;
                    const tipoLower = n.tipo.trim().toLowerCase();
                    return tipoLower === 'oferta' || tipoLower === 'desconexion 2 dias';
                  }
                  if (currentFilter === 'billetera' && userRole === 'fixer')
                    return (
                      n.tipo === 'billetera' || n.saldo !== undefined || isSaldoNotification(n)
                    );
                  if (n.notification_type) {
                    return n.notification_type === currentFilter;
                  }
                  if (n.tipo) {
                    return n.tipo === currentFilter;
                  }
                  return false;
                });
              }
              setUnreadCount(
                filteredCached.filter(
                  (n: INotification) => !(n.leido || readNotifications.has(n._id)),
                ).length,
              );
            } catch (e) {
              console.error('Error loading cached count:', e);
            }
          }
        }
      }
    },
    [
      readNotifications,
      filter,
      authorizedFetch,
      canRequestProtectedData,
      API_URL,
      userRole,
      storageKey,
    ],
  );

  const fetchNotifications = useCallback(
    async (currentFilter: string, currentPage: number = 1, append: boolean = false) => {
      if (!canRequestProtectedData) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        setLoadingMore(false);
        setShowSkeleton(false);
        return;
      }

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
        loadingTimeoutRef.current = setTimeout(() => {
          setShowSkeleton(true);
        }, SKELETON_DELAY);
      }

      try {
        const response = await authorizedFetch(API_URL);
        if (!response.ok) {
          throw new Error('Error al cargar notificaciones');
        }

        const data: INotification[] = await response.json();
        const sanitizedData = filterNotificationsByRole(data, userRole);

        let filteredData = sanitizedData;
        if (currentFilter !== 'todos') {
          if (currentFilter === 'no_leidas') {
            filteredData = sanitizedData.filter((n) => !(n.leido || readNotifications.has(n._id)));
          } else {
            filteredData = sanitizedData.filter((n) => {
              if (currentFilter === 'citas' && n.appointment_id) return true;
              if (currentFilter === 'ofertas_promociones' && userRole === 'requester') {
                if (n.tipo && typeof n.tipo === 'string') {
                  const tipoLower = n.tipo.trim().toLowerCase();
                  if (tipoLower === 'oferta' || tipoLower === 'desconexion 2 dias') return true;
                }
              }
              if (currentFilter === 'billetera' && userRole === 'fixer') {
                return n.tipo === 'billetera' || n.saldo !== undefined || isSaldoNotification(n);
              }
              if (n.notification_type) {
                return n.notification_type === currentFilter;
              }
              if (n.tipo) {
                return n.tipo === currentFilter;
              }
              return false;
            });
          }
        }

        const sortedData = filteredData.sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : a.creado
              ? new Date(a.creado).getTime()
              : 0;
          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : b.creado
              ? new Date(b.creado).getTime()
              : 0;
          return dateB - dateA;
        });

        if (!append) {
          const totalUnreadCount = sortedData.filter(
            (n) => !(n.leido || readNotifications.has(n._id)),
          ).length;
          setUnreadCount(totalUnreadCount);
        }

        const startIndex = 0;
        const endIndex = currentPage * NOTIFICATIONS_PER_PAGE;
        const paginatedData = sortedData.slice(startIndex, endIndex);

        if (append) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const newNotifications = paginatedData.filter((n) => !existingIds.has(n._id));
            return [...prev, ...newNotifications];
          });
        } else {
          setNotifications(paginatedData);
        }

        setHasMore(endIndex < sortedData.length);
        setPage(currentPage);

        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey('cached_notifications'), JSON.stringify(paginatedData));
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Error al cargar notificaciones');
        console.error('Error fetching notifications:', err);

        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(storageKey('cached_notifications'));
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              setNotifications(filterNotificationsByRole(cachedData, userRole));
            } catch (e) {
              console.error('Error loading cached data:', e);
            }
          }
        }
      } finally {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setLoading(false);
        setLoadingMore(false);
        setShowSkeleton(false);
      }
    },
    [readNotifications, authorizedFetch, canRequestProtectedData, API_URL, userRole, storageKey],
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchNotifications(filter, page + 1, true);
    }
  }, [filter, page, loadingMore, hasMore, fetchNotifications]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  useEffect(() => {
    fetchUnreadCount(filter);
  }, [fetchUnreadCount, filter]);

  useEffect(() => {
    fetchUnreadCount(filter);
  }, [readNotifications, filter, fetchUnreadCount]);

  useEffect(() => {
    if (isOpen && !hasLoadedOnce && canRequestProtectedData) {
      fetchNotifications(filter, 1, false);
      setHasLoadedOnce(true);
    }
  }, [isOpen, filter, fetchNotifications, hasLoadedOnce, canRequestProtectedData]);

  useEffect(() => {
    if (!isOpen || notifications.length === 0) return;
    notifications.forEach((notification) => {
      const tipoLower = notification.tipo?.trim().toLowerCase();
      const fechaCreacion = notification.creado || notification.createdAt;
      if (
        (tipoLower === 'oferta' || tipoLower === 'desconexion 2 dias') &&
        fechaCreacion &&
        userRole === 'requester'
      ) {
        if (offersCountMap[notification._id] === undefined) {
          fetch(`${OFFERS_COUNT_API_URL}?date=${encodeURIComponent(fechaCreacion)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && typeof data.count === 'number') {
                setOffersCountMap((prev) => ({ ...prev, [notification._id]: data.count }));
              } else {
                setOffersCountMap((prev) => ({ ...prev, [notification._id]: 0 }));
              }
            })
            .catch(() => {
              setOffersCountMap((prev) => ({ ...prev, [notification._id]: 0 }));
            });
        }
      }
    });
  }, [isOpen, notifications, offersCountMap, userRole]);

  useEffect(() => {
    if (!isOpen || notifications.length === 0) return;
    notifications.forEach((notification) => {
      const tipoLower = notification.tipo?.trim().toLowerCase();
      const fechaCreacion = notification.creado || notification.createdAt;
      if (tipoLower === 'desconexion 2 dias' && fechaCreacion && userRole === 'requester') {
        if (promotionsCountMap[notification._id] === undefined) {
          fetch(`${PROMOTIONS_COUNT_API_URL}?date=${encodeURIComponent(fechaCreacion)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && typeof data.count === 'number') {
                setPromotionsCountMap((prev) => ({ ...prev, [notification._id]: data.count }));
              } else {
                setPromotionsCountMap((prev) => ({ ...prev, [notification._id]: 0 }));
              }
            })
            .catch(() => {
              setPromotionsCountMap((prev) => ({ ...prev, [notification._id]: 0 }));
            });
        }
      }
    });
  }, [isOpen, notifications, promotionsCountMap, userRole]);

  const handleMarkAsRead = async (notification: INotification) => {
    if (!canRequestProtectedData) {
      return;
    }

    if (notification.leido || readNotifications.has(notification._id)) {
      handleNotificationClick(notification);
      return;
    }

    setReadNotifications((prev) => new Set(prev).add(notification._id));
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, leido: true } : n)),
    );

    try {
      const response = await authorizedFetch(`${API_URL}/${notification._id}/leido`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar notificación como leída');
      }
    } catch (err: unknown) {
      console.error('Error al marcar notificación como leída:', err);
      if (!isOnline) {
        setPendingSync((prev) => [...prev, notification]);
      }
    }

    if (notification.action_url || notification.appointment_id) {
      handleNotificationClick(notification);
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (notification.action_url) {
      router.push(notification.action_url);
      setIsOpen(false);
      return;
    }

    if (notification.appointment_id) {
      router.push(`/calendar`);
      setIsOpen(false);
      return;
    }

    if (notification.tipo && typeof notification.tipo === 'string' && userRole === 'requester') {
      const tipoLower = notification.tipo.trim().toLowerCase();
      if (
        tipoLower === 'oferta' ||
        tipoLower === 'desconexion 2 dias' ||
        filter === 'ofertas_promociones'
      ) {
        router.push(JOB_OFFERS_ROUTE);
        setIsOpen(false);
        return;
      }
    }
    if (filter === 'ofertas_promociones' && userRole === 'requester') {
      router.push(JOB_OFFERS_ROUTE);
      setIsOpen(false);
      return;
    }

    if (
      (notification.tipo === 'billetera' ||
        notification.notification_type === 'billetera' ||
        notification.saldo !== undefined ||
        isSaldoNotification(notification)) &&
      userRole === 'fixer'
    ) {
      router.push('/calendar');
      setIsOpen(false);
      return;
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filtrar opciones del select según el rol del usuario
  const availableFilters =
    userRole === 'fixer'
      ? ['todos', 'no_leidas', 'whatsapp', 'email', 'citas', 'billetera'] // sin ofertas_promociones
      : ['todos', 'no_leidas', 'whatsapp', 'email', 'citas', 'ofertas_promociones']; // sin billetera

  return (
    <div className='relative'>
      <button
        onClick={() => {
          setIsOpen((prev) => {
            if (!prev) {
              setHasLoadedOnce(false);
            }
            return !prev;
          });
        }}
        className='relative p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
        aria-label='Notificaciones'
        aria-expanded={isOpen}
        aria-haspopup='true'
        role='button'
        tabIndex={0}
      >
        <BellIcon className='w-6 h-6' />
        {unreadCount > 0 && (
          <span
            className='absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ring-2 ring-white font-bold'
            aria-label={`${unreadCount} notificaciones no leídas`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-50 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:-translate-x-[65%] sm:mt-2 pointer-events-none'
          role='dialog'
          aria-modal='true'
          aria-label='Panel de notificaciones'
        >
          <div
            className='fixed inset-0 bg-black bg-opacity-50 sm:hidden pointer-events-auto'
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={modalRef}
            className='fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-auto sm:left-0 sm:-translate-x-[65%] bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:w-96 max-w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col pointer-events-auto border-t sm:border border-gray-200'
          >
            <div className='flex items-center justify-between p-4 sm:p-4 border-b border-gray-200 bg-gray-50'>
              <div className='absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full sm:hidden' />

              <h2 className='text-lg font-semibold text-gray-900 mt-2 sm:mt-0'>Notificaciones</h2>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded mt-2 sm:mt-0'
                aria-label='Cerrar panel de notificaciones'
                tabIndex={0}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='p-3 sm:p-4 border-b border-gray-200 bg-white'>
              <div className='relative'>
                <label
                  htmlFor='notification-filter'
                  className='flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2'
                >
                  <FilterIcon className='w-4 h-4 text-gray-500' />
                  Filtrar por tipo
                </label>
                <select
                  id='notification-filter'
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as NotificationType);
                    setPage(1);
                    setHasMore(true);
                    setHasLoadedOnce(false);
                    fetchUnreadCount(e.target.value);
                  }}
                  disabled={showLoginPrompt}
                  className='w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  aria-label='Filtrar notificaciones por tipo'
                >
                  <option value='todos'>Todos</option>
                  <option value='no_leidas'>No leídas</option>
                  <option value='whatsapp'>WhatsApp</option>
                  <option value='email'>Email</option>
                  <option value='citas'>Citas</option>
                  {userRole === 'requester' && (
                    <option value='ofertas_promociones'>Ofertas y Promociones</option>
                  )}
                  {userRole === 'fixer' && <option value='billetera'>Billetera</option>}
                </select>
                <div className='absolute right-3 top-8 sm:top-9 pointer-events-none'>
                  <svg
                    className='w-5 h-5 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              ref={listRef}
              className='flex-1 overflow-y-auto'
              role='list'
              aria-label='Lista de notificaciones'
            >
              {showLoginPrompt ? (
                <div className='p-8 sm:p-8 text-center text-gray-600'>
                  <BellIcon className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                  <p className='text-base sm:text-lg font-semibold text-primary'>
                    INICIAR SESION ANTES
                  </p>
                  <p className='text-sm sm:text-base text-gray-500 mt-2'>
                    Necesitas iniciar sesión para ver tus notificaciones personalizadas.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className='p-4 text-center text-red-600 text-sm' role='alert'>
                      {error}
                    </div>
                  )}

                  {showSkeleton && loading && !loadingMore && <SkeletonLoader />}

                  {!loading && !showSkeleton && notifications.length === 0 && (
                    <div className='p-8 sm:p-8 text-center text-gray-500'>
                      <BellIcon className='w-12 h-12 mx-auto mb-2 text-gray-300' />
                      <p className='text-sm sm:text-base'>No hay notificaciones</p>
                    </div>
                  )}

                  {notifications.map((notification) => {
                    const isRead = notification.leido || readNotifications.has(notification._id);
                    const tipoLower = notification.tipo?.trim().toLowerCase();

                    // Para "desconexion 2 dias", crear AMBAS notificaciones (oferta y promociones) SOLO SI ES REQUESTER
                    if (tipoLower === 'desconexion 2 dias' && userRole === 'requester') {
                      const nombre = displayName;
                      const fechaCreacion = notification.creado || notification.createdAt;
                      let cantidad = offersCountMap[notification._id];
                      if (cantidad === undefined) cantidad = 0;
                      if (cantidad === null) cantidad = 0;
                      let cantidadPromos = promotionsCountMap?.[notification._id];
                      if (cantidadPromos === undefined) cantidadPromos = 0;
                      if (cantidadPromos === null) cantidadPromos = 0;

                      return (
                        <React.Fragment key={notification._id}>
                          {/* Notificación de OFERTAS */}
                          <div
                            onClick={() => handleMarkAsRead(notification)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleMarkAsRead(notification);
                              }
                            }}
                            className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                            }`}
                            role='listitem'
                            tabIndex={0}
                            aria-label={`Notificación personalizada para ofertas: ${nombre}`}
                          >
                            <div className='flex items-start gap-2 sm:gap-3'>
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${isRead ? 'bg-gray-300' : 'bg-blue-600'}`}
                                aria-hidden='true'
                              />
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center justify-between mb-1 gap-2'>
                                  <span className='text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 bg-orange-100 text-orange-800'>
                                    OFERTA
                                  </span>
                                  <span className='text-[10px] sm:text-xs text-gray-500 flex-shrink-0'>
                                    {fechaCreacion ? timeAgo(fechaCreacion) : 'Fecha no disponible'}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                                >
                                  Hola {nombre}
                                </p>
                                <p
                                  className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                                >
                                  {cantidad} nuevos trabajos públicos desde tu última visita
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Notificación de PROMOCIONES */}
                          <div
                            onClick={() => handleMarkAsRead(notification)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleMarkAsRead(notification);
                              }
                            }}
                            className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                            }`}
                            role='listitem'
                            tabIndex={0}
                            aria-label={`Notificación personalizada para promociones: ${nombre}`}
                          >
                            <div className='flex items-start gap-2 sm:gap-3'>
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${isRead ? 'bg-gray-300' : 'bg-blue-600'}`}
                                aria-hidden='true'
                              />
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center justify-between mb-1 gap-2'>
                                  <span className='text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 bg-green-100 text-green-800'>
                                    PROMOCIONES
                                  </span>
                                  <span className='text-[10px] sm:text-xs text-gray-500 flex-shrink-0'>
                                    {fechaCreacion ? timeAgo(fechaCreacion) : 'Fecha no disponible'}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                                >
                                  Hola {nombre}
                                </p>
                                <p
                                  className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                                >
                                  {cantidadPromos} nuevas promociones desde tu última visita
                                </p>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    }

                    // Para notificaciones de tipo "oferta" individuales SOLO SI ES REQUESTER
                    if (
                      (tipoLower === 'oferta' || filter === 'ofertas_promociones') &&
                      userRole === 'requester'
                    ) {
                      const nombre = displayName;
                      const fechaCreacion = notification.creado || notification.createdAt;
                      let cantidad = offersCountMap[notification._id];
                      if (cantidad === undefined) cantidad = 0;
                      if (cantidad === null) cantidad = 0;

                      return (
                        <div
                          key={notification._id}
                          onClick={() => handleMarkAsRead(notification)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleMarkAsRead(notification);
                            }
                          }}
                          className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                          role='listitem'
                          tabIndex={0}
                          aria-label={`Notificación personalizada para ofertas: ${nombre}`}
                        >
                          <div className='flex items-start gap-2 sm:gap-3'>
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${isRead ? 'bg-gray-300' : 'bg-blue-600'}`}
                              aria-hidden='true'
                            />
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1 gap-2'>
                                <span className='text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 bg-orange-100 text-orange-800'>
                                  OFERTA
                                </span>
                                <span className='text-[10px] sm:text-xs text-gray-500 flex-shrink-0'>
                                  {fechaCreacion ? timeAgo(fechaCreacion) : 'Fecha no disponible'}
                                </span>
                              </div>
                              <p
                                className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                              >
                                Hola {nombre}
                              </p>
                              <p
                                className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                              >
                                {cantidad} nuevos trabajos públicos desde tu última visita
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Para notificaciones de billetera SOLO SI ES FIXER
                    if (
                      (notification.tipo === 'billetera' ||
                        notification.saldo !== undefined ||
                        isSaldoNotification(notification)) &&
                      userRole === 'fixer'
                    ) {
                      return (
                        <div
                          key={notification._id}
                          onClick={() => handleMarkAsRead(notification)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleMarkAsRead(notification);
                            }
                          }}
                          className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                          role='listitem'
                          tabIndex={0}
                          aria-label={`Notificación de billetera`}
                        >
                          <div className='flex items-start gap-2 sm:gap-3'>
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${isRead ? 'bg-gray-300' : 'bg-blue-600'}`}
                              aria-hidden='true'
                            />
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1 gap-2'>
                                <span className='text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 bg-yellow-100 text-yellow-800'>
                                  BILLETERA
                                </span>
                                <span className='text-[10px] sm:text-xs text-gray-500 flex-shrink-0'>
                                  {notification.createdAt
                                    ? timeAgo(notification.createdAt)
                                    : notification.creado
                                      ? timeAgo(notification.creado)
                                      : 'Fecha no disponible'}
                                </span>
                              </div>
                              <p
                                className={`text-xs sm:text-sm ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}
                              >
                                {notification.message_content || `Tipo: ${notification.tipo}`}
                              </p>
                              {notification.saldo !== undefined && (
                                <p className='text-[10px] sm:text-xs text-gray-600 mt-1'>
                                  Saldo: {maskSensitiveData(notification.saldo.toString())}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Notificaciones genéricas para todos
                    return (
                      <div
                        key={notification._id}
                        onClick={() => handleMarkAsRead(notification)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleMarkAsRead(notification);
                          }
                        }}
                        className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                        }`}
                        role='listitem'
                        tabIndex={0}
                        aria-label={`Notificación ${isRead ? 'leída' : 'no leída'}: ${notification.message_content || notification.tipo || 'Sin contenido'}`}
                      >
                        <div className='flex items-start gap-2 sm:gap-3'>
                          <div
                            className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${
                              isRead ? 'bg-gray-300' : 'bg-blue-600'
                            }`}
                            aria-hidden='true'
                          />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between mb-1 gap-2'>
                              <span
                                className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 ${
                                  notification.notification_type === 'whatsapp'
                                    ? 'bg-green-100 text-green-800'
                                    : notification.notification_type === 'email'
                                      ? 'bg-blue-100 text-blue-800'
                                      : notification.notification_type === 'citas' ||
                                          notification.appointment_id
                                        ? 'bg-purple-100 text-purple-800'
                                        : notification.tipo
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {notification.notification_type
                                  ? notification.notification_type.toUpperCase()
                                  : notification.tipo
                                    ? notification.tipo.toUpperCase()
                                    : 'NOTIFICACIÓN'}
                              </span>
                              <span className='text-[10px] sm:text-xs text-gray-500 flex-shrink-0'>
                                {notification.createdAt
                                  ? timeAgo(notification.createdAt)
                                  : notification.creado
                                    ? timeAgo(notification.creado)
                                    : 'Fecha no disponible'}
                              </span>
                            </div>
                            {notification.message_content ? (
                              <p
                                className={`text-xs sm:text-sm ${
                                  isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                                } line-clamp-3`}
                              >
                                {maskSensitiveData(notification.message_content)}
                              </p>
                            ) : notification.tipo ? (
                              <div className='text-xs sm:text-sm'>
                                <p
                                  className={`${
                                    isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                                  }`}
                                >
                                  Tipo: {notification.tipo}
                                </p>
                                {notification.estado && (
                                  <p className='text-[10px] sm:text-xs text-gray-600 mt-1'>
                                    Estado: {notification.estado}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p
                                className={`text-xs sm:text-sm ${
                                  isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                                }`}
                              >
                                Notificación sin contenido
                              </p>
                            )}
                            {notification.recipient_phone && (
                              <p className='text-[10px] sm:text-xs text-gray-500 mt-1'>
                                Tel: {maskSensitiveData(notification.recipient_phone)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {loadingMore && (
                    <div className='p-4 text-center'>
                      <SpinnerIcon className='w-6 h-6 mx-auto text-blue-600' />
                    </div>
                  )}

                  {hasMore && !loadingMore && (
                    <div ref={observerTarget} className='h-4' aria-hidden='true' />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
