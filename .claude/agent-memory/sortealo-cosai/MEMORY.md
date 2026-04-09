# Sortealo Frontend — Agent Memory

## Confirmed API Response Patterns
- Connection functions return raw `fetch` responses — always check `.ok` then call `.json()`
- `useFetch(url)` internally calls `.json()` and returns `{ data, loading, error }`
- `GetCollectionsByEvent` returns an array; seller is embedded as `collection.seller.id` or `collection.userId` (varies by backend version)
- `GenerateTicket` returns a ticket object with `.image` (Cloudinary URL) — also check `.imageUrl` as fallback
- `GetTicketsByCollection` returns tickets with `.ticketStatus.id` (1=disponible, 2=reservado, 3=comprado) and `.serialNumber` / `.code`
- `GET /events/{id}` does NOT accept `?eventStatus=` query param — do not append it

## ENDPOINTS_COLLECTIONS.GET_BY_EVENT URL pattern
- Value is `${BASE_URL}/collections` (no trailing `?` or `=`)
- Append `?eventId=` when using: `${ENDPOINTS_COLLECTIONS.GET_BY_EVENT}?eventId=${eventId}`

## Ticket Sell Flow (tickets/sell/[id].jsx)
- Fully implemented (replaced mock scaffold)
- Pattern: useEffect for collection (async action) → useFetch for tickets (reactive)
- Rollback: if BookTicket succeeds but ConfirmTicket/GenerateTicket fails, always call ReleaseTicket
- `isBooked` state flag tracks whether a rollback is needed on cancel

## Navigation: tickets stack
- `app/(app)/tickets/_layout.jsx` — Stack with 4 screens: `index`, `sell/[id]`, `vendedor/sell/[id]`, `claim`
- All screens use `HeaderBackNav` declared in layout; no header needed in the screen files
- `claim` screen: buyer deep-link landing — reads `reservationCode` from `useLocalSearchParams()`, shows QR + "Ir al inicio" button

## Deep Links (lib/deepLinks.js)
- `createTicketClaimURL(reservationCode)` uses `Linking.createURL` from `expo-linking`
- In Expo Go: `exp://IP:port/--/tickets/claim?reservationCode=...`
- In production standalone: `sortealope://tickets/claim?reservationCode=...`
- app.json scheme changed from `sortealofrontend` to `sortealope`
- Both sell screens (admin: `sell/[id].jsx` and vendor: `vendedor/sell/[id].jsx`) import from `lib/deepLinks`
- NEVER use hardcoded `https://sortealope.app/tickets?...` — always use `createTicketClaimURL`

## Navigation: vendedores/event stack
- `app/(app)/vendedores/event/[id].jsx` — Full sellers list for an event (FlatList ranked)
- Uses its own inline header with `router.back()` (no separate _layout.jsx needed)
- Reached from TopSellersCard "Ver todos" with `pathname: "/(app)/vendedores/event/[id]"`

## expo-image usage
- Import: `import { Image } from "expo-image"` (not react-native Image)
- Props: `source={{ uri }}`, `contentFit="contain"`, `transition={ms}`

## Multi-step screen pattern (local state stepper)
- Use integer step constants (STEP_SELECT=1, STEP_BUYER=2, etc.) rather than string enums
- Render helpers (`renderStep1`, `renderStep2`) called conditionally in JSX
- `resetFlow` with `useCallback` to reset all transient state back to Step 1
- `KeyboardAvoidingView` only on steps that have text inputs; Step 1 (grid) and Step 4 (success) do not need it

## Collection filter fallback
- If `collections.find(c => c.seller?.id === userId)` returns nothing AND there is only one collection, use it as fallback
- This covers backends that don't embed seller info in the collection response

## Colors confirmed in use
- `Colors.principal.yellow[100]` and `[700]` exist (EVENT_STATUS Pendiente bg/color)
- `Colors.principal.green[100]` exists (EVENT_STATUS Activo background)
- `Colors.principal.blue[50]` exists (info box background)
- `Colors.principal.green[50]` and `[100]` exist (ticket badge background/border)

