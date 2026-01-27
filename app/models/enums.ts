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
  branch = "sucursales",
  category = "categorias",
  customer = "clientes",
  sale = "ventas",
  input = "entradas",
  kardex = "kardex",
  order = "ordenes",
  permission = "permisos",
  product = "productos",
  presentation = "presentaciones",
  role = "roles",
  staff = "staffs",
  user = "usuarios",
  price = "precios",
  output = "salidas",
  transfer = "transferencias",
  brand = "marcas",
  provider = "proveedores",
  report = "reportes",
  delivery = "entregas",
  inventory = "inventarios",
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

export enum TypeUnit {
  UNIDAD = "UNIDAD",
  CAJA = "CAJA",
}