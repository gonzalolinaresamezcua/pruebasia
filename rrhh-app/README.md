# Sistema de Recursos Humanos para Empresas Españolas

Una aplicación completa de gestión de recursos humanos desarrollada con React y TypeScript, diseñada específicamente para empresas españolas.

## Características

- **Registro de Jornada Laboral**: Control de entrada y salida, cumpliendo con la legislación española.
- **Gestión de Calendario**: Visualización de eventos, reuniones, ausencias y días festivos.
- **Gestión de Ausencias y Vacaciones**: Solicitud y aprobación de vacaciones y otros tipos de ausencias.
- **Firma Digital de Documentos**: Sistema de firma electrónica para documentos laborales.
- **Gestión de Usuarios**: Diferentes roles (empleados, gestores de RRHH, administradores).
- **Dashboard Personalizado**: Información relevante según el rol del usuario.
- **Informes y Estadísticas**: Generación de informes de jornada, ausencias, etc.

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Material-UI
- **Gestión de Estado**: Redux Toolkit
- **Formularios**: Formik, Yup
- **Calendario**: React Big Calendar
- **Firma Digital**: React Signature Canvas
- **Fechas**: Date-fns
- **Autenticación**: JWT

## Requisitos

- Node.js 14.0 o superior
- npm 6.0 o superior

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/rrhh-app.git
   cd rrhh-app
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Iniciar la aplicación en modo desarrollo:
   ```
   npm start
   ```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── auth/         # Componentes de autenticación
│   ├── layout/       # Componentes de estructura
│   ├── dashboard/    # Componentes del dashboard
│   ├── timeTracking/ # Componentes de registro de jornada
│   ├── calendar/     # Componentes de calendario
│   ├── absences/     # Componentes de ausencias
│   ├── documents/    # Componentes de documentos
│   └── profile/      # Componentes de perfil
├── pages/            # Páginas principales
├── services/         # Servicios API
├── store/            # Estado global (Redux)
│   └── slices/       # Slices de Redux
├── types/            # Definiciones de TypeScript
├── utils/            # Utilidades
└── hooks/            # Custom hooks
```

## Roles de Usuario

- **Empleado**: Acceso básico para registrar jornada, solicitar ausencias, ver documentos.
- **Gestor de RRHH**: Aprobación de solicitudes, gestión de documentos, informes básicos.
- **Administrador**: Control total del sistema, configuración, gestión de usuarios.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Para cualquier consulta o sugerencia, por favor contacta con nosotros en info@tuempresa.com.