## EVENT_STATUS constant pattern (event/[id].jsx)
- Always derive statusConfig from `EVENT_STATUS[event?.status] ?? EVENT_STATUS[1]`
- Never use route param `eventStatus` for statusConfig — use `event?.status` from API data
- `showBottomBar = eventStatus >= 2` intentionally uses route param (controls sell bar visibility)

## Key Components
- `components/cards/TopSellersCard.jsx` — Ranks collections by soldTickets, shows top 3, links to full list
- `components/cards/VendorRankingRow.jsx` — Single row: rank #, icon, name, tickets sold, sales total
- `app/(app)/vendedores/event/[id].jsx` — Full ranked seller list for an event (FlatList)
- `components/common/Dividers/ImportExcelModal.jsx` — Bottom-sheet modal: picks .xlsx/.xls via expo-document-picker, calls CreateCollectionsByExcel; props: visible, onClose, eventId

## Multipart Upload Pattern (collections Excel import)
- `CreateCollectionsByExcel` uses AsyncStorage + raw fetch (NOT fetchWithAuth) — same reason as UploadImage
- fetchWithAuth injects `Content-Type: application/json` which breaks multipart boundaries
- Pattern: `AsyncStorage.getItem("token")` → raw `fetch` with `Authorization` header only, no Content-Type

## Profile Image Upload (profile.jsx)
- Avatar tap → `ActionSheetIOS` (iOS) or `Alert` (Android) → launchPicker(useCamera)
- `ImagePicker.launchImageLibraryAsync` / `launchCameraAsync` with `allowsEditing:true, aspect:[1,1]`
- FormData: `formData.append("file", { uri, type: "image/ext", name: filename })`
- Chain: `UploadImage(formData)` → `.json()` → extract `url`/`imageUrl`/`image` → `UpdateUser({ image: url })`
- Local override state `avatarUri` reflects change without refetch
- User data image field: `userData?.image ?? userData?.profileImage ?? userData?.photo` (check all variants)
- `expo-image` `<Image>` used for photo display (`contentFit="cover"`, `transition={200}`)
- Camera badge: `position:absolute, bottom:6, right:6` inside `overflow:"hidden"` avatar ring

## Image Picker Flow (event creation Step 4)
- `lib/imageCropStore.js` — module-level store; `storePickedImage(value)` / `consumePickedImage()`
- `app/(app)/event/subirImagen.jsx` — full-screen picker (custom header, 16:9 preview, 3-col grid, sample images, local pick)
  - Registered in `app/(app)/event/_layout.jsx` with `headerShown: false`
  - Accepts `currentImageUri` param to restore selection state on re-entry
  - Calls `storePickedImage` then `router.back()` — consumer reads via `useFocusEffect`
- `components/steps/Step3Content.jsx` — consumes store in `useFocusEffect(useCallback(..., [setForm]))`
  - No longer imports ButtonUploadImage; uses inline image preview card + navigation
  - Preview card: 16:9 `aspectRatio` with "Cambiar imagen" overlay; placeholder: dashed area with camera icon
- `create.jsx handleSubmit` — branched: `typeof formData.image === 'string'` → use URL directly; else upload via UploadImage
- Sample images array stored in subirImagen.jsx (two Cloudinary URLs)
- Image picker options: `aspect:[16,9]`, `allowsEditing:true`, `quality:0.9`

## Event Creation Stepper — formData contract (create.jsx)
- ALL fields consumed by the payload MUST be in the initial `useState` — JS won't crash if missing but parseFloat(undefined)=NaN, Number(undefined)=NaN
- Required initial state fields: `title, description, date, place, collectionsQuantity, ticketsPerCollection, ticketPrice, packId, hostId, image, eventCategoryId, status`
- `ticketPrice` was historically missing from initial state — now fixed; always keep it there
- `date` validation must occur in BOTH Step2 `handleNext` AND `handleSubmit` (double guard)
- `parsedPrice` should be computed once before the payload and reused (avoid calling parseFloat twice)
- `ButtonDatePicker` delivers a JavaScript `Date` object to `onChange` (not a string) — `formatterDateToISO` handles it correctly via `new Date(dateValue)`

## File References
- See `patterns.md` for deeper architectural notes (linked from here)
