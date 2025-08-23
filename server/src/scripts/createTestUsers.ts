import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Usuarios de prueba con cognitoId simulados
    const testUsers = [
      {
        cognitoId: "test-student-001",
        nombre: "Usuario Estudiante",
        email: "estudiante@gmail.com",
        telefono: "123456789",
        tipo: "Estudiante" as const,
      },
      {
        cognitoId: "test-owner-001", 
        nombre: "Usuario Propietario",
        email: "propietario@gmail.com",
        telefono: "987654321",
        tipo: "Propietario" as const,
      },
      {
        cognitoId: "test-admin-001",
        nombre: "Usuario Administrador", 
        email: "administrador@gmail.com",
        telefono: "555666777",
        tipo: "Admin" as const,
      },
    ];

    for (const userData of testUsers) {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.usuario.findUnique({
        where: { cognitoId: userData.cognitoId },
      });

      if (existingUser) {
        console.log(`✅ Usuario ${userData.email} ya existe, actualizando...`);
        await prisma.usuario.update({
          where: { cognitoId: userData.cognitoId },
          data: userData,
        });
      } else {
        console.log(`➕ Creando usuario ${userData.email}...`);
        await prisma.usuario.create({
          data: userData,
        });
      }
    }

    console.log("\n🎉 Usuarios de prueba creados exitosamente!");
    console.log("\n📋 Usuarios disponibles:");
    console.log("- estudiante@gmail.com (Estudiante) - cognitoId: test-student-001");
    console.log("- propietario@gmail.com (Propietario) - cognitoId: test-owner-001");  
    console.log("- administrador@gmail.com (Admin) - cognitoId: test-admin-001");

    console.log("\n🔑 Para usar estos usuarios, crea tokens JWT con estos cognitoId como 'sub'");

  } catch (error) {
    console.error("❌ Error creando usuarios de prueba:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();