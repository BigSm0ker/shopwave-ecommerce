# ShopWave E-commerce - Frontend

Proyecto final de Tecnologías Web II.

Este frontend está desarrollado con Next.js, TypeScript y Tailwind CSS. Su objetivo es consumir la API de ShopWave Fusion desarrollada en Spring Boot, utilizando JWT para autenticación y servicios desacoplados para mantener una arquitectura limpia.

## Tecnologías utilizadas

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Fetch API
- JWT
- LocalStorage
- Git y GitHub

## Rol trabajado: Persona 5 - Motor de Datos y Servicios

La Persona 5 se encarga de construir la capa de comunicación entre el frontend y el backend.

Responsabilidades implementadas:

- Definición de modelos TypeScript.
- Definición de tipos compartidos.
- Servicio HTTP base.
- Servicios desacoplados para productos, autenticación, carrito, órdenes y usuario.
- Manejo básico de JWT desde utilidades.
- Hook personalizado `useProducts`.
- Documentación técnica del frontend.
- Colección de pruebas para Postman.

## Estructura trabajada

```txt
src/
├── hooks/
│   └── useProducts.ts
├── models/
│   ├── auth.model.ts
│   ├── cart.model.ts
│   ├── order.model.ts
│   ├── product.model.ts
│   └── user.model.ts
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── product.service.ts
│   └── user.service.ts
├── types/
│   ├── api-response.type.ts
│   └── role.type.ts
└── utils/
    ├── currency.util.ts
    └── token.util.ts
## GUÍA RÁPIDA PARA LEVANTAR EL FRONTEND

### IMPORTANTE:
- El frontend ya está creado.
- **No** ejecutar `npx create-next-app`.
- Solo deben actualizar develop, instalar dependencias y correr el proyecto.

---

### 1. ACTUALIZAR EL PROYECTO
```powershell
git checkout develop
git pull origin develop
```

---

### 2. ENTRAR A LA CARPETA FRONTEND
```powershell
cd frontend
```

---

### 3. INSTALAR DEPENDENCIAS
```powershell
npm install
```
Esto crea la carpeta `node_modules` en su computadora (carpeta local que no se sube a GitHub).

---

### 4. CREAR ARCHIVO .env.local
Dentro de la carpeta `frontend` crear un archivo llamado:

`.env.local`

Y colocar dentro:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
Guardar el archivo.

---

### 5. LEVANTAR EL FRONTEND
```powershell
npm run dev
```

Abrir en el navegador:
`http://localhost:3000`
