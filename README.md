# Rastreo y Monitoreo de Envíos

  

Servicio de seguimiento de envíos que checa periódicamente el estatus de los registros en la base de datos cada 30 minutos.

  

## Configuración

  

### Requisitos previos

  

- Node.js >= 14

- npm o yarn

- docker engine y docker compose instalado

  

### Ejecución

  

1. Clona este repositorio:

```bash

git clone https://github.com/tu_usuario/tu-repositorio.git
```

2. Lanzar docker compose del proyecto:

```bash

docker-compose up -d
```
3. Configurar replica de MongoDB:

  

```bash

docker exec -it mongo1 bash

mongosh

rs.initiate()

rs.add("mongo1:27017")

rs.add("mongo2:27017")

rs.add("mongo3:27017")
```
  

La aplicación estará disponible en http://localhost:3000 por defecto.

  

## Endpoints

  

### '/envios' (POST)

  

#### Descripción

  

Crea un envio en el que se le dará seguimiento dependiendo la compañia de la mensajería (dhl,99minutos ó estafeta)

  

```bash

curl  -X  POST  http://localhost:3000/envios  \

-H "Content-Type: application/json" \

-d  '{

"trackingNumber":"2176017690",

"company":"dhl",

"customerName": "jhon",

"email": "jhon@hotmail.com",

"address": "Allende xxxx xxxx",

"phone":"0000000000"

}'
```
  

### `/envios/{id}` (GET)

  

Obtiene el envío por id del registro

  

#### Ejemplo de solicitud

  

```bash

curl  -X GET http://localhost:3000/envios/00000000
```

### `/envios` (GET)

  

Obtiene todos los registros

  

#### Ejemplo de solicitud

  

```bash

curl  -X GET http://localhost:3000/envios
```