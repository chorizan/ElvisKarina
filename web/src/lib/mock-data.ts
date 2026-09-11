import type { Cita, CatalogoTratamiento } from '@/types/appointment'
import type { Presupuesto } from '@/types/budget'
import type { Consulta } from '@/types/consultation'
import type { Clinica, Paciente, Usuario } from '@/types/patient'

export const clinica: Clinica = {
  nombre: 'Clínica Dental Sonrisa',
  direccion: 'Av. Javier Prado 1234, San Isidro, Lima',
  telefono: '+51 1 555-0123',
  moneda: 'PEN',
}

export const usuarioActual: Usuario = {
  id: 'u1',
  nombre: 'Dr. Juan Pérez',
  email: 'juan.perez@sonrisa.pe',
  rol: 'odontologo',
}

export const pacientes: Paciente[] = [
  {
    id: 'p1',
    codigo: 'P000001',
    dni: '45678912',
    nombres: 'Juan',
    apellidos: 'Pérez García',
    fechaNacimiento: '1990-05-15',
    genero: 'Masculino',
    telefono: '999-888-777',
    email: 'juan.perez@email.com',
    direccion: 'Miraflores, Lima',
    alergias: 'Penicilina',
    antecedentes: 'Hipertensión controlada',
    ultimaVisita: '2026-09-01',
  },
  {
    id: 'p2',
    codigo: 'P000002',
    dni: '78912345',
    nombres: 'María',
    apellidos: 'López Torres',
    fechaNacimiento: '1985-11-22',
    genero: 'Femenino',
    telefono: '988-777-666',
    email: 'maria.lopez@email.com',
    ultimaVisita: '2026-08-28',
  },
  {
    id: 'p3',
    codigo: 'P000003',
    dni: '12345678',
    nombres: 'Carlos',
    apellidos: 'Ruiz Mendoza',
    fechaNacimiento: '1978-03-08',
    genero: 'Masculino',
    telefono: '977-666-555',
    email: 'carlos.ruiz@email.com',
    ultimaVisita: '2026-09-05',
  },
  {
    id: 'p4',
    codigo: 'P000004',
    dni: '87654321',
    nombres: 'Ana',
    apellidos: 'Vega Castro',
    fechaNacimiento: '1995-07-30',
    genero: 'Femenino',
    telefono: '966-555-444',
    ultimaVisita: '2026-08-15',
  },
  {
    id: 'p5',
    codigo: 'P000005',
    dni: '56781234',
    nombres: 'Dimas',
    apellidos: 'Rome Silva',
    fechaNacimiento: '1988-12-12',
    genero: 'Masculino',
    telefono: '955-444-333',
    email: 'dimas.rome@email.com',
    ultimaVisita: '2026-09-07',
  },
]

export const consultas: Consulta[] = [
  {
    id: 'c1',
    pacienteId: 'p1',
    odontologoId: 'u1',
    fecha: '2026-09-08T09:00:00',
    motivo: 'Dolor en molar superior derecho',
    evaluacion: 'Caries profunda pieza 16, lesión pieza 26',
    estado: 'en_curso',
    odontograma: [
      {
        id: 'o1',
        pieza: 16,
        superficie: 'O',
        diagnostico: 'caries',
        tratamiento: 'restauracion',
        prioridad: 'alta',
        enTratamiento: false,
        precio: 180,
      },
      {
        id: 'o2',
        pieza: 26,
        diagnostico: 'caries',
        tratamiento: 'endodoncia',
        prioridad: 'urgente',
        enTratamiento: true,
        precio: 650,
      },
    ],
  },
  {
    id: 'c2',
    pacienteId: 'p5',
    odontologoId: 'u1',
    fecha: '2026-09-07T10:30:00',
    motivo: 'Root canal - sesión 2',
    estado: 'completada',
    odontograma: [
      {
        id: 'o3',
        pieza: 37,
        diagnostico: 'endodoncia',
        tratamiento: 'endodoncia',
        prioridad: 'alta',
        enTratamiento: true,
        precio: 650,
      },
    ],
  },
  {
    id: 'c3',
    pacienteId: 'p2',
    odontologoId: 'u1',
    fecha: '2026-09-06T14:00:00',
    motivo: 'Evaluación general',
    estado: 'completada',
    odontograma: [],
  },
]

export const presupuestos: Presupuesto[] = [
  {
    id: 'b1',
    numero: 'PRO-000125',
    pacienteId: 'p1',
    consultaId: 'c1',
    fecha: '2026-09-08',
    vigencia: '2026-10-08',
    subtotal: 1730,
    descuento: 0,
    total: 1730,
    adelanto: 500,
    saldo: 1230,
    estado: 'borrador',
    detalles: [
      {
        id: 'd1',
        tratamiento: 'Restauración',
        pieza: 16,
        cantidad: 1,
        precioUnitario: 180,
        subtotal: 180,
      },
      {
        id: 'd2',
        tratamiento: 'Endodoncia',
        pieza: 26,
        cantidad: 1,
        precioUnitario: 650,
        subtotal: 650,
      },
      {
        id: 'd3',
        tratamiento: 'Corona',
        pieza: 26,
        cantidad: 1,
        precioUnitario: 900,
        subtotal: 900,
      },
    ],
  },
  {
    id: 'b2',
    numero: 'PRO-000124',
    pacienteId: 'p5',
    consultaId: 'c2',
    fecha: '2026-09-07',
    subtotal: 650,
    descuento: 0,
    total: 650,
    adelanto: 200,
    saldo: 450,
    estado: 'aceptado',
    detalles: [
      {
        id: 'd4',
        tratamiento: 'Endodoncia',
        pieza: 37,
        cantidad: 1,
        precioUnitario: 650,
        subtotal: 650,
      },
    ],
  },
]

