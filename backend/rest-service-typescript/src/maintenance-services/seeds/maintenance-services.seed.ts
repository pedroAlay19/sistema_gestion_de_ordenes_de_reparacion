import { EquipmentType } from '../../equipments/entities/enums/equipment.enum';

export const maintenanceServicesSeed = [
  // ==================== SERVICIOS PARA LAPTOPS ====================
  {
    serviceName: 'Limpieza profunda de laptop',
    description: 'Limpieza interna completa del equipo, incluye ventiladores, disipadores y teclado',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP],
    notes: 'Incluye aplicación de pasta térmica nueva'
  },
  {
    serviceName: 'Cambio de pasta térmica',
    description: 'Reemplazo de pasta térmica del procesador y GPU (si aplica)',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP, EquipmentType.PC, EquipmentType.ALL_IN_ONE],
    notes: 'Mejora significativamente la temperatura del equipo'
  },
  {
    serviceName: 'Reemplazo de batería',
    description: 'Cambio de batería interna del dispositivo',
    basePrice: 45.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP, EquipmentType.CELLPHONE, EquipmentType.TABLET, EquipmentType.SMARTWATCH],
    notes: 'Precio no incluye la batería'
  },
  {
    serviceName: 'Reparación de bisagras',
    description: 'Reparación o reemplazo de bisagras dañadas',
    basePrice: 35.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP],
    notes: 'Puede requerir soldadura en algunos casos'
  },
  {
    serviceName: 'Reemplazo de pantalla LCD',
    description: 'Cambio de pantalla dañada o con píxeles muertos',
    basePrice: 60.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP, EquipmentType.CELLPHONE, EquipmentType.TABLET, EquipmentType.MONITOR],
    notes: 'Precio de mano de obra, pantalla no incluida'
  },
  {
    serviceName: 'Reemplazo de teclado',
    description: 'Cambio de teclado interno por daño o desgaste',
    basePrice: 30.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP],
    notes: 'Teclado no incluido en el precio'
  },
  {
    serviceName: 'Actualización de RAM',
    description: 'Instalación de memoria RAM adicional o reemplazo',
    basePrice: 15.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP, EquipmentType.PC, EquipmentType.ALL_IN_ONE],
    notes: 'Módulos de memoria no incluidos'
  },
  {
    serviceName: 'Instalación de SSD',
    description: 'Reemplazo de disco duro mecánico por SSD o instalación de SSD adicional',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.LAPTOP, EquipmentType.PC, EquipmentType.ALL_IN_ONE],
    notes: 'Incluye migración de sistema operativo si se requiere'
  },

  // ==================== SERVICIOS PARA PC ====================
  {
    serviceName: 'Limpieza profunda de PC de escritorio',
    description: 'Limpieza completa de gabinete, componentes internos y ventiladores',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.PC, EquipmentType.ALL_IN_ONE, EquipmentType.SERVER],
    notes: 'Incluye limpieza de fuente de poder'
  },
  {
    serviceName: 'Reemplazo de fuente de poder',
    description: 'Cambio de fuente de poder por falla o upgrade',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.PC, EquipmentType.SERVER],
    notes: 'Fuente de poder no incluida'
  },
  {
    serviceName: 'Instalación de tarjeta gráfica',
    description: 'Instalación y configuración de tarjeta gráfica dedicada',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.PC],
    notes: 'Incluye instalación de drivers'
  },
  {
    serviceName: 'Ensamblado de PC completo',
    description: 'Armado completo de computadora desde cero con componentes del cliente',
    basePrice: 50.00,
    applicableEquipmentTypes: [EquipmentType.PC],
    notes: 'Incluye instalación de sistema operativo y drivers'
  },
  {
    serviceName: 'Upgrade de procesador',
    description: 'Reemplazo de procesador por uno de mayor rendimiento',
    basePrice: 35.00,
    applicableEquipmentTypes: [EquipmentType.PC, EquipmentType.ALL_IN_ONE],
    notes: 'Incluye pasta térmica y verificación de compatibilidad'
  },

  // ==================== SERVICIOS PARA CELULARES ====================
  {
    serviceName: 'Cambio de pantalla táctil',
    description: 'Reemplazo de pantalla táctil rota o con fallas',
    basePrice: 40.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE, EquipmentType.TABLET],
    notes: 'Pantalla no incluida, se recomienda original'
  },
  {
    serviceName: 'Reparación de puerto de carga',
    description: 'Reparación o reemplazo de puerto de carga USB',
    basePrice: 30.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE, EquipmentType.TABLET, EquipmentType.SMARTWATCH],
    notes: 'Puede requerir microsoldadura'
  },
  {
    serviceName: 'Liberación y desbloqueo',
    description: 'Liberación de operadora o desbloqueo de equipo',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE, EquipmentType.TABLET],
    notes: 'Sujeto a disponibilidad según modelo'
  },
  {
    serviceName: 'Reemplazo de cámara',
    description: 'Cambio de cámara frontal o trasera dañada',
    basePrice: 35.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE, EquipmentType.TABLET],
    notes: 'Cámara no incluida en el precio'
  },
  {
    serviceName: 'Reparación de botones',
    description: 'Reparación o reemplazo de botones físicos (volumen, power, home)',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE, EquipmentType.TABLET, EquipmentType.SMARTWATCH],
    notes: 'Incluye limpieza de contactos'
  },
  {
    serviceName: 'Cambio de cristal trasero',
    description: 'Reemplazo de tapa trasera de vidrio rota',
    basePrice: 30.00,
    applicableEquipmentTypes: [EquipmentType.CELLPHONE],
    notes: 'Cristal no incluido'
  },

  // ==================== SERVICIOS PARA IMPRESORAS ====================
  {
    serviceName: 'Mantenimiento preventivo de impresora',
    description: 'Limpieza completa, lubricación y calibración de impresora',
    basePrice: 35.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER, EquipmentType.SCAMNER],
    notes: 'Incluye limpieza de cabezales y rodillos'
  },
  {
    serviceName: 'Destrabado de impresora',
    description: 'Reparación de atasco de papel y limpieza de rodillos',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Incluye revisión del sistema de alimentación'
  },
  {
    serviceName: 'Recarga de cartuchos',
    description: 'Recarga de cartuchos de tinta vacíos',
    basePrice: 15.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Solo cartuchos recargables'
  },
  {
    serviceName: 'Reseteo de chip de cartucho',
    description: 'Reseteo de contador de chip de cartucho',
    basePrice: 10.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Compatible con mayoría de modelos'
  },
  {
    serviceName: 'Instalación de sistema continuo',
    description: 'Instalación de sistema de tinta continua',
    basePrice: 45.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Sistema no incluido, requiere modelo compatible'
  },
  {
    serviceName: 'Reparación de fusor',
    description: 'Reparación o reemplazo de unidad fusora en impresoras láser',
    basePrice: 50.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Común en impresoras láser'
  },

  // ==================== SERVICIOS PARA TABLETS ====================
  {
    serviceName: 'Reemplazo de digitalizador',
    description: 'Cambio de touch screen sin cambiar LCD',
    basePrice: 35.00,
    applicableEquipmentTypes: [EquipmentType.TABLET],
    notes: 'Solo si LCD está funcional'
  },
  {
    serviceName: 'Actualización de software tablet',
    description: 'Actualización de sistema operativo y aplicaciones',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.TABLET, EquipmentType.CELLPHONE, EquipmentType.SMARTWATCH],
    notes: 'Incluye respaldo de datos'
  },

  // ==================== SERVICIOS PARA EQUIPOS DE RED ====================
  {
    serviceName: 'Configuración de router',
    description: 'Configuración inicial y optimización de router',
    basePrice: 30.00,
    applicableEquipmentTypes: [EquipmentType.ROUTER],
    notes: 'Incluye configuración de seguridad WiFi'
  },
  {
    serviceName: 'Configuración de red empresarial',
    description: 'Configuración de switch y red empresarial',
    basePrice: 80.00,
    applicableEquipmentTypes: [EquipmentType.ROUTER, EquipmentType.SWITCH, EquipmentType.SERVER],
    notes: 'Incluye documentación de red'
  },
  {
    serviceName: 'Actualización de firmware',
    description: 'Actualización de firmware de dispositivo de red',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.ROUTER, EquipmentType.SWITCH],
    notes: 'Mejora seguridad y rendimiento'
  },
  {
    serviceName: 'Reseteo y reconfiguración',
    description: 'Reseteo a valores de fábrica y reconfiguración completa',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.ROUTER, EquipmentType.SWITCH],
    notes: 'Incluye respaldo de configuración previa'
  },

  // ==================== SERVICIOS PARA SERVIDORES ====================
  {
    serviceName: 'Mantenimiento de servidor',
    description: 'Mantenimiento preventivo completo de servidor',
    basePrice: 100.00,
    applicableEquipmentTypes: [EquipmentType.SERVER],
    notes: 'Incluye limpieza, actualización y optimización'
  },
  {
    serviceName: 'Configuración RAID',
    description: 'Configuración de arreglo RAID para redundancia',
    basePrice: 75.00,
    applicableEquipmentTypes: [EquipmentType.SERVER],
    notes: 'Discos no incluidos'
  },
  {
    serviceName: 'Instalación de sistema operativo servidor',
    description: 'Instalación y configuración de Windows Server o Linux',
    basePrice: 60.00,
    applicableEquipmentTypes: [EquipmentType.SERVER],
    notes: 'Incluye configuración básica'
  },

  // ==================== SERVICIOS PARA PERIFÉRICOS ====================
  {
    serviceName: 'Limpieza de monitor',
    description: 'Limpieza profesional de pantalla y carcasa',
    basePrice: 10.00,
    applicableEquipmentTypes: [EquipmentType.MONITOR],
    notes: 'Incluye productos especializados'
  },
  {
    serviceName: 'Reparación de teclado mecánico',
    description: 'Reparación de switches o teclas de teclado mecánico',
    basePrice: 20.00,
    applicableEquipmentTypes: [EquipmentType.KEYBOARD],
    notes: 'Switches no incluidos'
  },
  {
    serviceName: 'Limpieza profunda de teclado',
    description: 'Desmontaje y limpieza completa de teclado',
    basePrice: 15.00,
    applicableEquipmentTypes: [EquipmentType.KEYBOARD],
    notes: 'Recomendado cada 6 meses'
  },
  {
    serviceName: 'Reparación de mouse',
    description: 'Reparación de clicks, scroll o sensor óptico',
    basePrice: 12.00,
    applicableEquipmentTypes: [EquipmentType.MOUSE],
    notes: 'Depende de la falla específica'
  },
  {
    serviceName: 'Calibración de webcam',
    description: 'Configuración y calibración de cámara web',
    basePrice: 15.00,
    applicableEquipmentTypes: [EquipmentType.WEBCAM],
    notes: 'Incluye instalación de drivers'
  },
  {
    serviceName: 'Calibración de escáner',
    description: 'Calibración y optimización de escáner',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.SCAMNER],
    notes: 'Mejora calidad de escaneo'
  },

  // ==================== SERVICIOS GENERALES DE SOFTWARE ====================
  {
    serviceName: 'Instalación de sistema operativo',
    description: 'Instalación completa de Windows, Linux o macOS',
    basePrice: 30.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE
    ],
    notes: 'Incluye drivers básicos'
  },
  {
    serviceName: 'Formateo completo',
    description: 'Formateo y reinstalación de sistema operativo',
    basePrice: 35.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE
    ],
    notes: 'Incluye respaldo de archivos importantes'
  },
  {
    serviceName: 'Eliminación de virus y malware',
    description: 'Limpieza profunda de virus, malware y programas maliciosos',
    basePrice: 30.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET
    ],
    notes: 'Incluye instalación de antivirus'
  },
  {
    serviceName: 'Recuperación de datos',
    description: 'Recuperación de archivos eliminados o de disco dañado',
    basePrice: 60.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.SERVER
    ],
    notes: 'Precio según complejidad, no garantiza 100% recuperación'
  },
  {
    serviceName: 'Optimización de sistema',
    description: 'Optimización de rendimiento y limpieza de sistema',
    basePrice: 25.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET
    ],
    notes: 'Incluye desfragmentación y limpieza de archivos temporales'
  },
  {
    serviceName: 'Instalación de programas',
    description: 'Instalación y configuración de software específico',
    basePrice: 15.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE
    ],
    notes: 'Por cada programa adicional'
  },
  {
    serviceName: 'Backup de datos',
    description: 'Respaldo completo de archivos y configuraciones',
    basePrice: 20.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.SERVER
    ],
    notes: 'Cliente debe proporcionar medio de almacenamiento'
  },
  {
    serviceName: 'Configuración de impresora en red',
    description: 'Configuración de impresora compartida en red local',
    basePrice: 25.00,
    applicableEquipmentTypes: [EquipmentType.PRINTER],
    notes: 'Hasta 5 equipos conectados'
  },
  {
    serviceName: 'Diagnóstico general',
    description: 'Diagnóstico completo de fallas de hardware o software',
    basePrice: 15.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.PRINTER,
      EquipmentType.SMARTWATCH,
      EquipmentType.ROUTER,
      EquipmentType.SWITCH,
      EquipmentType.MONITOR,
      EquipmentType.SERVER
    ],
    notes: 'Se descuenta del costo de reparación si se procede'
  },
  {
    serviceName: 'Configuración de correo electrónico',
    description: 'Configuración de cuentas de correo en cliente de email',
    basePrice: 10.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET
    ],
    notes: 'Incluye configuración de múltiples cuentas'
  },
  {
    serviceName: 'Instalación de antivirus',
    description: 'Instalación y configuración de software antivirus',
    basePrice: 15.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.SERVER
    ],
    notes: 'Licencia no incluida'
  },
  {
    serviceName: 'Reparación de arranque',
    description: 'Reparación de problemas de inicio de sistema operativo',
    basePrice: 30.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE
    ],
    notes: 'Incluye reparación de MBR/GPT'
  },
  {
    serviceName: 'Activación de Windows u Office',
    description: 'Activación legal de Windows o Microsoft Office',
    basePrice: 10.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC, 
      EquipmentType.ALL_IN_ONE
    ],
    notes: 'Cliente debe tener licencia válida'
  },

  // ==================== SERVICIOS ESPECIALIZADOS ====================
  {
    serviceName: 'Reballing de chip',
    description: 'Reballing de chip gráfico o procesador',
    basePrice: 80.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC,
      EquipmentType.CELLPHONE
    ],
    notes: 'Servicio especializado, requiere equipo específico'
  },
  {
    serviceName: 'Reparación de placa madre',
    description: 'Diagnóstico y reparación de componentes en placa base',
    basePrice: 70.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP, 
      EquipmentType.PC,
      EquipmentType.ALL_IN_ONE,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET
    ],
    notes: 'Precio según complejidad de la falla'
  },
  {
    serviceName: 'Soldadura de componentes SMD',
    description: 'Microsoldadura de componentes electrónicos',
    basePrice: 50.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP,
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.SMARTWATCH
    ],
    notes: 'Requiere microscopio y estación de soldadura'
  },
  {
    serviceName: 'Limpieza por ultrasonido',
    description: 'Limpieza de placas con líquido dieléctrico en ultrasonido',
    basePrice: 40.00,
    applicableEquipmentTypes: [
      EquipmentType.CELLPHONE,
      EquipmentType.TABLET,
      EquipmentType.SMARTWATCH
    ],
    notes: 'Ideal para equipos con daño por líquidos'
  },
  {
    serviceName: 'Reflow de soldadura',
    description: 'Proceso de reflow para reparar soldaduras frías',
    basePrice: 60.00,
    applicableEquipmentTypes: [
      EquipmentType.LAPTOP,
      EquipmentType.PC,
      EquipmentType.CELLPHONE
    ],
    notes: 'Solución temporal para algunos problemas de GPU'
  }
];
