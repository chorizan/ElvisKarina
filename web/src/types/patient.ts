export interface Paciente {
  id: string
  codigo: string
  dni?: string
  nombres: string
  apellidos: string
  fechaNacimiento?: string
  genero?: string
  telefono?: string
  email?: string
  direccion?: string
  alergias?: string
  antecedentes?: string
  foto?: string
  notas?: string
  ultimaVisita?: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'admin' | 'odontologo' | 'recepcionista' | 'asistente'
}

export interface Clinica {
  nombre: string
  direccion: string
  telefono: string
  moneda: string
}
