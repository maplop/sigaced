# Análisis de Tests - Resumen de Errores y Correcciones

## Resumen Ejecutivo

**Estado:** 9 tests fallando de 110 totales
- Test Files: 7 failed | 26 passed | 2 skipped (35)
- Tests: 9 failed | 90 passed | 11 skipped (110)

## Errores Identificados y Correcciones Aplicadas

### 1. Tests de Botones "Deshacer otorgamiento"

**Archivos afectados:**
- `ManualAllocationView.test.tsx`
- `FinalListView.test.tsx`
- `AllocationsView.test.tsx`

**Problema:** Los tests esperaban que el botón "Deshacer otorgamiento" estuviera visible inmediatamente, pero el componente necesita tiempo para cargar los datos y renderizar el botón.

**Corrección aplicada:** Se agregó `waitFor()` para esperar a que el botón se renderice después de que los datos se carguen.

```typescript
await waitFor(() => {
  expect(screen.getByText("Deshacer otorgamiento")).toBeInTheDocument()
})
```

### 2. Tests de Selectores Popover en AddManualAllocation

**Archivo afectado:** `AddManualAllocation.test.tsx`

**Problema:** Los tests intentaban verificar que los items aparecían en los selectores de Popover, pero no esperaban suficiente tiempo para que el Popover se abriera y renderizara el contenido.

**Corrección aplicada:** Se aumentó el timeout de `waitFor()` a 3000ms para dar tiempo suficiente a que el Popover se abra y renderice.

```typescript
await waitFor(() => {
  expect(screen.getByText("Pérez Juan")).toBeInTheDocument()
}, { timeout: 3000 })
```

### 3. Test de Details - deleteUser

**Archivo afectado:** `Details.test.tsx`

**Problema:** El test usaba una variable con el mismo nombre que la función importada (`deleteUser`), causando conflictos.

**Corrección aplicada:** Se renombró la variable mock a `deleteUserMock` para evitar conflictos de nombres.

```typescript
const deleteUserMock = vi.fn().mockResolvedValue({ success: true })
mockWindowApi({ deleteUser: deleteUserMock })
```

### 4. Test de EditProfile - updateUser

**Archivo afectado:** `EditProfile.test.tsx`

**Problema:** 
- El componente `EditProfile` llama a `updateUser` de la API, que internamente llama a `window.api.getUsers()` primero para validar.
- El test no estaba mockeando `getUsers` correctamente.
- El test no esperaba suficiente tiempo para que la mutación asíncrona se completara.

**Corrección aplicada:** 
- Se agregó mock para `getUsers`.
- Se aumentó el timeout a 5000ms.
- Se verificó que se llame con los parámetros correctos usando `expect.objectContaining()`.

```typescript
const getUsersMock = vi.fn().mockResolvedValue([mockUser])
mockWindowApi({ 
  updateUser: updateUserMock,
  getUsers: getUsersMock
})
await waitFor(() => {
  expect(getUsersMock).toHaveBeenCalled()
  expect(updateUserMock).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 1,
      name: "María",
      lastName: "Pérez",
      username: "jperez",
      password: "hash",
      role: "admin"
    })
  )
}, { timeout: 5000 })
```

### 5. Test de ChangePassword - changeUserPassword

**Archivo afectado:** `ChangePassword.test.tsx`

**Problema:** Similar al anterior, el test necesitaba más tiempo para que la mutación asíncrona se completara.

**Corrección aplicada:** Se aumentó el timeout a 3000ms y se renombró la variable mock para evitar conflictos.

```typescript
const changeUserPasswordMock = vi.fn().mockResolvedValue({ success: true })
await waitFor(() => {
  expect(changeUserPasswordMock).toHaveBeenCalledWith({ id: 1, newPassword: hashPassword("newpass123") })
}, { timeout: 3000 })
```

## Problemas Adicionales Detectados

### Advertencias de React act()

Varios tests muestran advertencias sobre actualizaciones de estado no envueltas en `act()`. Estas son advertencias, no errores críticos, pero deberían corregirse para mejores prácticas:

- `Details.test.tsx`
- `ChangePassword.test.tsx`
- `EditProfile.test.tsx`
- `UsersTable.test.tsx`
- `useAllocationsView.test.ts`
- `useLocationView.test.ts`
- `useCareerView.test.ts`

### Advertencia de better-sqlite3

Muchos tests muestran una advertencia sobre `better-sqlite3` no pudiendo cargarse. Esto es esperado en el entorno de testing y no afecta los tests de renderer, pero los tests de `test/unit/main/queries` se omiten.

## Recomendaciones

