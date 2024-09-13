# File Manager + TypeScript

Proyecto hecho para el portafolio persona, gestiona los archivos con multer, y posteriormente se integrara la funcion de S3 de AWS

## Instalación

1. Clonar .env.explample a .env y configurar las variables de entorno
2. Ejecutar `npm install` o `pnpm i` para instalar las dependencias
3. Ejecutar `npx prisma migrate dev --name init` o `pnpm exec prisma migrate dev --name init` para las migraciones de prisma
4. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo
