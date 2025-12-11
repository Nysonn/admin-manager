import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard navigation
 * @param handlers Object containing keyboard event handlers
 * @param deps Dependencies array for the effect
 */
interface KeyboardHandlers {
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  [key: string]: (() => void) | undefined;
}

export const useKeyboardNavigation = (
  handlers: KeyboardHandlers,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          handlers.onEscape?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handlers.onArrowRight?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          handlers.onArrowDown?.();
          break;
        case 'Enter':
          handlers.onEnter?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
};

/**
 * Custom hook for managing focus trap in modals/dialogs
 * @param containerRef Ref to the container element
 * @param isOpen Whether the modal is open
 */
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isOpen: boolean
) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerRef, isOpen]);
};

/**
 * Custom hook for announcing content to screen readers
 * @param message Message to announce
 * @param priority Priority level ('polite' or 'assertive')
 */
export const useScreenReaderAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return announce;
};
