# Problema 3 – Levantamiento de requerimientos
## Sistema de Gestión Inmobiliaria NovaHabitat

## Índice
1. Alcance y contexto
2. Requerimientos funcionales (RF)
3. Requerimientos no funcionales (RNF)
4. Reglas de negocio (RB)
5. Modelo conceptual (entidades y relaciones)
6. AS-IS vs TO-BE por proceso
7. Pain points resueltos
8. Preguntas al cliente, supuestos e impacto

---

## 1) Alcance y contexto
NovaHabitat opera **dos líneas de negocio** que deben coexistir en un solo sistema:

1. **Comercialización** de propiedades (venta y alquiler).
2. **Administración inmobiliaria** (condominios/residenciales y cobros recurrentes).

También se gestionan dos tipos de activos:
- **Activos propios** de la empresa.
- **Activos de terceros** (tutela/mandato), con condiciones y comisiones distintas.

El sistema objetivo es web (MVP), con posible extensión móvil futura.

---

## 2) Requerimientos funcionales (RF)
Formato: **ID – Descripción – Actor – Prioridad**

### Catálogo y propiedades
- **RF-01**: Registrar una propiedad con datos base (tipo, ubicación, m², habitaciones, baños, parqueos, precio, mantenimiento, amueblado). **Actor:** Asistente/Agente/Administrador. **Prioridad:** Must.
- **RF-02**: Clasificar propiedad por tipo (edificio, apartamento, casa, solar, local comercial). **Actor:** Asistente/Agente. **Prioridad:** Must.
- **RF-03**: Definir tenencia de propiedad (propia o de tercero en tutela/mandato). **Actor:** Administrador/Agente. **Prioridad:** Must.
- **RF-04**: Registrar datos del propietario externo y condiciones comerciales asociadas a la propiedad. **Actor:** Administrador/Agente. **Prioridad:** Must.
- **RF-05**: Cargar y organizar fotos/documentos por propiedad en storage centralizado. **Actor:** Asistente/Agente. **Prioridad:** Must.
- **RF-06**: Cambiar y consultar estado de propiedad (Disponible, Reservada, Rentada, En mantenimiento, En negociación, Vendida/Cerrada, Inactiva). **Actor:** Agente/Administrador. **Prioridad:** Must.

### CRM y leads
- **RF-07**: Registrar leads con canal de origen (WhatsApp/Instagram/llamada/web). **Actor:** Asistente/Agente. **Prioridad:** Must.
- **RF-08**: Asignar un lead a un agente responsable. **Actor:** Asistente/Administrador. **Prioridad:** Must.
- **RF-09**: Gestionar estado de lead (Nuevo, Contactado, Visitó, En negociación, Cerrado, Perdido). **Actor:** Agente. **Prioridad:** Must.
- **RF-10**: Registrar historial de interacciones del lead (notas, llamadas, mensajes, visitas). **Actor:** Agente/Asistente. **Prioridad:** Must.
- **RF-11**: Crear recordatorios y tareas de seguimiento con fecha/hora y responsable. **Actor:** Agente/Asistente. **Prioridad:** Must.
- **RF-12**: Mostrar bandeja de leads por agente y por estado para control de respuesta. **Actor:** Administrador/Asistente. **Prioridad:** Should.

### Proceso de alquiler
- **RF-13**: Crear solicitud de alquiler con checklist de documentos requeridos. **Actor:** Agente/Asistente. **Prioridad:** Must.
- **RF-14**: Registrar evaluación de solicitud (Aprobado/Rechazado/Pendiente) con observaciones. **Actor:** Administrador/Agente. **Prioridad:** Must.
- **RF-15**: Generar contrato de alquiler desde plantilla y datos del expediente. **Actor:** Asistente/Administrador. **Prioridad:** Must.
- **RF-16**: Registrar depósito y pagos iniciales de alquiler con comprobantes. **Actor:** Asistente/Encargado administración. **Prioridad:** Must.
- **RF-17**: Registrar inquilino(s), fiador y ocupantes vinculados al contrato. **Actor:** Asistente/Administrador. **Prioridad:** Must.
- **RF-18**: Gestionar fechas clave de contrato (inicio, fin, renovación, aumento anual). **Actor:** Encargado administración/Administrador. **Prioridad:** Must.
- **RF-19**: Gestionar proceso de salida (inspección, penalidades, devolución de depósito). **Actor:** Encargado administración. **Prioridad:** Should.

