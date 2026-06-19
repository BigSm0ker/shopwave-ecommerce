# ShopWave - Guía de Instalación y Uso

Este documento contiene las instrucciones necesarias para levantar tanto el backend como el frontend del proyecto ShopWave en tu entorno local.

---

## GUÍA PARA LEVANTAR EL BACKEND SHOPWAVE

### IMPORTANTE:
- Ya debes tener el repositorio clonado.
- Debes tener **Docker Desktop** instalado y abierto.
- Debes tener **Java** instalado.
- El backend corre en `http://localhost:8080`
- phpMyAdmin corre en `http://localhost:8081`
- MySQL se usa por Docker en el puerto `3307`.

---

### 1. ACTUALIZAR DEVELOP
Abrir VS Code en el proyecto y ejecutar:
```powershell
git checkout develop
git pull origin develop
```

---

### 2. ENTRAR A LA CARPETA BACKEND
```powershell
cd backend
```
Ahí debes ver archivos como:
- `pom.xml`
- `mvnw.cmd`
- `docker-compose.yml`
- `src/`

---

### 3. ABRIR DOCKER DESKTOP
Antes de correr comandos Docker, abrir Docker Desktop y esperar a que esté funcionando.

Verificar con:
```powershell
docker ps
```
Si sale una tabla, aunque esté vacía, Docker está bien.

---

### 4. LEVANTAR MYSQL Y PHPMYADMIN
Desde la carpeta `backend` ejecutar:
```powershell
docker compose up -d
```

Verificar:
```powershell
docker ps
```
Deben aparecer:
- `shopwave-mysql`
- `shopwave-phpmyadmin`

#### phpMyAdmin:
`http://localhost:8081`

**Datos de acceso:** 
- **Servidor:** `mysql`
- **Usuario:** `root`
- **Contraseña:** `root`

---

### 5. LEVANTAR EL BACKEND
Desde la carpeta `backend` ejecutar en PowerShell:
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3307"
$env:DB_NAME="shopwavefusion"
$env:DB_PASSWORD="root"
.\mvnw.cmd spring-boot:run
```

Si funciona, la terminal se queda ocupada mostrando logs. Debe aparecer algo como:
`Tomcat started on port(s): 8080` y `Started ShopwavefusionbackendApplication`.

Para apagar el backend, presiona:
`Ctrl + C`

---

### 6. PROBAR EN EL NAVEGADOR
Abrir:
`http://localhost:8080`

Debe salir la página de bienvenida de **ShopWaveFusion**.

- **Swagger (Documentación de la API):**
  `http://localhost:8080/swagger-ui/index.html`

- **Productos:**
  `http://localhost:8080/products`
  Si devuelve `[]` está bien, solo significa que todavía no hay productos cargados en la base de datos.

---

### 7. PROBAR LOGIN ADMIN EN POSTMAN
Crear request:
`GET http://localhost:8080/auth/signin`

En Postman ir a:
`Authorization > Type: Basic Auth`

Colocar:
- **Username:** `admin@example.com`
- **Password:** `admin`

Enviar. Si responde `200 OK`, revisar los **Headers** de la respuesta y buscar el header `Authorization`. Ese valor es el token **JWT** del admin.

---

### 8. SI SALE 401 UNAUTHORIZED
Significa que no pusieron Basic Auth correctamente. Revisar:
`Authorization > Basic Auth` con **Username:** `admin@example.com` y **Password:** `admin`.
*Nota: El login NO usa body JSON.*

---

### 9. SI EL PUERTO 8080 ESTÁ OCUPADO
Verificar contenedores activos:
```powershell
docker ps
```
Si hay otro contenedor usando 8080, detenerlo:
```powershell
docker stop NOMBRE_DEL_CONTENEDOR
```
*(Ejemplo: `docker stop pronto_evolution`)*

Luego volver a correr:
```powershell
.\mvnw.cmd spring-boot:run
```

---

### 10. PARA APAGAR MYSQL Y PHPMYADMIN
Desde la carpeta `backend`:
```powershell
docker compose down
```
Si quieres borrar también los datos de la base:
```powershell
docker compose down -v
```

---
---

