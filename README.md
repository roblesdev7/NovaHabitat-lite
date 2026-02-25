# NovaHabitat Lite (API First MVP)

MVP interno para organizar:
- Catálogo de propiedades con estados claros.
- CRM básico de leads con seguimiento de interacciones.

## URL desplegada
- **Pendiente de despliegue público** (en este entorno no hay credenciales de plataforma).
- Una vez desplegado, actualizar aquí la URL y validar `GET /health` con `200`.

## Deploy rápido (Render o Railway)

### Opción A: Render
1. Sube este proyecto a GitHub.
2. En Render, crea un **New + Web Service** conectando el repo.
3. Render detectará [render.yaml](render.yaml) automáticamente.
4. Espera el deploy y prueba: `https://TU-URL.onrender.com/health`.
5. Coloca esa URL final en la sección **URL desplegada** de este README.

### Opción B: Railway
1. Sube este proyecto a GitHub.
2. En Railway, crea un proyecto desde repo.
3. Railway aplicará configuración de [railway.json](railway.json).
4. Cuando termine, prueba: `https://TU-URL.railway.app/health`.
5. Coloca esa URL final en la sección **URL desplegada** de este README.

## Endpoints principales
- `GET /health`
- `POST /properties`
- `PUT /properties/{id}`
- `PATCH /properties/{id}/status`
- `GET /properties`
- `POST /leads`
- `GET /leads`
- `GET /leads/{id}`
- `POST /leads/{id}/interactions`
- `PATCH /leads/{id}/status`

## Swagger / OpenAPI
- Contrato: [backend/openapi.yaml](backend/openapi.yaml)
- Swagger UI (local): `http://localhost:3000/docs`

## Estructura del proyecto
- Frontend visual: [frontend](frontend)
- Backend API: [backend](backend)
- Tests: [backend/tests](backend/tests)

## Cómo correr localmente
```bash
npm install
npm run dev
```
API en: `http://localhost:3000`

## Cómo correr tests
```bash
npm test
```

## Cómo probar endpoints (rápido)
1. Abrir `http://localhost:3000/docs`
2. Ejecutar `POST /properties` con ejemplo de `data/properties.sample.json`
3. Ejecutar `POST /leads` con ejemplo de `data/leads.sample.json`
4. Validar reglas RB con `PATCH /properties/{id}/status` y `PATCH /leads/{id}/status`

## Tabla de trazabilidad (Endpoint -> RF)
| Endpoint | RF/WI |
|---|---|
| `POST /properties` | WI-01 (RF Crear propiedad) |
| `PUT /properties/{id}` | WI-02 (RF Editar propiedad) |
| `PATCH /properties/{id}/status` | WI-03 (RF Cambiar estado propiedad + auditoría) |
| `GET /properties` | WI-04 (RF Buscar/Listar propiedades) |
| `POST /leads` | WI-05 (RF Crear lead) |
| `POST /leads/{id}/interactions` | WI-06 (RF Registrar interacción) |
| `PATCH /leads/{id}/status` | WI-07 (RF Cambiar estado lead) |
| `GET /leads/{id}` | WI-08 (RF Consultar lead con timeline) |
| `GET /leads?channel=&status=` | WI-09 (RF Búsqueda de leads) |
| `N/A` | WI-10 Won’t (Contratos automáticos fuera de alcance) |

## Reglas de negocio implementadas
- **RB-01:** Estados de propiedad permitidos `Available | Reserved | Rented | Inactive`.
- **RB-02:** Estados de lead permitidos `New | Contacted | Closed | Lost`.
- **RB-03:** Precio de propiedad no puede ser negativo.
- **RB-04:** Presupuesto de lead no puede ser negativo.
- **RB-05:** Solo se permite pasar propiedad a `Rented` desde `Available` o `Reserved`.
- **RB-06:** No se permite `Closed` en lead sin al menos 1 interacción.
- **RB-07:** Cambios de estado guardan auditoría con `changedBy` y `changedAt`.
- **RB-08:** Entradas inválidas responden error consistente (`400/404/409`) con estructura uniforme.

## Decisiones y trade-offs
1. **Persistencia en memoria (simple):** acelera entrega y pruebas del MVP; trade-off: no persiste reinicios.
2. **Frontend estático servido por Express:** implementación rápida para demo visual; trade-off: menor escalabilidad frente a SPA completa.

## Fuera de alcance negociado
- **Won’t:** Generación automática de contratos de alquiler/venta (WI-10).

## Datos de prueba obligatorios
- **Propiedad:** Apto 2 hab en Naco, 185,000 USD, Available.
- **Lead:** Ana Pérez, Instagram, busca 2 hab, presupuesto 200k.

Estos datos están precargados en memoria y también documentados en `data/`.