### Proceso de venta
- **RF-20**: Registrar visitas a propiedad con fecha, cliente y resultado. **Actor:** Agente. **Prioridad:** Must.
- **RF-21**: Registrar ofertas y contraofertas con historial y estado. **Actor:** Agente/Administrador. **Prioridad:** Must.
- **RF-22**: Registrar reserva de compra con monto de separación y vigencia. **Actor:** Agente/Asistente. **Prioridad:** Must.
- **RF-23**: Gestionar expediente documental de venta (promesa, acto, certificaciones). **Actor:** Asistente/Administrador. **Prioridad:** Must.
- **RF-24**: Calcular y registrar comisiones de agente y empresa según operación. **Actor:** Administrador. **Prioridad:** Must.
- **RF-25**: Registrar cierre de venta (fecha, abogado/notaría de referencia, estado final). **Actor:** Administrador/Agente. **Prioridad:** Must.

### Administración de condominios/residenciales
- **RF-26**: Registrar proyectos (edificio/residencial) y sus unidades (aptos/casas). **Actor:** Encargado administración. **Prioridad:** Must.
- **RF-27**: Registrar propietarios por unidad y residentes/inquilinos por unidad. **Actor:** Encargado administración. **Prioridad:** Must.
- **RF-28**: Generar facturación mensual de mantenimiento por unidad. **Actor:** Encargado administración. **Prioridad:** Must.
- **RF-29**: Registrar pagos y calcular morosidad/recargos automáticamente según reglas. **Actor:** Encargado administración. **Prioridad:** Must.
- **RF-30**: Gestionar tickets de mantenimiento, quejas y acceso/seguridad con estados. **Actor:** Residente/Asistente/Encargado administración. **Prioridad:** Must.
- **RF-31**: Emitir reportes de morosos, ingresos vs gastos, e incidentes por estado. **Actor:** Administrador/Encargado administración. **Prioridad:** Must.

### Seguridad, permisos e integración
- **RF-32**: Gestionar roles y permisos (Administrador, Agente, Asistente, Encargado administración). **Actor:** Administrador. **Prioridad:** Must.
- **RF-33**: Habilitar portal básico opcional para propietario externo (consulta de estado y actividad de su propiedad). **Actor:** Propietario externo. **Prioridad:** Could.
- **RF-34**: Habilitar portal básico opcional para residente (balance y creación de tickets). **Actor:** Residente. **Prioridad:** Could.
- **RF-35**: Enviar notificaciones por email para eventos clave (contrato listo, pago vencido, renovación próxima). **Actor:** Sistema/Usuarios internos. **Prioridad:** Should.
- **RF-36**: Gestionar plantillas de mensajes para WhatsApp (sin integración obligatoria en MVP). **Actor:** Asistente/Agente. **Prioridad:** Should.

---

## 3) Requerimientos no funcionales (RNF)

### Seguridad
- **RNF-01 (Seguridad):** Autenticación con contraseña robusta y política de expiración/recuperación segura.
- **RNF-02 (Seguridad):** Control de acceso basado en roles (RBAC) con mínimo privilegio.
- **RNF-03 (Seguridad):** Cifrado en tránsito (HTTPS/TLS) y cifrado en reposo para documentos sensibles.
- **RNF-04 (Seguridad):** Trazabilidad de acceso a documentos legales y datos personales.

### Rendimiento
- **RNF-05 (Rendimiento):** Tiempo de respuesta ≤ 2.5 segundos para consultas comunes (catálogo, lead, unidad) en condiciones normales.
- **RNF-06 (Rendimiento):** Listados paginados y filtrables para propiedades, leads, tickets y facturas.

