// src/utils/types.ts
// Tipos e interfaces centralizadas para el sistema de pagos

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type MessageType = 'error' | 'warning' | 'success' | 'info';

export interface Trabajo {
  jobId: string;
  titulo: string;
  descripcion: string;
  totalPagar: number;
  paymentStatus: PaymentStatus;
  fecha: string;
}

export interface PaymentAmount {
  total: number;
  currency: string;
}

export interface PaymentSummary {
  id: string;
  code: string | null;
  status: PaymentStatus;
  amount: PaymentAmount;
  codeExpired?: boolean;
  codeExpiresAt?: string;
  createdAt?: string;
}

export interface Message {
  type: MessageType;
  text: string;
}

export interface PaymentResponse {
  res: Response;
  resp: {
    error?: string;
    remainingAttempts?: number;
    unlocksAt?: string;
    waitMinutes?: number;
    [key: string]: unknown;
  };
}

export interface PaymentMethodCashFixerProps {
  trabajo: Trabajo;
  onClose: (completed?: boolean) => void;
  onBack: (options?: { refresh?: boolean }) => void;
}

export interface PaymentSuccessModalProps {
  onClose: () => void;
}

export interface JobCardProps {
  trabajo: Trabajo;
  onOpenPayment: (trabajo: Trabajo) => void;
}

export interface FetchFixerJobsResult {
  data: PaymentSummary[];
}
