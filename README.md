# Trabajo Práctico: Primer Final - Sistema de Reservas de Mesas

* **Materia:** Electiva: Programación Web - Frontend
* **Profesor:** Ing. Gustavo Sosa Cataldo
* **Fecha de Entrega:** Lunes 17/11/2025

## Integrantes del Grupo

* Marcelo Andre Pauls Toews

---

## Descripción del Proyecto

Este proyecto es un frontend desarrollado en **Angular** que implementa un sistema completo para la gestión de reservas de mesas en restaurantes.

Cumpliendo con los requisitos del trabajo práctico, la aplicación no utiliza un backend o una API externa. Toda la persistencia de datos se gestiona en el navegador del cliente utilizando **LocalStorage**. La aplicación permite realizar todas las operaciones de administración (Restaurantes, Zonas, Mesas, Horarios) y el flujo de creación y consulta de reservas.

---

## Características Implementadas

### 1. Sección de Administración

* **Gestión de Restaurantes:** Permite crear, ver y eliminar restaurantes. Se valida que no se creen restaurantes con nombres duplicados.
* **Gestión de Zonas:** Permite crear y eliminar zonas (ambientes) asociadas a un restaurante. La interfaz filtra las zonas según el restaurante seleccionado.
* **Gestión de Mesas:** Permite crear y eliminar mesas, asignándolas a una zona específica de un restaurante. Se valida que no se duplique el número de mesa dentro de una misma zona.
* **Gestión de Horarios:** Permite asignar y modificar los horarios de reserva disponibles para cada zona específica.

### 2. Sección de Reservas

* **Crear Reserva:** Un formulario guiado que sigue el flujo solicitado de 7 pasos (seleccionar restaurante, zona, fecha, hora, cantidad de personas, datos del cliente y confirmar).
* **Lógica de Asignación:** Al confirmar, el sistema busca automáticamente una mesa disponible que cumpla con la capacidad de personas y no esté reservada para esa misma fecha y hora.
* **Listar Reservas:** Una pantalla que muestra todas las reservas registradas, con la capacidad de filtrar por restaurante, zona y fecha.

---

## Tecnologías Utilizadas

* **Angular (v17+):** Framework principal para el desarrollo.
* **Angular CLI:** Para la gestión y creación de componentes (standalone), módulos y servicios.
* **Angular Material:** Para todos los componentes de UI (formularios, tablas, botones, menús, etc.), asegurando una interfaz clara y responsive.
* **TypeScript:** Lenguaje base del proyecto.
* **LocalStorage API:** Para la persistencia de datos en el navegador.
* **Git & GitHub:** Para el control de versiones y entrega del proyecto.

---

## Manual de Implementación (Despliegue)

Estos son los pasos necesarios para clonar y ejecutar la aplicación en un entorno local.

### Requisitos Previos

* **Node.js:** (Se recomienda Versión 18 o superior).
* **npm** (Node Package Manager).
* **Angular CLI:** Instalado globalmente.

```bash
npm install -g @angular/cli
```
### Pasos para la Instalación
### 1. Clonar el Repositorio:
```bash
git clone https://github.com/MarceloPauls/Front-End_Tercer_Parcial.git
```

### 2. Navegar al Directorio del Proyecto:
```bash
cd tp-reservas-frontend
```

### 3. Instalar Dependencias: Este comando leerá el archivo package.json e instalará todas las librerías necesarias (Angular, Angular Material, etc.).
```bash
npm install
```

### 4. Ejecutar la Aplicación: Este comando compila el proyecto y levanta un servidor de desarrollo local.
```bash
ng serve -o
```
### 5. Acceder a la Aplicación: Si el navegador no se abre automáticamente, acceda manualmente a: **http://localhost:4200**

## Acceso al Repositorio
*El profesor (sosacataldo@gmail.com) ha sido añadido como colaborador al repositorio de GitHub para la revisión del código fuente.