### Disponibilidad
- **RNF-07 (Disponibilidad):** Disponibilidad mensual objetivo de 99.5% en horario operativo.
- **RNF-08 (Disponibilidad):** Copias de seguridad automáticas diarias con retención mínima de 30 días.

### Escalabilidad
- **RNF-09 (Escalabilidad):** Arquitectura preparada para crecimiento de usuarios, propiedades y documentos sin rediseño total.
- **RNF-10 (Escalabilidad):** Storage desacoplado para archivos multimedia/documentales de alto volumen.

### Usabilidad / UX
- **RNF-11 (Usabilidad):** Interfaz responsive para escritorio y móvil, priorizando tareas operativas frecuentes.
- **RNF-12 (Usabilidad):** Flujo de registro de lead y actualización de estado en máximo 3 pasos principales.

### Observabilidad (logs/auditoría)
- **RNF-13 (Observabilidad):** Registro auditable de cambios críticos (estado propiedad, estado lead, contrato, pagos, comisiones).
- **RNF-14 (Observabilidad):** Bitácora de errores técnicos y eventos funcionales para soporte.

### Mantenibilidad
- **RNF-15 (Mantenibilidad):** Documentación funcional y técnica mínima del MVP (módulos, reglas clave, catálogos).
- **RNF-16 (Mantenibilidad):** Configuración de catálogos/estados parametrizable sin cambios de código en despliegues menores.

### Legal / privacidad
- **RNF-17 (Legal/Privacidad):** Consentimiento y finalidad de uso para datos personales de leads/inquilinos/compradores.
- **RNF-18 (Legal/Privacidad):** Política de retención y eliminación de documentos personales según normativa aplicable en RD.

---

## 4) Reglas de negocio (RB)
Formato: “Si X ocurre, entonces Y. Excepción: Z.”

- **RB-01:** Si una propiedad está en estado *Vendida/Cerrada*, entonces no puede recibir nuevas reservas ni nuevos contratos de alquiler. **Excepción:** corrección administrativa con perfil Administrador.
- **RB-02:** Si una propiedad está *Reservada*, entonces no puede marcarse como *Rentada* o *Vendida* hasta confirmar o cancelar la reserva. **Excepción:** reserva vencida por fecha límite.
- **RB-03:** Si el lead cambia a *Cerrado*, entonces debe vincularse obligatoriamente a una operación (alquiler o venta). **Excepción:** cierre administrativo por duplicado de lead.
- **RB-04:** Si un lead no tiene agente asignado, entonces no puede pasar a estado *Contactado*. **Excepción:** asignación automática configurada.
- **RB-05:** Si falta un documento obligatorio del checklist de alquiler, entonces la solicitud queda en *Pendiente* y no puede aprobarse. **Excepción:** dispensa explícita aprobada por Administrador.
- **RB-06:** Si la evaluación de alquiler es *Rechazado*, entonces no se permite generar contrato. **Excepción:** reapertura formal de expediente.
- **RB-07:** Si se genera contrato de alquiler, entonces deben registrarse fechas de inicio y fin obligatoriamente. **Excepción:** contratos abiertos no permitidos en MVP.
- **RB-08:** Si llega la fecha de vencimiento de contrato sin renovación registrada, entonces el sistema emite alerta de seguimiento. **Excepción:** contrato terminado y cierre de salida completado.
- **RB-09:** Si existe penalidad de salida, entonces se descuenta del depósito antes de la devolución. **Excepción:** exoneración documentada por administración.
- **RB-10:** Si se registra reserva de compra, entonces debe incluir monto de separación y vigencia. **Excepción:** pre-reserva informal no válida para bloqueo de inventario.
- **RB-11:** Si una venta se marca como *Cerrada*, entonces se deben registrar fecha de cierre y referencia de abogado/notaría. **Excepción:** ninguna.
- **RB-12:** Si la propiedad es de tercero (tutela), entonces la comisión se calcula según condiciones pactadas con ese propietario. **Excepción:** campaña especial aprobada por dirección.
- **RB-13:** Si una factura de mantenimiento excede su fecha de vencimiento, entonces genera estado *Moroso* y aplica recargo según política vigente. **Excepción:** acuerdos de pago activos aprobados.
- **RB-14:** Si un usuario no tiene permiso del rol correspondiente, entonces no puede ver ni editar documentos legales sensibles. **Excepción:** acceso temporal auditado por Administrador.
- **RB-15:** Si se modifica un estado crítico (propiedad, lead, contrato, pago), entonces debe registrarse auditoría con usuario, fecha y motivo. **Excepción:** ninguna.
- **RB-16:** Si una unidad tiene residente activo, entonces debe existir vínculo con propietario y proyecto. **Excepción:** unidad en pre-entrega.

