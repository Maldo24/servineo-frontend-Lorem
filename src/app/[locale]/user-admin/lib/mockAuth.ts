// SIMULACION DE BACKEND

export const mockAuth = {
  // Simular login de admin
  adminLogin: async (email: string, password: string) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Credenciales hardcodeadas para desarrollo
    if (email === 'admin@servineo.com' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-admin-token-12345',
        admin: {
          id: 1,
          name: 'Administrador',
          email: email,
          role: 'admin',
        },
      };
    } else {
      return {
        success: false,
        message: 'Credenciales incorrectas',
      };
    }
  },

  // Verificar token de admin
  verifyAdminToken: async (token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (token === 'mock-admin-token-12345') {
      return {
        valid: true,
        admin: {
          id: 1,
          name: 'Administrador',
          role: 'admin',
        },
      };
    }
    return { valid: false };
  },

  // Obtener métricas para el dashboard
  getAdminMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      metrics: {
        totalUsers: 16772,
        activeJobs: 2367,
        revenue: 45600,
        totalSessions: 16772,
        searches: 2367,
        topSearch: 456,
        sessionStats: {
          requester: 8234,
          fixer: 5189,
          visitor: 3349,
        },
        popularSearches: [
          { term: 'Plomeria', count: 456 },
          { term: 'Electricista', count: 389 },
          { term: 'Carpinteria', count: 267 },
        ],
      },
    };
  },
};
