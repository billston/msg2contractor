export interface Receptor {
  idReceptor: number;
  codigo: string;
  nombreCompleto: string;
  correoElectronico: string;
  firma?: string;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface GrupoReceptor {
  idGrupoReceptor: number;
  nombre: string;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface Miembro {
  idMiembro: number;
  idGrupoReceptor: number;
  idReceptor: number;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface EstadoComunicado {
  idEstadoComunicado: number;
  nombre: string;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface Comunicado {
  idComunicado: number;
  tipoReceptor: number;
  idGrupoReceptor?: number;
  destinatario: string;
  asunto: string;
  contenido: string;
  adjunto?: string;
  fechaEmision?: string;
  fechaVencimiento?: string;
  confirmacionRecepcion: boolean;
  solicitarRespuesta: boolean;
  idEstadoComunicado: number;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface EstadoNotificacion {
  idEstadoNotificacion: number;
  nombre: string;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}

export interface Notificacion {
  idNotificacion: number;
  idComunicado: number;
  idReceptor: number;
  fechaEmision: string;
  fechaRecepcion?: string;
  fechaRespuesta?: string;
  respuesta?: string;
  adjunto?: string;
  idEstadoNotificacion: number;
  fechaCreacion: string;
  creadoPor: string;
  fechaActualizacion?: string;
  actualizadoPor?: string;
}