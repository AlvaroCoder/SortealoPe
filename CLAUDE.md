# CLAUDE.md — Sortealo Frontend

Guía de contexto persistente para el desarrollo de este proyecto mobile con Claude Code.

---

## Descripción del Proyecto

**Sortealo** es una app mobile para gestionar rifas/sorteos. Permite crear eventos, vender tickets, y monitorear métricas según el rol del usuario. Desarrollado por **COSAI**.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo SDK | 54 | Toolchain y librerías nativas |
| Expo Router | v6 | File-based routing |
| React | 19.1.0 | UI |
| AsyncStorage | 2.2.0 | Persistencia local (token JWT) |
| jwt-decode | 4.0.0 | Decodificación de tokens |
| react-native-gesture-handler | 2.28.0 | Drawer y gestos |
| react-native-reanimated | 4.1.1 | Animaciones |
| expo-image-picker | 17.0.8 | Subida de imágenes |
| expo-camera | 17.0.10 | Escáner QR |

> Los archivos son `.jsx` aunque TypeScript está configurado (`tsconfig.json`). El tema/colores sí usan `.ts`.

---

## Arquitectura de Navegación

La navegación sigue una jerarquía de 3 niveles:

```
app/_layout.jsx                    ← ROOT: RaffleProvider > AuthProvider > Stack
│
├── (auth)/                        ← Stack público (sin guardia)
│   ├── index.jsx                  ← Landing con splash de 3s + check isLogged
│   ├── login.jsx
│   ├── register.jsx
│   ├── validateCode.jsx           ← Verificación por código de email
│   └── forgot-password.jsx
│
└── (app)/                         ← Stack protegido: if !isLogged → redirect /(auth)/login
    ├── index.jsx                  ← Redirect inmediato a /(drawer)/home
    │
    ├── (drawer)/                  ← Drawer lateral dinámico según ROL
    │   ├── home/(tab)/            ← Tabs inferiores (pantalla principal)
    │   │   ├── index.jsx          ← Tab central FAB → "Crear evento" (MiniFormCreate)
    │   │   ├── history.jsx        ← "Mis Eventos" (fetch por userId + eventStatus)
    │   │   └── historyTickets.jsx ← "Mis Tickets"
    │   ├── mis-eventos.jsx
    │   └── profile.jsx
    │
    ├── event/
    │   ├── [id].jsx               ← Detalle de evento (métricas, progreso tickets)
    │   ├── create.jsx             ← Stepper 4 pasos para crear evento
    │   ├── edit.jsx               ← Edición de evento (precarga con useFetch)
    │   ├── asignados.jsx
    │   └── vendedores/[id].jsx
    │
    ├── tickets/
    │   ├── index.jsx
    │   └── sell/[id].jsx          ← Flujo de venta de ticket
    │
    ├── vendedores/                ← Gestión de vendedores (aún con mock data)
    │   ├── index.jsx
    │   ├── agregar/index.jsx
    │   ├── metrics/[id].jsx
    │   └── scan/index.jsx         ← Escáner QR con expo-camera
    │
    └── metricas/
        └── eventos/index.jsx
```

---

## Sistema de Contextos (Estado Global)

### AuthContext (`context/AuthContext.jsx`)
Gestiona autenticación JWT. Persiste el token en AsyncStorage.

```js
const { isLogged, userData, accessToken, loading, signin, signout, signUp, validateCode } = useAuthContext();
```

- `userData` = payload decodificado del JWT (`userId`, `email`, etc.)
- Al iniciar, lee el token de AsyncStorage y hace `jwtDecode(token)`
- `signin` → llama `LoginUser()` → guarda token → actualiza estado
- `signout` → elimina token de AsyncStorage → `isLogged = false`

### RaffleContext (`context/RaffleContext.jsx`)
Gestiona el rol activo del usuario en runtime.

```js
const { userRole, userId, updateRole, isAdmin, isSeller, isBuyer,
        canCreateEvent, canMonitorApp, canBuyTickets, canViewSales } = useRaffleContext();
```

**Roles disponibles:**
| Constante | Valor | Permisos |
|---|---|---|
| `USER_ROLES.ADMIN` | `'Administrador'` | Todo. Monitor, crear eventos, gestionar vendedores |
| `USER_ROLES.SELLER` | `'Vendedor'` | Crear eventos, ver ventas |
| `USER_ROLES.BUYER` | `'Comprador'` | Comprar tickets, ver tickets propios |

- El rol por defecto al iniciar es `ADMIN`
- El Drawer lateral cambia completamente según el rol activo
- Usar `isAdmin`, `isSeller`, `isBuyer` para renderizado condicional

---

## Capa de API (`Connections/`)

### URLs (`Connections/APIURLS.js`)
```js
BASE_URL = "http://192.168.1.2:8087/api/v1"  // IP local de desarrollo
```

