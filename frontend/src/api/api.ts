const BASE_URL = "http://localhost:3000";

export const getServices = async () => {
  const res = await fetch(`${BASE_URL}/services`);
  return res.json();
};

export const getBestsReviews = async () => {
  const res = await fetch(`${BASE_URL}/repair-order-reviews/best-reviews`);
  return res.json();
};

// Login: devuelve token
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return res.json(); // { access_token: "..." }
};

// Registro: crea usuario
export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al registrarse');
  }

  return res.json();
};

// Obtener perfil con token
export const getProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Token inválido');
  }

  return res.json();
};
