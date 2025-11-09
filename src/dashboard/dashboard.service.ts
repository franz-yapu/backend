// dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [faltasPorCurso, faltasPorMes, notasPorCurso, comportamientoPorCurso, notasFiltradas] = await Promise.all([
      this.getFaltasYAtrasosPorCurso(),
      this.getFaltasYAtrasosPorMes(),
      this.getPromedioNotasPorCurso(),
      this.getComportamientoPorCurso(),
      this.getNotasFiltradas()
    ]);

    return [faltasPorCurso, faltasPorMes, notasPorCurso, comportamientoPorCurso, notasFiltradas];
  }

  async getDashboardPorCurso(cursoId: string) {
    const [faltasCurso, faltasMes, comportamientoCurso] = await Promise.all([
      this.getFaltasYAtrasosPorCursoEspecifico(cursoId),
      this.getFaltasYAtrasosPorMesEspecifico(cursoId),
      this.getComportamientoPorCursoEspecifico(cursoId)
    ]);

    return [faltasCurso, faltasMes, comportamientoCurso];
  }

  // Método para obtener todos los niveles disponibles
  private async getNivelesDisponibles() {
    const niveles = await this.prisma.grade.findMany({
      select: {
        level: true
      },
      distinct: ['level'],
      orderBy: {
        level: 'asc'
      }
    });
    
    return niveles.map(n => n.level);
  }

  private async getFaltasYAtrasosPorCurso() {
    const data = await this.prisma.grade.findMany({
      include: {
        students: {
          include: {
            attendances: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { section: 'asc' }
      ]
    });

    const niveles = await this.getNivelesDisponibles();

    const result = data.map((grade) => {
      let faltas = 0;
      let atrasos = 0;

      grade.students.forEach((student) => {
        student.attendances.forEach((att) => {
          if (att.status === 'absent') faltas++;
          if (att.status === 'late') atrasos++;
        });
      });

      return {
        curso: `${grade.level}° ${grade.section}`,
        name: grade.name,
        level: grade.level,
        section: grade.section,
        faltas,
        atrasos,
      };
    });

    // Ordenar por nivel y sección
    result.sort((a, b) => {
      const levelCompare = a.level.localeCompare(b.level);
      if (levelCompare !== 0) return levelCompare;
      return a.section.localeCompare(b.section);
    });

    return {
      id: 'faltas-curso',
      title: 'Faltas y Atrasos por Curso',
      type: 'filtrable',
      filters: {
        niveles: niveles
      },
      data: result,
      options: {
        tooltip: { 
          trigger: 'axis'
        },
        legend: { 
          data: ['Faltas', 'Atrasos'],
          top: '0%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: { 
          type: 'category', 
          data: result.map(r => r.curso),
          axisLabel: {
            interval: 0,
            rotate: 45,
            margin: 15,
            fontSize: 10
          }
        },
        yAxis: { 
          type: 'value',
          name: 'Cantidad'
        },
        series: [
          { 
            name: 'Faltas', 
            type: 'bar', 
            data: result.map(r => r.faltas), 
            color: '#F44336',
            barWidth: '40%'
          },
          { 
            name: 'Atrasos', 
            type: 'bar', 
            data: result.map(r => r.atrasos), 
            color: '#FF9800',
            barWidth: '40%'
          },
        ],
      },
    };
  }

  private async getFaltasYAtrasosPorMes() {
    const data = await this.prisma.attendance.findMany({
      select: { date: true, status: true },
    });

    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const faltasPorMes = new Array(12).fill(0);
    const atrasosPorMes = new Array(12).fill(0);

    data.forEach((att) => {
      const mes = att.date.getMonth();
      if (att.status === 'absent') faltasPorMes[mes]++;
      if (att.status === 'late') atrasosPorMes[mes]++;
    });

    return {
      id: 'faltas-mes',
      title: 'Faltas y Atrasos por Mes',
      options: {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Faltas', 'Atrasos'] },
        xAxis: { type: 'category', data: meses },
        yAxis: { type: 'value' },
        series: [
          { name: 'Faltas', type: 'line', data: faltasPorMes, color: '#E91E63' },
          { name: 'Atrasos', type: 'line', data: atrasosPorMes, color: '#9C27B0' },
        ],
      },
    };
  }

  private async getPromedioNotasPorCurso() {
    const data = await this.prisma.grade.findMany({
      include: {
        academicRecord: true,
      },
      orderBy: [
        { level: 'asc' },
        { section: 'asc' }
      ]
    });

    const result = data.map((grade) => {
      let total = 0;
      let count = 0;

      grade.academicRecord.forEach((record) => {
        const notas = [record.grade1, record.grade2, record.grade3, record.finalGrade]
          .filter((n) => n !== null && n !== undefined);

        if (notas.length > 0) {
          total += notas.reduce((a, b) => a + b, 0) / notas.length;
          count++;
        }
      });

      const promedio = count > 0 ? total / count : 0;

      return {
        curso: `${grade.level}° ${grade.section}`,
        level: grade.level,
        section: grade.section,
        promedio: Number(promedio.toFixed(2)),
      };
    });

    return {
      id: 'notas-curso',
      title: 'Promedio de Notas por Curso',
      options: {
        tooltip: { trigger: 'axis' },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: { 
          type: 'value', 
          min: 0, 
          max: 100 
        },
        yAxis: { 
          type: 'category', 
          data: result.map(r => r.curso),
          axisLabel: {
            interval: 0,
            fontSize: 10
          }
        },
        series: [
          {
            name: 'Promedio',
            type: 'bar',
            data: result.map(r => r.promedio),
            itemStyle: { color: '#2196F3' },
            label: {
              show: true,
              position: 'right',
              formatter: '{c}'
            },
          },
        ],
      },
    };
  }

  private async getComportamientoPorCurso() {
    const data = await this.prisma.grade.findMany({
      include: {
        students: {
          include: {
            behaviors: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { section: 'asc' }
      ]
    });

    const niveles = await this.getNivelesDisponibles();

    const result = data.map((grade) => {
      const conteo = { '1': 0, '2': 0, '3': 0 };

      grade.students.forEach((student) => {
        student.behaviors.forEach((b) => {
          if (conteo[b.type as '1' | '2' | '3'] !== undefined) {
            conteo[b.type as '1' | '2' | '3']++;
          }
        });
      });

      return {
        curso: `${grade.level}° ${grade.section}`,
        name: grade.name,
        level: grade.level,
        section: grade.section,
        incidentes: conteo['1'],
        avisos: conteo['2'],
        reconocimientos: conteo['3'],
      };
    });

    // Ordenar por nivel y sección
    result.sort((a, b) => {
      const levelCompare = a.level.localeCompare(b.level);
      if (levelCompare !== 0) return levelCompare;
      return a.section.localeCompare(b.section);
    });

    return {
      id: 'comportamiento-curso',
      title: 'Comportamiento por Curso',
      type: 'filtrable',
      filters: {
        niveles: niveles
      },
      data: result,
      options: {
        tooltip: { 
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: { 
          data: ['Incidente Grave', 'Aviso', 'Reconocimiento'],
          top: '0%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: { 
          type: 'category', 
          data: result.map(r => r.curso),
          axisLabel: {
            interval: 0,
            rotate: 45,
            margin: 15,
            fontSize: 10
          }
        },
        yAxis: { 
          type: 'value',
          name: 'Cantidad'
        },
        series: [
          { 
            name: 'Incidente Grave', 
            type: 'bar', 
            stack: 'total', 
            data: result.map(r => r.incidentes), 
            color: '#F44336',
            barWidth: '60%'
          },
          { 
            name: 'Aviso', 
            type: 'bar', 
            stack: 'total', 
            data: result.map(r => r.avisos), 
            color: '#FF9800',
            barWidth: '60%'
          },
          { 
            name: 'Reconocimiento', 
            type: 'bar', 
            stack: 'total', 
            data: result.map(r => r.reconocimientos), 
            color: '#4CAF50',
            barWidth: '60%'
          },
        ],
      },
    };
  }

  private async getFaltasYAtrasosPorCursoEspecifico(cursoId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: cursoId },
      include: {
        students: {
          include: {
            attendances: true,
          },
        },
      },
    });

    if (!grade) {
      throw new Error('Curso no encontrado');
    }

    let faltas = 0;
    let atrasos = 0;

    grade.students.forEach((student) => {
      student.attendances.forEach((att) => {
        if (att.status === 'absent') faltas++;
        if (att.status === 'late') atrasos++;
      });
    });

    return {
      id: 'faltas-curso-especifico',
      title: `Faltas y Atrasos - ${grade.level}° ${grade.section}`,
      options: {
        tooltip: { trigger: 'item' },
        legend: { data: ['Faltas', 'Atrasos'] },
        series: [
          {
            name: 'Faltas y Atrasos',
            type: 'pie',
            radius: '50%',
            data: [
              { value: faltas, name: 'Faltas', itemStyle: { color: '#F44336' } },
              { value: atrasos, name: 'Atrasos', itemStyle: { color: '#FF9800' } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    };
  }

  private async getFaltasYAtrasosPorMesEspecifico(cursoId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: cursoId },
      include: {
        students: {
          include: {
            attendances: true,
          },
        },
      },
    });

    if (!grade) {
      throw new Error('Curso no encontrado');
    }

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const faltasPorMes = new Array(12).fill(0);
    const atrasosPorMes = new Array(12).fill(0);

    grade.students.forEach((student) => {
      student.attendances.forEach((att) => {
        const mes = att.date.getMonth();
        if (att.status === 'absent') faltasPorMes[mes]++;
        if (att.status === 'late') atrasosPorMes[mes]++;
      });
    });

    return {
      id: 'faltas-mes-especifico',
      title: `Faltas y Atrasos por Mes - ${grade.level}° ${grade.section}`,
      options: {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Faltas', 'Atrasos'] },
        xAxis: { type: 'category', data: meses },
        yAxis: { type: 'value' },
        series: [
          { name: 'Faltas', type: 'line', data: faltasPorMes, color: '#E91E63' },
          { name: 'Atrasos', type: 'line', data: atrasosPorMes, color: '#9C27B0' },
        ],
      },
    };
  }

  private async getPromedioNotasPorCursoEspecifico(cursoId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: cursoId },
      include: {
        academicRecord: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!grade) {
      throw new Error('Curso no encontrado');
    }

    const result = grade.academicRecord.map((record) => {
      const notas = [record.grade1, record.grade2, record.grade3, record.finalGrade]
        .filter((n) => n !== null && n !== undefined);

      const promedio = notas.length > 0 
        ? notas.reduce((a, b) => a + b, 0) / notas.length 
        : 0;

      return {
        estudiante: `${record.student.firstName} ${record.student.lastName}`,
        promedio: Number(promedio.toFixed(2)),
      };
    });

    return {
      id: 'notas-curso-especifico',
      title: `Promedio de Notas por Estudiante - ${grade.level}° ${grade.section}`,
      options: {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value', min: 0, max: 100 },
        yAxis: { type: 'category', data: result.map(r => r.estudiante) },
        series: [
          {
            name: 'Promedio',
            type: 'bar',
            data: result.map(r => r.promedio),
            itemStyle: { color: '#2196F3' },
            label: {
              show: true,
              position: 'right',
              formatter: '{c}',
            },
          },
        ],
      },
    };
  }

  private async getComportamientoPorCursoEspecifico(cursoId: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: cursoId },
      include: {
        students: {
          include: {
            behaviors: true,
          },
        },
      },
    });

    if (!grade) {
      throw new Error('Curso no encontrado');
    }

    const conteo = { '1': 0, '2': 0, '3': 0 };

    grade.students.forEach((student) => {
      student.behaviors.forEach((b) => {
        if (conteo[b.type as '1' | '2' | '3'] !== undefined) conteo[b.type as '1' | '2' | '3']++;
      });
    });

    return {
      id: 'comportamiento-curso-especifico',
      title: `Comportamiento - ${grade.level}° ${grade.section}`,
      options: {
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Comportamiento',
            type: 'pie',
            radius: '50%',
            data: [
              { value: conteo['1'], name: 'Incidente Grave', itemStyle: { color: '#F44336' } },
              { value: conteo['2'], name: 'Aviso', itemStyle: { color: '#FF9800' } },
              { value: conteo['3'], name: 'Reconocimiento', itemStyle: { color: '#4CAF50' } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    };
  }

  private async getNotasFiltradas() {
    const data = await this.prisma.academicRecord.findMany({
      include: {
        student: true,
        grade: true,
        subject: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Agrupar por curso, materia y profesor
    const agrupado = data.reduce((acc, record) => {
      const key = `${record.gradeId}-${record.subjectId}-${record.teacherId}`;
      
      if (!acc[key]) {
        acc[key] = {
          curso: record.grade.name,
          materia: record.subject.name,
          profesor: `${record.user.firstName || ''} ${record.user.lastName || ''}`.trim(),
          notas: [],
          promediosEstudiantes: []
        };
      }

      // Calcular promedio del estudiante
      const notasEstudiante = [record.grade1, record.grade2, record.grade3, record.finalGrade]
        .filter(n => n !== null && n !== undefined);
      
      const promedioEstudiante = notasEstudiante.length > 0 
        ? notasEstudiante.reduce((a, b) => a + b, 0) / notasEstudiante.length 
        : 0;

      acc[key].notas.push(...notasEstudiante);
      acc[key].promediosEstudiantes.push(promedioEstudiante);

      return acc;
    }, {});

    const result = Object.values(agrupado).map((grupo: any) => {
      const promedioGeneral = grupo.notas.length > 0 
        ? grupo.notas.reduce((a, b) => a + b, 0) / grupo.notas.length 
        : 0;

      const promedioEstudiantes = grupo.promediosEstudiantes.length > 0
        ? grupo.promediosEstudiantes.reduce((a, b) => a + b, 0) / grupo.promediosEstudiantes.length
        : 0;

      return {
        curso: grupo.curso,
        materia: grupo.materia,
        profesor: grupo.profesor,
        promedioGeneral: Number(promedioGeneral.toFixed(2)),
       
        cantidadNotas: grupo.notas.length,
        cantidadEstudiantes: grupo.promediosEstudiantes.length
      };
    });

    return {
      id: 'notas-filtradas',
      title: 'Promedios de Notas por Curso, Materia y Profesor',
      type: 'filtrable',
      filters: {
        cursos: [...new Set(result.map(r => r.curso))],
        materias: [...new Set(result.map(r => r.materia))],
        profesores: [...new Set(result.map(r => r.profesor))]
      },
      data: result,
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: { 
          data: ['Promedio General', 'Promedio por Estudiante'] 
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: result.map(r => `${r.curso}\n${r.materia}`),
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          name: 'Nota'
        },
        series: [
          {
            name: 'Promedio General',
            type: 'bar',
            data: result.map(r => r.promedioGeneral),
            itemStyle: { color: '#2196F3' },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          },
         /*  {
            name: 'Promedio por Estudiante',
            type: 'bar',
            data: result.map(r => r.promedioEstudiantes),
            itemStyle: { color: '#4CAF50' },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          } */
        ]
      }
    };
  }
}