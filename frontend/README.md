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