1. **Mejorar manejo de async/await:** Considerar usar `findBy*` queries en lugar de `getBy*` cuando se espera que elementos aparezcan después de operaciones asíncronas.

2. **Wrapping en act():** Envolver las actualizaciones de estado en `act()` para eliminar las advertencias de React.

3. **Timeouts consistentes:** Establecer timeouts consistentes para todos los `waitFor()` en los tests.

4. **Mocking más completo:** Asegurar que todos los mocks necesarios estén configurados antes de renderizar los componentes.

## Problemas Restantes (9 tests aún fallando)

### 1. Tests de Botones - Problema de Renderizado

**Tests afectados:**
- `ManualAllocationView.test.tsx` - "renderiza el botón Deshacer otorgamiento"
- `FinalListView.test.tsx` - "renderiza el botón Deshacer otorgamiento"
- `AllocationsView.test.tsx` - "renderiza el botón Otorgar" y "renderiza el botón Deshacer otorgamiento"

**Problema:** Los botones están dentro de componentes `ConfirmDeleteDialog` que pueden no renderizarse inmediatamente. Los botones también pueden estar deshabilitados cuando `filteredAndSortedAllocations.length === 0`.

**Correcciones aplicadas:**
- Se agregó `waitFor` con timeout de 3000ms
- Se intentó buscar el botón con selector específico

**Solución pendiente:** Verificar que los datos se carguen correctamente antes de buscar el botón, o usar `findBy*` queries en lugar de `getBy*`.

### 2. Tests de Selectores Popover

**Tests afectados:**
- `AddManualAllocation.test.tsx` - "muestra aspirantes disponibles en el selector"
- `AddManualAllocation.test.tsx` - "muestra plazas disponibles en el selector"

**Problema:** Los comboboxes no tienen `aria-label` o `aria-labelledby` correctamente configurados, por lo que `getByRole("combobox", { name: /Aspirantes/i })` no funciona.

**Correcciones aplicadas:**
- Se cambió a buscar todos los comboboxes y seleccionar el correcto por índice
- Se aumentó el timeout a 3000ms

**Solución pendiente:** Verificar que el Popover se abra correctamente y que los items se rendericen.

### 3. Test de ChangePassword

**Test afectado:**
- `ChangePassword.test.tsx` - "changeUserPassword se llama con la nueva contraseña cuando los datos son válidos"

**Problema:** El botón sigue deshabilitado después de llenar el formulario. La validación se ejecuta en un `useEffect` que puede no haberse completado cuando se verifica.

**Correcciones aplicadas:**
- Se agregó timeout adicional y verificación doble del estado del botón

**Solución pendiente:** Asegurar que el `useEffect` de validación se complete antes de verificar el estado del botón, posiblemente usando `act()` de React Testing Library.

### 4. Test de Details

**Test afectado:**
- `Details.test.tsx` - "deleteUser se llama al confirmar eliminar cuenta"

**Problema:** El mock de `deleteUser` no se está llamando con los argumentos esperados.

**Correcciones aplicadas:**
- Se aumentó el timeout a 3000ms

**Solución pendiente:** Verificar que el flujo asíncrono se complete correctamente y que el mock se llame después de que el diálogo se confirme.

### 5. Test de EditProfile

**Test afectado:**
- `EditProfile.test.tsx` - "updateUser se llama con los datos correctos al enviar el formulario"

**Problema:** Timeout después de 5000ms. La mutación no se está completando.

**Correcciones aplicadas:**
- Se agregó mock para `getUsers`
- Se aumentó el timeout a 5000ms
- Se verificó que se llame con los parámetros correctos

**Solución pendiente:** Verificar que la mutación de React Query se complete correctamente. Puede ser necesario usar `waitFor` con una condición diferente o mockear el QueryClient de manera diferente.

## Próximos Pasos

1. **Investigar renderizado de botones:** Verificar por qué los botones dentro de `ConfirmDeleteDialog` no se encuentran. Puede ser necesario usar `findBy*` o verificar que el componente se monte completamente.

2. **Corregir selectores Popover:** Agregar `aria-label` o `aria-labelledby` a los comboboxes en el componente `AddManualAllocation` para mejorar la accesibilidad y los tests.

3. **Mejorar tests asíncronos:** Usar `act()` de React Testing Library para envolver las actualizaciones de estado y asegurar que los `useEffect` se completen antes de las verificaciones.

4. **Mockear React Query correctamente:** Asegurar que las mutaciones de React Query se completen en los tests, posiblemente usando `waitFor` con condiciones más específicas.

5. **Corregir advertencias de `act()`:** Envolver todas las actualizaciones de estado en `act()` para eliminar las advertencias de React.
