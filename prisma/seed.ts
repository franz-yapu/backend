// seed-with-sample-data.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando proceso de seeding con datos de prueba...');

  // Crear roles si no existen
  const roles = await prisma.role.createMany({
    data: [
      { 
        name: 'ADMIN',
        id: '0016a126-83a1-45e6-81d0-31b9afd607a7' 
      },
      { 
        name: 'TEACHER',
        id: '30a3f3c0-c20e-4673-a4fc-80614cda35d2'
      },
      { 
        name: 'TUTOR',
        id: '0c1a1563-e562-400a-b900-03f04e012ad7'
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Roles creados/verificados');

  // Crear materias si no existen
  const subjects = await prisma.subject.createMany({
    data: [
      {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-comunicacion123',
        name: 'Comunicación y Lenguaje',
        description: 'Castellana, Originaria y Lengua Extranjera'
      },
      {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-cienciasnaturales',
        name: 'Ciencias Naturales',
        description: 'Ciencias de la Naturaleza y Medio Ambiente'
      },
      {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-educacionfisica',
        name: 'Educación Física y Deportes',
        description: 'Actividad física y desarrollo deportivo'
      },
      {
        id: '4d5e6f7g-8h9i-0j1k-2l3m-educacionmusical',
        name: 'Educación Musical',
        description: 'Música y expresión artística auditiva'
      },
      {
        id: '5e6f7g8h-9i0j-1k2l-3m4n-artesplasticas',
        name: 'Artes Plásticas y Visuales',
        description: 'Expresión artística visual y plástica'
      },
      {
        id: '6f7g8h9i-0j1k-2l3m-4n5o-matematica',
        name: 'Matemática',
        description: 'Matemáticas y lógica'
      },
      {
        id: '7g8h9i0j-1k2l-3m4n-5o6p-tecnologiatecnica',
        name: 'Técnica Tecnológica',
        description: 'Tecnología y herramientas digitales'
      },
      {
        id: '8h9i0j1k-2l3m-4n5o-6p7q-cienciassociales',
        name: 'Ciencias Sociales',
        description: 'Historia, Geografía y Sociedad'
      },
      {
        id: '9i0j1k2l-3m4n-5o6p-7q8r-valoresespirituales',
        name: 'Valores, Espiritualidad y Religiones',
        description: 'Formación en valores y desarrollo espiritual'
      }
    ],
    skipDuplicates: true
  });

  console.log(`✅ ${subjects.count} materias creadas/verificadas`);

  // Datos de usuarios de prueba
  const usersData = [
    // Admin
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      username: 'admin',
      email: 'admin@school.edu',
      dni: '12345678A',
      firstName: 'Ana',
      lastName: 'García López',
      password: 'sample',
      phone: '+52 55 1234 5678',
      address: 'Av. Universidad 123, CDMX',
      role: 'ADMIN'
    },
    // Teachers
    {
      id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
      username: 'profe.maria',
      email: 'maria.rodriguez@school.edu',
      dni: '23456789B',
      firstName: 'María',
      lastName: 'Rodríguez Hernández',
      password: 'password123',
      phone: '+52 55 2345 6789',
      address: 'Calle Profesores 45, CDMX',
      role: 'TEACHER'
    },
    {
      id: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
      username: 'profe.carlos',
      email: 'carlos.mendoza@school.edu',
      dni: '34567890C',
      firstName: 'Carlos',
      lastName: 'Mendoza Silva',
      password: 'password123',
      phone: '+52 55 3456 7890',
      address: 'Av. Pedagogía 67, CDMX',
      role: 'TEACHER'
    },
    // Tutor
    {
      id: 'd4e5f6g7-h8i9-0123-defg-456789012345',
      username: 'tutor.juan',
      email: 'juan.perez@school.edu',
      dni: '45678901D',
      firstName: 'Juan',
      lastName: 'Pérez Martínez',
      password: 'password123',
      phone: '+52 55 4567 8901',
      address: 'Calle Familia 89, CDMX',
      role: 'TUTOR'
    }
  ];

  for (const userData of usersData) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });

    if (!existingUser) {
      const role = await prisma.role.findFirst({
        where: { name: userData.role }
      });

      if (role) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await prisma.user.create({
          data: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            dni: userData.dni,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: hashedPassword,
            phone: userData.phone,
            address: userData.address,
            status: 'active',
            roleId: role.id,
          }
        });

        console.log(`✅ Usuario ${userData.username} creado`);
      }
    } else {
      console.log(`📋 Usuario ${userData.username} ya existe`);
    }
  }

  // Crear profesores asociados a usuarios
  const teachersData = [
    {
      id: 't1e2a3c4-h5e6r7-8901-abcd-teachermaria123',
      userId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
      specialty: 'Lenguaje y Comunicación'
    },
    {
      id: 't2e3a4c5-h6e7r8-9012-bcde-teachercarlos456',
      userId: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
      specialty: 'Matemáticas y Ciencias'
    }
  ];

  for (const teacherData of teachersData) {
    const existingTeacher = await prisma.teacher.findFirst({
      where: { userId: teacherData.userId }
    });

    if (!existingTeacher) {
      await prisma.teacher.create({
        data: teacherData
      });
      console.log(`✅ Profesor ${teacherData.userId} creado`);
    } else {
      console.log(`📋 Profesor ${teacherData.userId} ya existe`);
    }
  }

  // Crear grados de ejemplo
  const gradesData = [
    {
      id: 'g1r2a3d4-e5f6-7890-abcd-grade1primaria',
      name: '1ro Primaria',
      level: 'Primaria',
      section: 'A',
      mainTeacherId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012'
    },
    {
      id: 'g2r3a4d5-e6f7-8901-bcde-grade4primaria',
      name: '4to Primaria',
      level: 'Primaria',
      section: 'B',
      mainTeacherId: 'c3d4e5f6-g7h8-9012-cdef-345678901234'
    }
  ];

  for (const gradeData of gradesData) {
    const existingGrade = await prisma.grade.findFirst({
      where: { 
        name: gradeData.name,
        section: gradeData.section
      }
    });

    if (!existingGrade) {
      await prisma.grade.create({
        data: gradeData
      });
      console.log(`✅ Grado ${gradeData.name} sección ${gradeData.section} creado`);
    } else {
      console.log(`📋 Grado ${gradeData.name} sección ${gradeData.section} ya existe`);
    }
  }

  console.log('🎉 Proceso de seeding completado');
  console.log('\n📋 Credenciales de acceso:');
  console.log('   👤 Admin: admin / sample');
  console.log('   👨‍🏫 Teacher: profe.maria / password123');
  console.log('   👨‍🏫 Teacher: profe.carlos / password123');
  console.log('   👨‍💼 Tutor: tutor.juan / password123');
  console.log('\n📚 Materias creadas:');
  console.log('   1. Comunicación y Lenguaje');
  console.log('   2. Ciencias Naturales');
  console.log('   3. Educación Física y Deportes');
  console.log('   4. Educación Musical');
  console.log('   5. Artes Plásticas y Visuales');
  console.log('   6. Matemática');
  console.log('   7. Técnica Tecnológica');
  console.log('   8. Ciencias Sociales');
  console.log('   9. Valores, Espiritualidad y Religiones');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });