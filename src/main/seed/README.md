# Población de Datos de Muestra (Seed Database)

Este módulo permite poblar la base de datos con datos de muestra para facilitar las pruebas y el desarrollo del sistema GOPCED.

## Descripción

El sistema de seed genera datos realistas para las siguientes tablas:

- **career**: 15 carreras de diferentes facultades
- **location**: 6 ubicaciones/sedes
- **spot**: 60+ plazas disponibles en fase 1
- **student**: Estudiantes con datos realistas (configurable, default: 100)
- **student_phase**: Relación estudiante-fase (todos en fase 1)
- **request**: Solicitudes de estudiantes (1-3 por estudiante)

## Características

- Distribución realista de calificaciones (curva normal)
- Estudiantes con mejores calificaciones tienden a solicitar carreras más populares
- CIs únicos generados automáticamente
- Distribución de género balanceada (50% M, 50% F)
- Varios municipios representados
- Respeto de todas las constraints y relaciones de la base de datos

## Uso desde la Consola del Navegador

### Prerrequisitos

1. Ejecutar la aplicación en modo desarrollo:
   ```bash
   pnpm run dev
   ```

2. Abrir las DevTools del navegador (F12 o clic derecho → Inspeccionar)

3. Ir a la pestaña **Console**

### Comandos Disponibles

#### 1. Limpiar Tablas (Opcional)

Antes de poblar, puedes limpiar las tablas existentes:

```javascript
await window.api.clearSeedTables()
```

**Nota**: Esto elimina todos los datos de las tablas: `career`, `location`, `spot`, `student`, `student_phase`, `request`, y `allocation`. **No elimina la tabla `user`**.

#### 2. Poblar Base de Datos

Poblar con cantidad por defecto (100 estudiantes):

```javascript
const result = await window.api.seedDatabase()
console.log("Resultado:", result)
```

Poblar con cantidad personalizada:

```javascript
// Ejemplo: 120 estudiantes
const result = await window.api.seedDatabase(120)
console.log("Resultado:", result)
```

**Respuesta esperada:**
```javascript
{
  success: true,
  result: {
    careers: 15,        // Carreras insertadas
    locations: 6,       // Ubicaciones insertadas
    spots: 60,          // Plazas insertadas
    students: 100,      // Estudiantes insertados
    studentPhases: 100, // Relaciones estudiante-fase
    requests: 220,      // Solicitudes generadas (aprox. 2.2 por estudiante)
    errors: []          // Array de errores (si los hay)
  }
}
```

#### 3. Validar Datos Insertados

Verificar que los datos cumplen con todas las validaciones:

```javascript
const validation = await window.api.validateSeedData()
console.log("Validación:", validation)
```

**Respuesta esperada:**
```javascript
{
  success: true,
  validation: {
    valid: true,        // true si no hay errores
    errors: [],         // Array de errores encontrados
    warnings: []        // Array de advertencias (no críticas)
  }
}
```

**Validaciones realizadas:**
- Todos los estudiantes tienen al menos 1 solicitud
- Ningún estudiante tiene más de 3 solicitudes
- Todos los `preference_order` son válidos (1, 2, o 3)
- Verificación de competencia realista (más estudiantes que plazas)

## Flujo de Trabajo Recomendado

### Primera vez

```javascript
// 1. Limpiar tablas existentes (si hay datos)
await window.api.clearSeedTables()

// 2. Poblar con datos de muestra
const result = await window.api.seedDatabase(100)
console.log("Datos insertados:", result)

// 3. Validar que todo esté correcto
const validation = await window.api.validateSeedData()
console.log("Validación:", validation)

// 4. Verificar en la UI
// - Ir a la página de Estadísticas
// - Ir a la página de Aspirantes
// - Verificar que los datos se muestran correctamente
```

### Repoblar datos

```javascript
// Limpiar y repoblar
await window.api.clearSeedTables()
await window.api.seedDatabase(100)
```

## Distribución de Datos Generados

### Estudiantes

- **Calificaciones**: Distribución normal
  - 10% excelentes (85-100)
  - 20% muy buenos (75-84)
  - 40% buenos (65-74)
  - 20% regulares (55-64)
  - 10% bajas (45-54)

- **Género**: 50% Masculino, 50% Femenino

- **Solicitudes por estudiante**:
  - 20% con 1 solicitud
  - 50% con 2 solicitudes
  - 30% con 3 solicitudes

### Carreras Incluidas

- **Ciencias de la Salud**: Medicina, Enfermería, Farmacia
- **Ingeniería**: Informática, Civil, Industrial, Eléctrica
- **Ciencias Económicas**: Contabilidad, Administración, Economía
- **Humanidades**: Derecho, Psicología, Educación
- **Ciencias**: Matemáticas, Biología

### Ubicaciones

- Sede Central
- Sede Norte
- Sede Sur
- Sede Este
- Sede Oeste
- Sede Centro

## Solución de Problemas

### Error: "UNIQUE constraint failed"

Si obtienes este error, significa que ya existen datos en la base de datos. Solución:

```javascript
// Limpiar primero
await window.api.clearSeedTables()

// Luego poblar
await window.api.seedDatabase()
```

### Validación falla: "X estudiantes no tienen solicitudes"

Esto no debería ocurrir, pero si pasa, significa que hubo un error durante la inserción. Solución:

```javascript
// Limpiar y repoblar
await window.api.clearSeedTables()
await window.api.seedDatabase()
```

### Los datos no aparecen en la UI

1. Verificar que la población fue exitosa (revisar `result.errors`)
2. Refrescar la página o invalidar las queries en React Query
3. Verificar que estás en la fase correcta (fase 1)

## Notas Importantes

- Los datos se insertan **solo para fase 1** (primera fase)
- La tabla `user` **NO se modifica** por estas funciones
- Las funciones usan **transacciones** para garantizar integridad
- Si hay un error durante la inserción, toda la transacción se revierte
- Los CIs se generan automáticamente y son únicos

## Archivos Relacionados

- `seedData.ts`: Contiene los datos de muestra (carreras, ubicaciones, plazas) y funciones de generación
- `seedDatabase.ts`: Contiene las funciones principales de población y validación
- `../database.ts`: Esquema de la base de datos

## Ejemplo Completo

```javascript
// Script completo de prueba
(async () => {
  try {
    console.log("1. Limpiando tablas...")
    await window.api.clearSeedTables()
    console.log("✓ Tablas limpiadas")
    
    console.log("2. Poblando base de datos con 100 estudiantes...")
    const result = await window.api.seedDatabase(100)
    console.log("✓ Datos insertados:", result)
    
    console.log("3. Validando datos...")
    const validation = await window.api.validateSeedData()
    console.log("✓ Validación:", validation)
    
    if (validation.validation.valid) {
      console.log("✅ Todo correcto! Puedes verificar en la UI")
    } else {
      console.warn("⚠️ Hay errores:", validation.validation.errors)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
})()
```