---

## 5) Modelo conceptual (entidades y relaciones)

## Entidades con atributos clave (alto nivel)
- **Property**: id, código, tipo, dirección, sector/ciudad, m², habitaciones, baños, parqueos, amueblado, precio_venta, precio_alquiler, mantenimiento, estado, tipo_tenencia.
- **Owner**: id, tipo_persona, nombre, documento_identidad, teléfono, email, dirección.
- **PropertyMandate** (tutela/mandato): id, property_id, owner_id, fecha_inicio, fecha_fin, condiciones_comisión, exclusividad.
- **MediaDocument**: id, entidad_tipo, entidad_id, tipo_documento, nombre_archivo, url_storage, fecha_carga, cargado_por.
- **Lead**: id, nombre, contacto, canal_origen, interés (compra/alquiler), presupuesto, estado, agente_asignado, fecha_creación.
- **LeadInteraction**: id, lead_id, tipo (nota/llamada/mensaje/visita), detalle, fecha, usuario.
- **TaskReminder**: id, lead_id/opportunity_id, descripción, fecha_vencimiento, estado, responsable.
- **Visit**: id, property_id, lead_id, fecha, resultado, observaciones.
- **RentalApplication**: id, property_id, lead_id, estado_evaluación, fecha_solicitud, observaciones.
- **ApplicationDocumentChecklist**: id, rental_application_id, documento, requerido, recibido, validado_por.
- **LeaseContract**: id, property_id, tenant_principal_id, fiador_id, fecha_inicio, fecha_fin, monto_renta, depósito, estado.
- **TenantOccupant**: id, lease_contract_id, persona_id, rol (inquilino/ocupante/fiador), activo.
- **MoveOutProcess**: id, lease_contract_id, fecha_inspección, penalidades, depósito_devuelto, estado.
- **SaleNegotiation**: id, property_id, lead_id, estado, precio_oferta_actual.
- **OfferCounteroffer**: id, sale_negotiation_id, tipo (oferta/contraoferta), monto, fecha, estado.
- **PurchaseReservation**: id, property_id, cliente_id, monto_separación, fecha, vigencia, estado.
- **SaleClosing**: id, property_id, comprador_id, fecha_cierre, abogado_notaría_ref, monto_final, estado.
- **CommissionRecord**: id, operación_tipo, operación_id, agente_id, porcentaje_agente, monto_agente, porcentaje_empresa, monto_empresa.
- **Project** (edificio/residencial): id, nombre, tipo, ubicación, estado.
- **Unit**: id, project_id, código_unidad, tipo, metraje, estado_ocupación.
- **UnitOwnership**: id, unit_id, owner_id, desde, hasta, activo.
- **UnitOccupancy**: id, unit_id, persona_id, rol (residente/inquilino), desde, hasta, activo.
- **MaintenanceInvoice**: id, unit_id, periodo, monto_base, recargo, total, fecha_emisión, fecha_vencimiento, estado.
- **Payment**: id, referencia_factura/operación, fecha_pago, monto, método, comprobante_url, estado.
- **Ticket**: id, project_id/unit_id, tipo (mantenimiento/queja/acceso), prioridad, estado, solicitante, asignado_a, fecha_creación.
- **User**: id, nombre, email, rol, estado.
- **AuditLog**: id, entidad, entidad_id, acción, valor_anterior, valor_nuevo, fecha, usuario, motivo.

