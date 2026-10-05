export const APP_ERROR_EVENT = 'finora:app-error'

export function notifyAppError(message) {
  window.dispatchEvent(new CustomEvent(APP_ERROR_EVENT, {
    detail: { message },
  }))
}
