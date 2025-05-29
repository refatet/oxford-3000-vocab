/**
 * Accessibility utility functions for the Oxford 3000 vocabulary learning app
 */

/**
 * Trap focus within a specified element
 * @param containerElement Element to trap focus within
 * @param initialFocusElement Optional element to focus initially
 */
export function trapFocus(containerElement: HTMLElement, initialFocusElement?: HTMLElement): () => void {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Set initial focus if provided
  if (initialFocusElement) {
    initialFocusElement.focus();
  } else if (firstElement) {
    firstElement.focus();
  }
  
  // Handle tab key to keep focus trapped
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Allow escape key to close modal/dialog
    if (e.key === 'Escape') {
      document.dispatchEvent(new CustomEvent('accessibility-escape'));
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Save current focus and return a function to restore it
 */
export function saveFocus(): () => void {
  const previouslyFocused = document.activeElement as HTMLElement;
  
  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

/**
 * Announce message to screen readers
 * @param message Message to announce
 * @param priority Priority of announcement ('polite' or 'assertive')
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  // Create or get announcement element
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  } else {
    // Update priority if needed
    announcer.setAttribute('aria-live', priority);
  }
  
  // Clear and set content to trigger announcement
  announcer.textContent = '';
  
  // Use setTimeout to ensure announcement happens after a small delay
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}