## Relaciones principales
- **Owner 1..N Property** (directa o vía mandato).
- **Property 1..N MediaDocument**.
- **Lead 1..N LeadInteraction**.
- **Lead 1..N TaskReminder**.
- **Property 1..N Visit** y **Lead 1..N Visit**.
- **Lead 1..N RentalApplication**; **RentalApplication 1..N ApplicationDocumentChecklist**.
- **Property 1..N LeaseContract**; **LeaseContract 1..N TenantOccupant**; **LeaseContract 1..1 MoveOutProcess (opcional al inicio)**.
- **Property 1..N SaleNegotiation**; **SaleNegotiation 1..N OfferCounteroffer**.
- **Property 1..N PurchaseReservation**.
- **SaleClosing 1..N CommissionRecord** (agente/empresa).
- **Project 1..N Unit**; **Unit 1..N UnitOwnership**; **Unit 1..N UnitOccupancy**.
- **Unit 1..N MaintenanceInvoice**; **MaintenanceInvoice 1..N Payment**.
- **Project/Unit 1..N Ticket**.
- **Cualquier entidad crítica 1..N AuditLog**.

---

## 6) AS-IS vs TO-BE por proceso

## 6.1 Captación de propiedades
| Aspecto | AS-IS (Hoy) | TO-BE (Objetivo) |
|---|---|---|
| Recepción de información | Fotos por WhatsApp, docs por correo | Formulario único de alta de propiedad + carga centralizada |
| Registro de datos | Excel manual | Catálogo estructurado con campos obligatorios |
| Archivos | Google Drive por carpetas manuales | Storage integrado por propiedad y tipo documental |
| Contrato/acuerdo propietario | PDF/físico disperso | Expediente digital con trazabilidad y vigencia |
| Estado de propiedad | No estandarizado | Flujo de estados oficial y auditable |

## 6.2 Proceso de alquiler
| Aspecto | AS-IS (Hoy) | TO-BE (Objetivo) |
|---|---|---|
| Captura de solicitud | Recolección por chat/correo | Solicitud formal con checklist digital |
| Validación | “A mano” sin trazabilidad | Estado de evaluación + responsable + evidencia |
| Contrato | Plantilla Word manual | Generación desde plantilla con datos del sistema |
| Gestión financiera inicial | Seguimiento en Excel | Registro estructurado de depósito/pagos iniciales |
| Vigencias y renovaciones | Control manual, riesgo de olvido | Alertas automáticas de vencimiento/renovación |
| Salida | Variable y poco documentada | Flujo de inspección, penalidad y devolución |

## 6.3 Proceso de venta
| Aspecto | AS-IS (Hoy) | TO-BE (Objetivo) |
|---|---|---|
| Seguimiento comercial | En notas/Excel disperso | CRM con lead, visitas e interacciones |
| Negociación | Conversaciones sin historial central | Registro de ofertas/contraofertas y estado |
| Reserva de compra | Manejo no estandarizado | Reserva con monto y vigencia |
| Documentación legal | Dispersa por correo/Drive | Expediente documental por operación |
| Cierre | Dependiente de memoria del agente | Cierre formal con fecha, referencia legal y comisiones |

## 6.4 Administración (facturación + morosidad)
| Aspecto | AS-IS (Hoy) | TO-BE (Objetivo) |
|---|---|---|
| Registro de unidades/personas | Listas sueltas | Proyecto → Unidad → Propietario/Residente |
| Facturación mantenimiento | Frecuentemente por WhatsApp | Facturación mensual estructurada |
| Pagos | Excel manual | Registro de pago con estado y comprobante |
| Morosidad | Control “a mano” | Cálculo automático de morosidad/recargos |
| Solicitudes e incidentes | WhatsApp sin ticket | Sistema de tickets con prioridad y estado |
| Reportes a junta | Armado manual | Reportes parametrizados y exportables |

---

