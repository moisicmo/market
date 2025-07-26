export enum Gender {
  MASCULINO = "masculino",
  FEMENINO = "femenino",
}
export enum EducationLevel {
  PRIMARIA = "primario",
  SECUNDARIA = "secundario",
}

export enum DayOfWeek {
  MONDAY = 'lunes',
  TUESDAY = 'martes',
  WEDNESDAY = 'miercoles',
  THURSDAY = 'jueves',
  FRIDAY = 'viernes',
  SATURDAY = 'sábado',
  SUNDAY = 'domingo',
}

export enum AcademicStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EGRESADO = 'egresado',
  TITULADO = 'titulado',
  MAESTRIA = 'maestria'
}

export enum TypeAction {
  manage = "manejar",
  create = "crear",
  read = "leer",
  update = "editar",
  delete = "eliminar",
}

export enum TypeSubject {
  all = "todo",
  permission = "permisos",
  role = "roles",
  staff = "staffs",
  student = "estudiantes",
  customer = "customeres",
  teacher = "profesores",
  assignmentRoom = "asignación de aulas",
  assignmentSchedule = "asignación de horarios",
  booking = "reservas",
  branch = "sucursales",
  room = "aulas",
  category = "especialidades",
  schedule = "horarios",
  inscription = "incripciones",
  Debt = "deudas de inscripción",
  payment = "pagos",
  invoice = "facturas",
  refund = "devoluciones",
  price = "precios",
}

export enum TypeDebt {
  BOOKING = "RESERVA",
  INSCRIPTION = "INSCRIPCIÓN",
  MONTH = "MENSUALIDAD",
  PER_SESSION = "POR SESIÓN",
}

export enum PayMethod {
  CASH = "EFECTIVO",
  BANK = "TRANSFERENCIA",
  QR = "PAGO QR",
} 