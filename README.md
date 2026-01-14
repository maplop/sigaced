# GAPCED

**Gestión de Otorgamiento de Plazas del Curso por Encuentro y a Distancia**

GAPCED es una aplicación de escritorio desarrollada con Electron, React y TypeScript que automatiza el proceso de asignación de plazas universitarias para las modalidades de Curso por Encuentro y Curso a Distancia.

El sistema fue desarrollado para la **Universidad Central "Marta Abreu" de Las Villas** y gestiona todo el flujo desde el registro de aspirantes hasta la asignación final de plazas, pasando por tres fases de otorgamiento automático y manual.

El sistema gestiona todo el flujo desde el registro de aspirantes hasta la asignación final de plazas, pasando por tres fases de otorgamiento automático y manual.

## Características Principales

### Gestión de Datos

- **Carreras**: Gestión completa de carreras universitarias con nombre, abreviatura y facultad
- **Ubicaciones**: Administración de sedes y centros universitarios
- **Plazas**: Configuración de plazas disponibles por carrera, ubicación y fase
- **Aspirantes**: Registro de estudiantes con CI, nombre, apellidos, calificación, género y municipio
- **Solicitudes**: Gestión de hasta 3 opciones de plaza por aspirante por fase

### Proceso de Otorgamiento

El sistema implementa un proceso de asignación en **3 fases**:

1. **Primera Fase - Otorgamiento Automático Inicial**
   - Todos los aspirantes con al menos una solicitud y un máximo de tres, se ordenan por nota (descendente)
   - Asignación automática según disponibilidad y preferencia
   - Los aspirantes no asignados pasan a la siguiente fase

2. **Segunda Fase - Otorgamiento Automático Complementario**
   - Se ofertan las plazas restantes de la primera fase
   - Los aspirantes pueden presentar nuevas opciones entre las plazas disponibles
   - La institución puede añadir o editar plazas

3. **Tercera Fase - Otorgamiento Manual**
   - Asignación manual a aspirantes ordenados por nota
   - El operador selecciona la plaza disponible adecuada
   - Finaliza el proceso de otorgamiento

### Estadísticas y Reportes

- **Dashboard**: Métricas en tiempo real del proceso de asignación
- **Top Estudiantes**: Ranking de los mejores estudiantes
- **Top Carreras**: Carreras más solicitadas
- **Reportes**: Exportación a PDF de listados y consultas
- **KPIs**: Indicadores clave de rendimiento por fase

### Generación de PDFs

- Exportación de listados consolidados
- Reportes por carrera, ubicación, municipio
- Listados de asignaciones por fase
- Histórico de otorgamientos

## Requisitos Previos

- **Node.js**: Versión 18 o superior
- **pnpm**: Gestor de paquetes (recomendado)
- **Sistema Operativo**: Windows, macOS o Linux

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd gapced
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Solución para better-sqlite3

**Importante**: `better-sqlite3` requiere compilación nativa para Electron. Si encuentras errores relacionados con este módulo, sigue estos pasos:

#### Problema Común

Si al ejecutar la aplicación obtienes un error relacionado con `better-sqlite3` (por ejemplo, "NODE_MODULE_VERSION mismatch"), esto significa que el módulo no está compilado para la versión de Node que usa Electron.

#### Solución

1. **Borrar módulos y lockfile**:

   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   ```

   En Windows:

   ```bash
   rmdir /s node_modules
   del pnpm-lock.yaml
   ```

2. **Reinstalar dependencias**:

   ```bash
   pnpm install
   ```

3. **Instalar electron-rebuild** (si no está instalado):

   ```bash
   pnpm add -D electron-rebuild
   ```

4. **Recompilar better-sqlite3 para Electron**:

   ```bash
   npx electron-rebuild -f -w better-sqlite3
   ```

   Esto generará `better_sqlite3.node` compatible con la versión de Node de Electron.

5. **Ejecutar la aplicación**:
   ```bash
   pnpm dev
   ```

**Nota**: El proyecto ya incluye un script `postinstall` que ejecuta automáticamente `electron-rebuild` después de `pnpm install`. Si el problema persiste, ejecuta manualmente el paso 4.

### 4. Verificar Instalación

Si la instalación fue exitosa, deberías poder ejecutar:

```bash
pnpm dev
```

Y la aplicación debería abrirse sin errores.

## Desarrollo

### Iniciar en Modo Desarrollo

```bash
pnpm dev
```

Esto iniciará la aplicación con:

- Hot reload para cambios en el código
- DevTools habilitadas (F12)
- Recarga automática al guardar cambios

### Estructura del Proyecto

```
gapced/
├── src/
│   ├── main/              # Proceso principal de Electron
│   │   ├── database.ts     # Configuración de SQLite
│   │   ├── queries/        # Consultas a la base de datos
│   │   ├── seed/           # Datos de muestra (ver README.md)
│   │   └── pdf/            # Generación de PDFs
│   ├── preload/            # Scripts de preload
│   ├── renderer/            # Aplicación React
│   │   ├── src/
│   │   │   ├── components/ # Componentes React
│   │   │   ├── pages/      # Páginas principales
│   │   │   ├── api/        # Llamadas a IPC
│   │   │   ├── context/    # Contextos de React
│   │   │   └── utils/      # Utilidades
│   └── shared/             # Tipos compartidos
├── build/                  # Configuración de build
├── resources/              # Recursos (iconos, etc.)
└── package.json
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev                    # Iniciar en modo desarrollo