Grupos de endpoints:
- `ENDPOINTS_LOGIN` → auth (login, register, verify, resend, refresh)
- `ENDPOINTS_EVENTS` → CRUD eventos, packs, categorías, upload imagen
- `ENDPOINTS_TICKETS` → estado de tickets
- `ENDPOINTS_TIKCETS` → colecciones (typo intencional en el código)

### Funciones de API por dominio
Cada dominio tiene su `Connections/<dominio>/index.js` con funciones nombradas:

```js
// Patrón: función nombrada que retorna fetch() crudo (sin procesar)
export async function CreateEvent(data, token) { ... }
export async function GetEventByIdEvent(idEvent, token) { ... }
export async function UpdateEvent(data, idEvent, token) { ... }
export async function UploadImage(image, token) { ... }  // multipart/form-data
```

> Todos los endpoints usan `Authorization: Bearer ${token}` en el header.

---

## Hooks y Utilidades (`lib/`)

### `useFetch(url, options?)` — Hook principal de datos
```js
const { data, loading, error } = useFetch(`${URL}${id}`);
```
- Internamente usa `fetchWithAuth` (maneja 401 + refresh automático)
- Tiene AbortController para cancelar en unmount
- Pasar `null` como URL para skip condicional: `useFetch(shouldFetch ? url : null)`

### `fetchWithAuth(url, options?)` — Fetch autenticado
- Lee token de AsyncStorage
- Si recibe 401 → llama `RefreshToken()` → reintenta con nuevo token
- Si refresh falla → elimina token de AsyncStorage

### `useUser()` — Datos del usuario desde AsyncStorage
```js
const { userData, token, loading } = useUser();
```
> **Nota:** Duplica funcionalidad de `AuthContext`. Preferir `useAuthContext()` cuando ya estés dentro del árbol de proveedores. Usar `useUser()` solo cuando necesites el token raw para llamadas directas a la API (como en `create.jsx` y `edit.jsx`).

### Otros
- `dateFormatter.js` → `useDateFormatter()` (formateo a español) + `formatterDateToISO()`
- `validate.js` → validaciones de formularios
- `useCategories.js` → hook para categorías de eventos

---

## Sistema de Diseño (`constants/theme.ts`)

### Paleta de colores principal
```js
import { Colors, Typography } from '@/constants/theme';

// Uso frecuente (destructurar al inicio de cada componente):
const GREEN_900 = Colors.principal.green[900];  // #004739 — color dominante
const GREEN_500 = Colors.principal.green[500];  // #16CD91 — acento
const RED_500   = Colors.principal.red[500];    // #D52941 — acción/peligro
const BLUE_500  = Colors.principal.blue[500];   // #1E82D9 — info
const NEUTRAL_700 = Colors.principal.neutral[700]; // #334155 — texto secundario
const NEUTRAL_200 = Colors.principal.neutral[200]; // #E2E8F0 — bordes
```

### Tipografía
```js
Typography.sizes    // xs:12, sm:14, base:16, lg:18, xl:20, '2xl':24, '3xl':30...
Typography.weights  // light, normal, medium, semibold, bold, extrabold
Typography.fonts    // sans, serif, rounded, mono (platform-aware)
```

### Helper de texto
```js
import { createTextStyle } from '@/constants/theme';
createTextStyle('lg', 'bold', 'sans')  // → { fontFamily, fontSize, fontWeight, lineHeight }
```

---

## Estructura de Componentes

```
components/
├── common/
│   ├── Buttons/         ← Button, ButtonGradiendt, ButtonVariant, ButtonIcon,
│   │                       ButtonDatePicker, ButtonUploadImage, ButtonLoginGoogle,
│   │                       ButtonProfileDrawer, ButtonActionAgregar, RoleSwitchButton
│   ├── Card/            ← CardEventMain, CardPriceTicket, CardTalonario,
│   │                       CardEmptyEventMain, ActionCard, MetricCard, EventListItem
│   ├── TextFields/      ← OutlineTextField, TextInputAvoiding
│   ├── Titles/          ← Title, Title2
│   ├── Texts/           ← TextPrevAccount
│   ├── Navigations/     ← HeaderBackNav, ProfileHeader
│   └── Dividers/        ← DividerO, QRVendedorModal
├── drawer/              ← DrawerAdministrador, DrawerVendedor, DrawerComprador
├── steps/               ← Step1Content, Step2Content, Step3Content,
│                           Step3ContentCategory, StepperHeader
├── tabs/                ← TabAdmin, TabVendedor, TabComprador
├── cards/               ← EventCard, EventCardTimeline, ProfileAvatar,
│                           ProfileRow, ProgressBar, VendorRankingRow, AnimationHome
└── forms/               ← MiniFormCreate

screens/                 ← Screens completos reutilizables (sin navegación propia)
├── LoadingScreen.jsx
├── CreateEventStepper.jsx
├── MonitorAdminDashboard.jsx
├── MonitorBuyerDashboard.jsx
├── MonitorSellerDashboard.jsx
└── ScreenHistoryTickets.jsx

views/                   ← Secciones compuestas (porciones de pantalla)
├── Monitor/             ← MonitorDashboard, TimelinePrincipalEvents
├── Bars/                ← RolSwitchBar
├── Sliders/             ← CarrouselViewMainCard, VendorListItem
├── SectionsButtons/     ← FloatinActionButtons, FloatingSellingButton
└── Form/                ← FormInitial
```

