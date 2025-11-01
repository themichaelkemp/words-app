import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {string} key - The key to listen for (e.g., 's', 'Enter')
 * @param {Function} callback - The function to call when shortcut is triggered
 * @param {Object} modifiers - Modifier keys { ctrl, shift, alt }
 */
export function useKeyboardShortcut(key, callback, modifiers = {}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const {
        ctrl = false,
        shift = false,
        alt = false,
        meta = false,
      } = modifiers;

      const matchesModifiers =
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta;

      const matchesKey =
        event.key.toLowerCase() === key.toLowerCase();

      if (matchesModifiers && matchesKey) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, modifiers]);
}

export default useKeyboardShortcut;
