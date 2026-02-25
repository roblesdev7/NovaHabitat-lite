# BACKLOG - NovaHabitat Lite

Distribución MoSCoW obligatoria:
- Must: 6
- Should: 2
- Could: 1
- Won't: 1

## WI-01
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Crear propiedad.
- **Criterios (Given/When/Then):**
  - Given un payload válido con título, ubicación, precio y estado Available
  - When se crea la propiedad
  - Then responde 201 con objeto creado e id único
  - And el precio se almacena sin ser negativo
- **Endpoint:** `POST /properties`
- **RB relacionadas:** RB-01, RB-03, RB-08

## WI-02
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Editar propiedad.
- **Criterios (Given/When/Then):**
  - Given una propiedad existente
  - When se actualiza título/precio/ubicación con datos válidos
  - Then responde 200 con datos actualizados
  - And si id no existe responde 404
- **Endpoint:** `PUT /properties/{id}`
- **RB relacionadas:** RB-03, RB-08

## WI-03
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Cambiar estado de propiedad con auditoría mínima.
- **Criterios (Given/When/Then):**
  - Given una propiedad existente en estado Available
  - When se cambia estado a Reserved con changedBy
  - Then responde 200 y guarda auditoría (changedBy + timestamp)
  - And si viola RB-05 responde 409
- **Endpoint:** `PATCH /properties/{id}/status`
- **RB relacionadas:** RB-01, RB-05, RB-07, RB-08

## WI-04
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Buscar/Listar propiedades por filtros simples.
- **Criterios (Given/When/Then):**
  - Given propiedades existentes
  - When se consulta con filtros
  - Then responde 200 con resultados correctos
  - And si no hay resultados responde 200 con lista vacía
- **Endpoint:** `GET /properties`
- **RB relacionadas:** RB-01, RB-08

## WI-05
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Crear lead con canal de entrada.
- **Criterios (Given/When/Then):**
  - Given lead con nombre, canal y presupuesto válido
  - When se crea lead
  - Then responde 201 con id y estado New
  - And presupuesto negativo responde 400
- **Endpoint:** `POST /leads`
- **RB relacionadas:** RB-02, RB-04, RB-08

## WI-06
- **Tipo:** RF
- **Prioridad:** Must
- **Descripción:** Registrar interacción tipo NOTE en lead.
- **Criterios (Given/When/Then):**
  - Given un lead existente
  - When se crea una interacción NOTE con contenido no vacío
  - Then responde 201 y se asocia al lead
  - And si lead no existe responde 404
- **Endpoint:** `POST /leads/{id}/interactions`
- **RB relacionadas:** RB-08

## WI-07
- **Tipo:** RF
- **Prioridad:** Should
- **Descripción:** Cambiar estado de lead.
- **Criterios (Given/When/Then):**
  - Given un lead existente
  - When cambia a Contacted
  - Then responde 200
  - And si cambia a Closed sin interacción responde 409
- **Endpoint:** `PATCH /leads/{id}/status`
- **RB relacionadas:** RB-02, RB-06, RB-07, RB-08

## WI-08
- **Tipo:** RF
- **Prioridad:** Should
- **Descripción:** Consultar lead con timeline de interacciones.
- **Criterios (Given/When/Then):**
  - Given un lead con interacciones
  - When se consulta lead
  - Then responde 200 incluyendo interacciones ordenadas por fecha
- **Endpoint:** `GET /leads/{id}`
- **RB relacionadas:** RB-08

## WI-09
- **Tipo:** RF
- **Prioridad:** Could
- **Descripción:** Buscar leads por canal y estado.
- **Criterios (Given/When/Then):**
  - Given múltiples leads
  - When filtro por canal y estado
  - Then responde 200 con leads filtrados
- **Endpoint:** `GET /leads?channel=&status=`
- **RB relacionadas:** RB-02, RB-08

## WI-10
- **Tipo:** RF
- **Prioridad:** Won't
- **Descripción:** Generación automática de contratos de alquiler/venta.
- **Criterios (Given/When/Then):**
  - Given el alcance del MVP actual
  - When se evalúa la iteración
  - Then esta funcionalidad permanece fuera de alcance
- **Endpoint:** N/A
- **RB relacionadas:** N/A

## Regla de trazabilidad obligatoria
Cada endpoint implementado en el MVP debe mapearse a un RF y a un work item en `README.md` (tabla Endpoint -> RF/WI). Si se crea/modifica endpoint, se actualiza también `openapi.yaml` y la tabla de trazabilidad.
