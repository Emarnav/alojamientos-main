// 🧪 Utilidad para autenticación de prueba
// ⚠️ SOLO para desarrollo y testing de producción

export interface TestUser {
  name: string;
  email: string;
  role: string;
  token: string;
}

// Usuarios de prueba con tokens pre-generados
export const testUsers: TestUser[] = [
  {
    name: "Usuario Estudiante",
    email: "estudiante@gmail.com",
    role: "Estudiante",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXN0dWRlbnQtMDAxIiwiZW1haWwiOiJlc3R1ZGlhbnRlQGdtYWlsLmNvbSIsIm5hbWUiOiJVc3VhcmlvIEVzdHVkaWFudGUiLCJjdXN0b206cm9sZSI6IkVzdHVkaWFudGUiLCJ0b2tlbl91c2UiOiJpZCIsImlhdCI6MTc1NTk3MDIxOSwiZXhwIjoxNzU2MDU2NjE5LCJpc3MiOiJ0ZXN0LWlzc3VlciIsImF1ZCI6InRlc3QtYXVkaWVuY2UifQ.Rum_tlCVvqEUOdQPmKxMnLLoBDfuC9xy8HKfEwCQrAM"
  },
  {
    name: "Usuario Propietario", 
    email: "propietario@gmail.com",
    role: "Propietario",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LW93bmVyLTAwMSIsImVtYWlsIjoicHJvcGlldGFyaW9AZ21haWwuY29tIiwibmFtZSI6IlVzdWFyaW8gUHJvcGlldGFyaW8iLCJjdXN0b206cm9sZSI6IlByb3BpZXRhcmlvIiwidG9rZW5fdXNlIjoiaWQiLCJpYXQiOjE3NTU5NzAyMTksImV4cCI6MTc1NjA1NjYxOSwiaXNzIjoidGVzdC1pc3N1ZXIiLCJhdWQiOiJ0ZXN0LWF1ZGllbmNlIn0.9tZN0vSSafb7sRvSClvzBOdnyuVJia_fI2WMoSQyKEQ"
  },
  {
    name: "Usuario Administrador",
    email: "administrador@gmail.com", 
    role: "Admin",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWFkbWluLTAwMSIsImVtYWlsIjoiYWRtaW5pc3RyYWRvckBnbWFpbC5jb20iLCJuYW1lIjoiVXN1YXJpbyBBZG1pbmlzdHJhZG9yIiwiY3VzdG9tOnJvbGUiOiJBZG1pbiIsInRva2VuX3VzZSI6ImlkIiwiaWF0IjoxNzU1OTcwMjE5LCJleHAiOjE3NTYwNTY2MTksImlzcyI6InRlc3QtaXNzdWVyIiwiYXVkIjoidGVzdC1hdWRpZW5jZSJ9.acseRxHUjeT_UItA5zZ1hjzZgr1edNdV0jSAt2eNoDk"
  }
];

// Función para obtener usuario por email
export const getTestUserByEmail = (email: string): TestUser | undefined => {
  return testUsers.find(user => user.email === email);
};

// Función para obtener usuario por rol
export const getTestUserByRole = (role: string): TestUser | undefined => {
  return testUsers.find(user => user.role.toLowerCase() === role.toLowerCase());
};

// Simular objeto user de Amplify para compatibilidad
export const createMockAmplifyUser = (testUser: TestUser) => {
  return {
    username: testUser.email,
    attributes: {
      email: testUser.email,
      name: testUser.name,
      "custom:role": testUser.role
    },
    // Método para obtener el token
    getSignInUserSession: () => ({
      getIdToken: () => ({
        getJwtToken: () => testUser.token,
        toString: () => testUser.token
      })
    })
  };
};

// Headers de autorización para requests
export const getAuthHeaders = (testUser: TestUser) => {
  return {
    'Authorization': `Bearer ${testUser.token}`,
    'Content-Type': 'application/json'
  };
};

// Función para cambiar usuario de prueba (simular login)
export const switchTestUser = (email: string) => {
  const user = getTestUserByEmail(email);
  if (user) {
    localStorage.setItem('testUser', JSON.stringify(user));
    console.log(`🧪 Cambiado a usuario de prueba: ${user.name} (${user.role})`);
    return user;
  }
  return null;
};

// Función para obtener usuario actual
export const getCurrentTestUser = (): TestUser | null => {
  const stored = localStorage.getItem('testUser');
  return stored ? JSON.parse(stored) : null;
};

// Función para logout de prueba
export const testLogout = () => {
  localStorage.removeItem('testUser');
  console.log('🧪 Logout de prueba realizado');
};