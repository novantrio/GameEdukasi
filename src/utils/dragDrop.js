// src/utils/dragDrop.js
import { eventBus } from '../core/EventBus.js';

let activeSelectedItem = null;
let currentTargetListeners = [];

function clearGlobalSelection() {
  if (activeSelectedItem) {
    activeSelectedItem.classList.remove('selected-item');
    activeSelectedItem = null;
  }
  currentTargetListeners.forEach(fn => fn());
  currentTargetListeners = [];
  document.querySelectorAll('.slot-waiting, .drag-over').forEach(slot => {
    slot.classList.remove('slot-waiting', 'drag-over');
  });
}

// Reset selection on global stage click outside
window.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.draggable-shape, .draggable-size-item, .shape-slot, .size-slot')) {
    clearGlobalSelection();
  }
});

export function makeDraggable(element, dropTargets, onDropSuccess) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let hasMoved = false;

  // Prevent default native HTML drag
  element.setAttribute('draggable', 'false');
  element.ondragstart = (e) => e.preventDefault();

  const onPointerDown = (e) => {
    // Only respond to primary mouse click or touch
    if (e.button !== undefined && e.button !== 0) return;

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    hasMoved = false;

    element.setPointerCapture(e.pointerId);

    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerCancel);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      if (!hasMoved) {
        hasMoved = true;
        clearGlobalSelection();
        element.classList.add('dragging');
        eventBus.emit('sound:whoosh');
      }

      element.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.18)`;
      element.style.zIndex = '9999';

      // Check collision with drop targets
      const elemRect = element.getBoundingClientRect();
      dropTargets.forEach(target => {
        if (target.classList.contains('filled')) return;
        const tRect = target.getBoundingClientRect();

        // Cursor inside target OR bounding box overlap > 25%
        const cursorInside =
          e.clientX >= tRect.left &&
          e.clientX <= tRect.right &&
          e.clientY >= tRect.top &&
          e.clientY <= tRect.bottom;

        const overlapX = Math.max(0, Math.min(elemRect.right, tRect.right) - Math.max(elemRect.left, tRect.left));
        const overlapY = Math.max(0, Math.min(elemRect.bottom, tRect.bottom) - Math.max(elemRect.top, tRect.top));
        const overlapArea = overlapX * overlapY;
        const targetArea = tRect.width * tRect.height;
        const isOverlapping = targetArea > 0 && (overlapArea / targetArea > 0.25);

        if (cursorInside || isOverlapping) {
          target.classList.add('drag-over');
        } else {
          target.classList.remove('drag-over');
        }
      });
    }
  };

  const resetElementStyle = () => {
    element.classList.remove('dragging');
    element.style.transform = '';
    element.style.zIndex = '';
    dropTargets.forEach(t => t.classList.remove('drag-over'));
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;

    try {
      element.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerCancel);

    if (hasMoved) {
      // Process Drag-and-Drop Drop
      let matchedTarget = null;
      const elemRect = element.getBoundingClientRect();

      dropTargets.forEach(target => {
        if (target.classList.contains('filled')) return;
        const tRect = target.getBoundingClientRect();

        const cursorInside =
          e.clientX >= tRect.left &&
          e.clientX <= tRect.right &&
          e.clientY >= tRect.top &&
          e.clientY <= tRect.bottom;

        const overlapX = Math.max(0, Math.min(elemRect.right, tRect.right) - Math.max(elemRect.left, tRect.left));
        const overlapY = Math.max(0, Math.min(elemRect.bottom, tRect.bottom) - Math.max(elemRect.top, tRect.top));
        const overlapArea = overlapX * overlapY;
        const targetArea = tRect.width * tRect.height;
        const isOverlapping = targetArea > 0 && (overlapArea / targetArea > 0.25);

        if (cursorInside || isOverlapping) {
          matchedTarget = target;
        }
      });

      resetElementStyle();

      if (matchedTarget) {
        onDropSuccess(element, matchedTarget);
      }
    } else {
      // Process Tap-To-Select (Click to Select, then Click target to place)
      resetElementStyle();
      handleTapSelect();
    }
  };

  const handleTapSelect = () => {
    if (activeSelectedItem === element) {
      // Tapping selected item again deselects it
      clearGlobalSelection();
      eventBus.emit('sound:pop');
      return;
    }

    clearGlobalSelection();
    activeSelectedItem = element;
    element.classList.add('selected-item');
    eventBus.emit('sound:pop');

    // Show waiting pulse on all unfilled slots
    dropTargets.forEach(slot => {
      if (!slot.classList.contains('filled')) {
        slot.classList.add('slot-waiting');

        const slotClickHandler = (e) => {
          e.stopPropagation();
          const chosen = activeSelectedItem;
          clearGlobalSelection();
          if (chosen && chosen.parentNode) {
            onDropSuccess(chosen, slot);
          }
        };

        slot.addEventListener('click', slotClickHandler);
        currentTargetListeners.push(() => slot.removeEventListener('click', slotClickHandler));
      }
    });
  };

  const onPointerCancel = () => {
    isDragging = false;
    resetElementStyle();
  };

  element.addEventListener('pointerdown', onPointerDown);

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    resetElementStyle();
    clearGlobalSelection();
  };
}
