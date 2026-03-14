# Sortealo Frontend — Agent Memory

## Confirmed API Response Patterns
- Connection functions return raw `fetch` responses — always check `.ok` then call `.json()`
- `useFetch(url)` internally calls `.json()` and returns `{ data, loading, error }`
- `GetCollectionsByEvent` returns an array; seller is embedded as `collection.seller.id` or `collection.userId` (varies by backend version)
- `GenerateTicket` returns a ticket object with `.image` (Cloudinary URL) — also check `.imageUrl` as fallback
- `GetTicketsByCollection` returns tickets with `.ticketStatus.id` (1=disponible, 2=reservado, 3=comprado) and `.serialNumber` / `.code`

## Ticket Sell Flow (tickets/sell/[id].jsx)
- Fully implemented (replaced mock scaffold)
- Pattern: useEffect for collection (async action) → useFetch for tickets (reactive)
- Rollback: if BookTicket succeeds but ConfirmTicket/GenerateTicket fails, always call ReleaseTicket
- `isBooked` state flag tracks whether a rollback is needed on cancel

## Navigation: tickets stack
- `app/(app)/tickets/_layout.jsx` — Stack with two screens: `index` and `sell/[id]`
- Both screens use `HeaderBackNav` (declared in layout, no header needed in screen)
- No `_layout.jsx` needed inside `sell/` folder

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
- `Colors.principal.yellow[700]` exists (used for reserved ticket text)
- `Colors.principal.blue[50]` exists (info box background)
- `Colors.principal.green[50]` and `[100]` exist (ticket badge background/border)

## File References
- See `patterns.md` for deeper architectural notes (linked from here)