---

## Flujo de Autenticación

### Email/Password
```
(auth)/index.jsx  ← Splash 3s → si isLogged, redirect a app; si no, muestra botones
     ↓
login.jsx         ← signin(email, pass) → _storeToken(JWT) → router.replace(home)
register.jsx      ← signUp(data) → setUserData({ email }) → router.push(validateCode)
     ↓
validateCode.jsx  ← validateCode(email, code) → Alert OK → router.replace(login)
                  ← resendCode(email) → llama ResendNotification API real
```

### Google Sign-In
```
ButtonLoginGoogle → Google.useAuthRequest (expo-auth-session)
                  → promptAsync() → response.authentication.accessToken
                  → signInWithGoogle(accessToken) en AuthContext
                  → POST /auth/google { accessToken }
                  → _storeToken(JWT) → onSuccess() → router.replace(home)
```

### Forgot Password
```
login.jsx → "¿Olvidaste tu contraseña?" → router.push(forgot-password)
forgot-password.jsx → forgotPassword(email) → POST /auth/forgot-password
                    → estado sent=true → pantalla de confirmación
```

### Notas del AuthContext
- `_storeToken(token)` — helper interno: AsyncStorage + jwtDecode + setIsLogged(true)
- `signUp` almacena solo `{ email }` en `userData` (nunca la contraseña en state)
- `validateCode` no hace auto-login; redirige a login con Alert de éxito
- `signout` limpia AsyncStorage, userData y accessToken

---

## Flujo de Creación de Evento (4 pasos)

```
create.jsx (estado formData compartido)
│
├── Step 1 — Paquete de Tickets
│   campos: packId, collectionsQuantity, ticketsPerCollection
│
├── Step 2 — Detalles del Premio
│   campos: title, description, ticketPrice, ticketsPerCollection, place, date
│   validación inline con Alert
│
├── Step 3 — Categoría del Evento
│   campos: eventCategoryId
│   fetch de categorías desde API
│
└── Step 4 — Diseño y Archivos
    campos: image (file picker)
    onSubmit:
      1. UploadImage(image, token) → obtiene URL
      2. CreateEvent({ ...formData, hostId: userData.userId, date: ISO }, token)
      3. router.push('/(app)/(drawer)')
```

---

## Patrones y Convenciones

### Imports de colores (convención en todo el proyecto)
```js
// Al inicio del componente, destructurar los colores necesarios:
const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";  // o Colors.principal.white
```

### Renderizado condicional por rol
```js
const { isAdmin, isSeller } = useRaffleContext();
// En JSX:
{isAdmin && <FloatinActionButtons />}
{isAdmin && <TouchableOpacity onPress={() => router.push('event/edit')} />}
```

### Navegación con parámetros
```js
router.push({ pathname: 'event/edit', params: { id: eventId } });
// Recibir:
const { id } = useLocalSearchParams();
```

### Formularios con estado parcial
```js
const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
```

### KeyboardAvoidingView (estándar en forms)
```jsx
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  <ScrollView keyboardShouldPersistTaps="handled">
    ...
  </ScrollView>
</KeyboardAvoidingView>
```

### SafeAreaView (estándar en pantallas)
```jsx
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView style={styles.container} edges={['bottom']}>
```

---

## Deuda Técnica y Notas Importantes

1. **`useUser` vs `AuthContext`** — `useUser()` lee AsyncStorage directamente duplicando el token ya disponible en `AuthContext`. Preferir `useAuthContext()` salvo en componentes fuera del árbol de proveedores. Los IDs de cliente de Google en `ButtonLoginGoogle` están hardcodeados; deben moverse a `.env` antes de producción.

2. **Mock data en vendedores** — `app/(app)/vendedores/index.jsx` usa `mockVendors` hardcodeado. Pendiente conectar a API real.

3. **URL hardcodeada** — `BASE_URL` en `Connections/APIURLS.js` apunta a IP local `192.168.1.2:8087`. Debería venir de variables de entorno (`.env`).

4. **Typo en endpoint** — `ENDPOINTS_TIKCETS` (con typo) coexiste con `ENDPOINTS_TICKETS`. No renombrar sin actualizar todos los imports.

5. **Rol inicial hardcodeado** — `RaffleContext` inicia en `USER_ROLES.ADMIN`. En producción debe derivarse del JWT o de una llamada a la API.

6. **`ADD_COLLECTIONS_TICKETS`** — El endpoint tiene el ID hardcodeado: `${BASE_URL}/events/eventTickets/2`. Pendiente parametrizar.

---

## Comandos de Desarrollo

```bash
npx expo start          # Iniciar servidor de desarrollo
npx expo run:android    # Build Android
npx expo run:ios        # Build iOS
npm run lint            # ESLint
```