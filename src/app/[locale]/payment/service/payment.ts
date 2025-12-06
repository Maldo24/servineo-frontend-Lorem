// --- Types compartidos UI ---
export type Status = 'paid' | 'pending' | 'failed';

// La UI siempre consumirá este shape uniforme
export type UISummary = {
  id: string;
  status: Status;
  code?: string | null;
  expiresAt?: string | null;
  amount: {
    total: number;
    currency: string;
  };
};

// --- Tipo para los datos que llegan del backend (flexible) ---
type BackendPaymentData = {
  id?: string;
  _id?: string;
  status?: string;
  code?: string;
  expiresAt?: string;
  total?: number;
  amount?: {
    total?: number;
    currency?: string;
  };
  currency?: string;
  [key: string]: unknown; // Para permitir otras propiedades
};

// --- Helper base: SIEMPRE rutas relativas para pasar por el proxy /api ---
async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const opts: RequestInit = {
    cache: 'no-store',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  };
  if (init?.json !== undefined) {
    opts.body = JSON.stringify(init.json);
  }

  const res = await fetch(`/api${path}`, opts);

  if (!res.ok) {
    const raw = await res.text().catch(() => '');
    let msg = raw;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        const j = JSON.parse(raw);
        msg = j?.error || j?.message || raw || `HTTP ${res.status}`;
      } catch {}
    }
    throw new Error(`${msg || 'Request failed'} (HTTP ${res.status})`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : ({} as T);
}

// --- Normalizador: adapta cualquier backend a UISummary uniforme ---
function normalizeSummary(d: BackendPaymentData | null | undefined): UISummary {
  if (!d) {
    return {
      id: '',
      status: 'pending' as Status,
      code: null,
      expiresAt: null,
      amount: {
        total: 0,
        currency: 'BOB',
      },
    };
  }

  const total =
    typeof d.total === 'number'
      ? d.total
      : typeof d.amount?.total === 'number'
        ? d.amount.total
        : 0;

  return {
    id: String(d.id ?? d._id ?? ''),
    status: (d.status ?? 'pending') as Status,
    code: d.code ?? null,
    expiresAt: d.expiresAt ?? null,
    amount: {
      total,
      currency: d.amount?.currency ?? d.currency ?? 'BOB',
    },
  };
}

// --- DTO de creación (cash) ---
export type CreateCashPaymentDTO = {
  jobId: string;
  payerId?: string;
  requesterId?: string;
  fixerId?: string;
  subTotal: number;
  service_fee?: number;
  discount?: number;
  currency?: 'BOB' | 'USD';
  paymentMethods?: 'cash' | 'qr' | 'card';
  commissionRate?: number;
};

// --- POST: crear pago (cash) ---
export async function createCashPayment(input: CreateCashPaymentDTO) {
  const payload = {
    jobId: input.jobId,
    ...(input.requesterId ? { requesterId: input.requesterId } : {}),
    ...(input.fixerId ? { fixerId: input.fixerId } : {}),
    ...(input.payerId ? { payerId: input.payerId } : {}),
    subTotal: input.subTotal,
    service_fee: input.service_fee ?? 0,
    discount: input.discount ?? 0,
    currency: input.currency ?? 'BOB',
    paymentMethods: input.paymentMethods ?? 'cash',
    commissionRate: input.commissionRate ?? 0.1,
  };

  return apiFetch<{ message: string; data: BackendPaymentData }>(`/lab/payments`, {
    method: 'POST',
    json: payload,
  });
}

// --- GET: summary por ID ---
export async function getPaymentSummaryById(id: string): Promise<UISummary> {
  const r = await apiFetch<{ data?: BackendPaymentData } | BackendPaymentData>(
    `/lab/payments/${id}/summary`,
  );
  const data = 'data' in r ? r.data : r;
  return normalizeSummary(data);
}

// --- GET: último summary por jobId ---
export async function getLastPaymentSummaryByJob(jobId: string): Promise<UISummary> {
  const r = await apiFetch<{ data?: BackendPaymentData } | BackendPaymentData>(
    `/lab/payments/by-job/${jobId}/summary`,
  );
  const data = 'data' in r ? r.data : r;
  return normalizeSummary(data);
}

// --- PATCH: confirmar pago ---
export async function confirmPayment(id: string, code: string) {
  return apiFetch<{
    message: string;
    data: {
      id: string;
      total: number;
      status: Status;
      paidAt?: string;
    };
  }>(`/lab/payments/${id}/confirm`, { method: 'PATCH', json: { code } });
}