## 7) Pain points resueltos
- **Pérdida/duplicidad de datos:** se elimina al centralizar catálogo, CRM, contratos y pagos.
- **Falta de trazabilidad:** se resuelve con historial de interacciones y auditoría de cambios.
- **Falta de control contractual:** se corrige con fechas clave, alertas y estado de contrato.
- **Insatisfacción de propietarios:** mejora con estado visible por propiedad y reportabilidad.
- **Morosidad fuera de control:** se reduce con facturación sistemática, recargos y reportes de morosos.
- **Riesgo legal documental:** se mitiga con expediente digital, permisos y bitácora de acceso.

---

## 8) Preguntas al cliente, supuestos e impacto

| # | Pregunta inteligente al cliente | Supuesto si no responde | Impacto del supuesto |
|---|---|---|---|
| 1 | ¿Qué campos son obligatorios por tipo de propiedad para publicarla/comercializarla? | Se define set mínimo común + campos condicionales por tipo. | Evita registros incompletos pero puede requerir ajustes posteriores. |
| 2 | ¿Cómo se calcula exactamente la comisión para activos propios vs tutela? | Regla parametrizable por tipo de activo y contrato de mandato. | Permite MVP operativo; riesgo de recalcular operaciones históricas si cambia regla. |
| 3 | ¿Qué documentos son obligatorios en evaluación de alquiler por perfil de cliente? | Checklist base estándar para persona física y extranjera. | Acelera implementación; puede generar excepciones manuales al inicio. |
| 4 | ¿Cuántos niveles de aprobación se requieren para alquiler y para descuentos especiales? | 1 nivel (Administrador) para MVP. | Menor complejidad inicial; podría no cubrir controles corporativos futuros. |
| 5 | ¿Cuál es la política formal de recargos por mora (porcentaje, día de corte, tope)? | Recargo fijo parametrizable mensual a partir del día siguiente al vencimiento. | Permite automatización; riesgo de incumplir política real si difiere. |
| 6 | ¿Qué reportes son críticos para junta directiva y con qué periodicidad? | Morosos, cobranzas mensuales, incidentes por estado y pipeline comercial semanal/mensual. | Cobertura de decisión básica; puede faltar un KPI específico de dirección. |
| 7 | ¿Necesitan multimoneda (DOP/USD) y tasa de referencia por operación? | MVP en moneda principal configurable por tenant. | Simplifica finanzas; limita operaciones con doble moneda real. |
| 8 | ¿Qué nivel de acceso tendrá el propietario externo en portal (solo lectura o interacción)? | Portal de solo lectura en MVP (estado, visitas, ofertas, pagos). | Reduce riesgos de seguridad; menor autoservicio para propietario. |
| 9 | ¿Qué datos personales deben ocultarse según rol para cumplir privacidad? | Enmascarar documento/telefonía en roles no administrativos. | Mejora cumplimiento; puede afectar operación si se restringe en exceso. |
| 10 | ¿Qué SLA de respuesta esperan para leads por canal? | Objetivo inicial: primer contacto en < 2 horas laborables. | Permite medir desempeño; puede exigir más personal/proceso. |
| 11 | ¿Qué integración de WhatsApp esperan realmente en MVP (solo plantillas o envío automático)? | Solo plantillas y registro manual de interacción. | Entrega más rápida; menor automatización de comunicación. |
| 12 | ¿Cuál es la política de retención documental legal (años) para alquileres/ventas? | Retención mínima de 5 años, configurable por tipo documental. | Cubre base legal conservadora; puede aumentar costos de almacenamiento. |
| 13 | ¿Se requiere firma electrónica formal de contratos en fase inicial? | No en MVP; se adjunta contrato firmado externamente. | Reduce complejidad jurídica/técnica inicial. |
| 14 | ¿Qué estructura organizacional manejará el sistema (una oficina o múltiples sucursales)? | Una unidad operativa con opción futura multi-sucursal. | Diseño simple inicial; migración futura puede requerir ajustes en permisos/reportes. |

---

## Cierre
Este levantamiento está orientado a un **MVP funcional** que ataca los dolores principales de NovaHabitat: centralización, trazabilidad, control contractual/comercial y administración de morosidad. Está preparado para crecimiento posterior en móvil e integraciones avanzadas (pasarela de pago, publicación en portales y automatización de mensajería).