# Build
pnpm build                  # Compilar sin empaquetar
pnpm build:win              # Build para Windows
pnpm build:mac              # Build para macOS
pnpm build:linux            # Build para Linux
pnpm build:unpack            # Build sin empaquetar (solo directorio)

# Calidad de Código
pnpm lint                   # Ejecutar ESLint
pnpm format                 # Formatear código con Prettier
pnpm typecheck              # Verificar tipos TypeScript
pnpm typecheck:node         # Verificar tipos del proceso principal
pnpm typecheck:web          # Verificar tipos del renderer

# Utilidades
pnpm rebuild                # Recompilar módulos nativos
pnpm start                  # Preview de la build
```

## Build y Distribución

### Windows

```bash
pnpm build:win
```

Genera un instalador `.exe` en la carpeta `dist/`.

### macOS

```bash
pnpm build:mac
```

Genera un archivo `.dmg` o `.pkg` según la configuración.

### Linux

```bash
pnpm build:linux
```

Genera paquetes `.AppImage`, `.deb` o `.rpm` según la configuración.

### Build sin Empaquetar

Para probar la aplicación compilada sin crear un instalador:

```bash
pnpm build:unpack
```

Esto genera los archivos compilados en `out/` sin empaquetarlos.

## Tecnologías Utilizadas

### Frontend

- **React 19**: Biblioteca para interfaces de usuario
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **Radix UI**: Componentes accesibles
- **React Router**: Navegación
- **TanStack Query**: Gestión de estado del servidor
- **TanStack Table**: Tablas de datos

### Backend

- **Electron**: Framework para aplicaciones de escritorio
- **Better-SQLite3**: Base de datos SQLite nativa
- **PDF-lib**: Generación de PDFs

### Herramientas de Desarrollo

- **Electron Vite**: Build tool para Electron
- **Vite**: Bundler rápido
- **ESLint**: Linter de código
- **Prettier**: Formateador de código
- **Electron Builder**: Empaquetado de aplicaciones

## Funcionalidades Detalladas

### Gestión de Carreras

- Crear, editar y eliminar carreras
- Asignar facultades
- Configurar abreviaturas

### Gestión de Ubicaciones

- Administrar sedes y centros
- Asignar ubicaciones a plazas

### Gestión de Plazas

- Configurar plazas por carrera y ubicación
- Definir cantidad de cupos por fase
- Las plazas no asignadas pasan automáticamente a la siguiente fase

### Gestión de Aspirantes

- Registro completo de datos personales
- Asignación de calificaciones (0-100)
- Configuración de hasta 3 solicitudes por fase
- Ordenamiento automático por calificación

### Proceso de Asignación

- **Asignación Automática**: Basada en calificación y preferencias
- **Seguimiento de Fases**: Control del flujo entre fases
- **Asignación Manual**: Para la fase final
- **Validaciones**: Verificación de constraints y reglas de negocio

### Reportes y Estadísticas

- Dashboard con KPIs en tiempo real
- Top 5 estudiantes por calificación
- Top 10 carreras más solicitadas
- Reportes exportables a PDF:
  - Listado de aspirantes y solicitudes
  - Asignaciones por carrera
  - Asignaciones por ubicación
  - Asignaciones por municipio
  - Cierre de carreras (nota mínima)

### Autenticación y Usuarios

- Sistema de autenticación
- Roles: Administrador y Visualizador
- Gestión de usuarios
- Cambio de contraseñas

## Población de Datos de Muestra

Para facilitar las pruebas y el desarrollo, el sistema incluye un módulo de seed que permite poblar la base de datos con datos de muestra realistas.

**Ver documentación completa**: [`src/main/seed/README.md`](src/main/seed/README.md)

### Uso Rápido

Desde la consola del navegador (DevTools):

```javascript
// Limpiar tablas
await window.api.clearSeedTables()

// Poblar con 100 estudiantes (default)
await window.api.seedDatabase()

// Validar datos
await window.api.validateSeedData()
```

## Solución de Problemas

### Error: "NODE_MODULE_VERSION mismatch" con better-sqlite3

**Solución**: Ver sección [Solución para better-sqlite3](#3-solución-para-better-sqlite3)

### La aplicación no inicia

1. Verificar que todas las dependencias están instaladas:

   ```bash
   pnpm install
   ```

2. Verificar que electron-rebuild se ejecutó correctamente:

   ```bash
   npx electron-rebuild -f -w better-sqlite3
   ```

3. Limpiar y reinstalar:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### Errores de TypeScript

Ejecutar verificación de tipos:

```bash
pnpm typecheck
```

### Errores de Linting

Ejecutar el linter:

```bash
pnpm lint
```

Formatear código:

```bash
pnpm format
```

### La base de datos no se crea

La base de datos SQLite se crea automáticamente en el directorio de datos de usuario de Electron:

- **Windows**: `%APPDATA%/gapced/app.sqlite`
- **macOS**: `~/Library/Application Support/gapced/app.sqlite`
- **Linux**: `~/.config/gapced/app.sqlite`

Si hay problemas, verificar permisos de escritura en estos directorios.

## Configuración Recomendada del IDE

### VSCode

Extensiones recomendadas:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## Documentación Adicional

- **Población de Datos**: [`src/main/seed/README.md`](src/main/seed/README.md)
- **Estructura de Base de Datos**: Ver `src/main/database.ts`

## Autor

Desarrollado para la Universidad Central "Marta Abreu" de Las Villas