const today = new Date()
const y = today.getFullYear()
const m = today.getMonth()

export const citas: Cita[] = [
  {
    id: 'a1',
    pacienteId: 'p1',
    odontologoId: 'u1',
    consultorio: 'Consultorio 1',
    fechaInicio: new Date(y, m, today.getDate(), 9, 0).toISOString(),
    fechaFin: new Date(y, m, today.getDate(), 10, 0).toISOString(),
    tratamiento: 'Endodoncia',
    motivo: 'Sesión endodoncia pieza 26',
    estado: 'confirmada',
  },
  {
    id: 'a2',
    pacienteId: 'p2',
    odontologoId: 'u1',
    consultorio: 'Consultorio 1',
    fechaInicio: new Date(y, m, today.getDate(), 10, 30).toISOString(),
    fechaFin: new Date(y, m, today.getDate(), 11, 0).toISOString(),
    tratamiento: 'Evaluación',
    estado: 'programada',
  },
  {
    id: 'a3',
    pacienteId: 'p3',
    odontologoId: 'u1',
    consultorio: 'Consultorio 2',
    fechaInicio: new Date(y, m, today.getDate(), 15, 0).toISOString(),
    fechaFin: new Date(y, m, today.getDate(), 16, 0).toISOString(),
    tratamiento: 'Limpieza dental',
    estado: 'programada',
  },
  {
    id: 'a4',
    pacienteId: 'p5',
    odontologoId: 'u1',
    consultorio: 'Consultorio 1',
    fechaInicio: new Date(y, m, today.getDate() + 1, 9, 0).toISOString(),
    fechaFin: new Date(y, m, today.getDate() + 1, 11, 0).toISOString(),
    tratamiento: 'Root Canal',
    estado: 'confirmada',
  },
  {
    id: 'a5',
    pacienteId: 'p4',
    odontologoId: 'u1',
    consultorio: 'Consultorio 2',
    fechaInicio: new Date(y, m, today.getDate() + 2, 11, 0).toISOString(),
    fechaFin: new Date(y, m, today.getDate() + 2, 12, 0).toISOString(),
    tratamiento: 'Blanqueamiento',
    estado: 'programada',
  },
]

export const catalogo: CatalogoTratamiento[] = [
  { id: 't1', codigo: 'REST-001', nombre: 'Restauración', categoria: 'Restaurativo', precioBase: 180, duracionMin: 45 },
  { id: 't2', codigo: 'ENDO-001', nombre: 'Endodoncia', categoria: 'Endodoncia', precioBase: 650, duracionMin: 90 },
  { id: 't3', codigo: 'CORO-001', nombre: 'Corona', categoria: 'Prótesis', precioBase: 900, duracionMin: 60 },
  { id: 't4', codigo: 'EXT-001', nombre: 'Extracción', categoria: 'Cirugía', precioBase: 120, duracionMin: 30 },
  { id: 't5', codigo: 'LIMP-001', nombre: 'Limpieza dental', categoria: 'Preventivo', precioBase: 150, duracionMin: 45 },
  { id: 't6', codigo: 'BLAN-001', nombre: 'Blanqueamiento', categoria: 'Estética', precioBase: 450, duracionMin: 60 },
  { id: 't7', codigo: 'IMPL-001', nombre: 'Implante', categoria: 'Implantología', precioBase: 2800, duracionMin: 120 },
  { id: 't8', codigo: 'RES-001', nombre: 'Resina compleja', categoria: 'Restaurativo', precioBase: 220, duracionMin: 50 },
  { id: 't9', codigo: 'SCAL-001', nombre: 'Scaling', categoria: 'Preventivo', precioBase: 130, duracionMin: 40 },
  { id: 't10', codigo: 'CONS-001', nombre: 'Consulta general', categoria: 'Preventivo', precioBase: 80, duracionMin: 30 },
]

export const dashboardStats = {
  citasHoy: 8,
  pacientesAtendidos: 325,
  pacientesAtendidosTrend: -16,
  citasPendientes: 12,
  ingresosMes: 12563.95,
  ingresosTrend: 20,
  presupuestosEmitidos: 45,
  presupuestosAceptados: 28,
  tratamientosEnCurso: 15,
}

export const revenueData = [
  { mes: 'Ene', ingresos: 8200, gastos: 5400 },
  { mes: 'Feb', ingresos: 9100, gastos: 5800 },
  { mes: 'Mar', ingresos: 7800, gastos: 5200 },
  { mes: 'Abr', ingresos: 10200, gastos: 6100 },
  { mes: 'May', ingresos: 11500, gastos: 6800 },
  { mes: 'Jun', ingresos: 9800, gastos: 5900 },
  { mes: 'Jul', ingresos: 10800, gastos: 6200 },
  { mes: 'Ago', ingresos: 11200, gastos: 6500 },
  { mes: 'Sep', ingresos: 12563, gastos: 8034 },
]

export const popularTreatments = [
  { name: 'Scaling', value: 125 },
  { name: 'Extracción', value: 15 },
  { name: 'Consulta', value: 12 },
  { name: 'Odontopediatría', value: 20 },
]

export function getPaciente(id: string) {
  return pacientes.find((p) => p.id === id)
}

export function getConsulta(id: string) {
  return consultas.find((c) => c.id === id)
}

export function getPresupuesto(id: string) {
  return presupuestos.find((p) => p.id === id)
}

export function getCitasPaciente(pacienteId: string) {
  return citas.filter((c) => c.pacienteId === pacienteId)
}

export function getPresupuestosPaciente(pacienteId: string) {
  return presupuestos.filter((p) => p.pacienteId === pacienteId)
}

export function getConsultasPaciente(pacienteId: string) {
  return consultas.filter((c) => c.pacienteId === pacienteId)
}
