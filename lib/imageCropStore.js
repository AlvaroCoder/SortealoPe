/**
 * imageCropStore.js
 *
 * Simple module-level store to pass the picked image between the subirImagen
 * screen and Step3Content without relying on navigation params (which can't
 * carry file objects or large URIs cleanly).
 *
 * Usage:
 *   - subirImagen.jsx calls storePickedImage(value) before router.back()
 *   - Step3Content.jsx calls consumePickedImage() in useFocusEffect to
 *     retrieve and clear the value in a single atomic read.
 */

let _pending = null;

/**
 * Store a picked image value.
 * @param {string | { uri: string, type: string, name: string }} value
 */
export function storePickedImage(value) {
  _pending = value;
}

/**
 * Consume the stored image value. Clears the store after reading.
 * @returns {string | { uri: string, type: string, name: string } | null}
 */
export function consumePickedImage() {
  const value = _pending;
  _pending = null;
  return value;
}