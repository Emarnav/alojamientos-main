import jwt from "jsonwebtoken";

// ⚠️ SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
const TEST_SECRET = "test-secret-key-only-for-development";

const testUsers = [
  {
    sub: "test-student-001",
    email: "estudiante@gmail.com", 
    name: "Usuario Estudiante",
    "custom:role": "Estudiante",
    token_use: "id" as const,
  },
  {
    sub: "test-owner-001", 
    email: "propietario@gmail.com",
    name: "Usuario Propietario", 
    "custom:role": "Propietario",
    token_use: "id" as const,
  },
  {
    sub: "test-admin-001",
    email: "administrador@gmail.com",
    name: "Usuario Administrador",
    "custom:role": "Admin", 
    token_use: "id" as const,
  },
];

function generateTestTokens() {
  console.log("🔐 Tokens JWT de prueba generados:\n");
  console.log("⚠️  IMPORTANTE: Estos tokens son SOLO para testing local\n");

  testUsers.forEach((user) => {
    const payload = {
      ...user,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      iss: "test-issuer",
      aud: "test-audience",
    };

    const token = jwt.sign(payload, TEST_SECRET);

    console.log(`👤 ${user.email} (${user["custom:role"]}):`);
    console.log(`Bearer ${token}\n`);
  });

  console.log("📝 Copia y pega estos tokens en el header Authorization de tus requests");
  console.log("🔧 Ejemplo: Authorization: Bearer <token>");
  console.log("\n⚠️  NOTA: Para que funcionen, necesitas temporalmente desactivar la verificación");
  console.log("   de Cognito o crear un endpoint de bypass para testing");
}

generateTestTokens();