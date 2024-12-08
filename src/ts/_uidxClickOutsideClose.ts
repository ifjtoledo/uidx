// Archivo: _uidxClickOutsideClose.ts

// Clases de visibilidad por defecto
export const VISIBILITY_CLASSES = {
  visible: "uidx-visible-opacity",
  hidden: "uidx-hidden-opacity",
  animation: "uidx-opacity-animation",
  hiddenPosition: "uidx-hidden-position",
  noLayout: "uidx-no-layout",
};

// Interfaz para las opciones de configuración
interface ClickOutsideOptions {
  removeAfterClose?: boolean;
  isVisible?: boolean;
  affectLayout?: boolean;
  customClasses?: {
    visible?: string;
    hidden?: string;
    animation?: string;
    hiddenPosition?: string;
    noLayout?: string;
  };
}

// Conjunto de elementos ya inicializados
const initializedElements = new Set<HTMLElement>();

// Función para inicializar el comportamiento de ocultar elementos al hacer clic fuera de ellos
export function initClickOutsideClose(options: ClickOutsideOptions = {}) {
  // Seleccionar todos los elementos con la clase 'uidxSelfCloseOutsideClick'
  const elements = document.querySelectorAll<HTMLElement>(
    ".uidxSelfCloseOutsideClick"
  );

  elements.forEach((element) => {
    // Evitar inicializar elementos que ya han sido inicializados
    if (initializedElements.has(element)) {
      return;
    }

    // Marcar el elemento como inicializado
    initializedElements.add(element);

    // Prevenir la propagación del clic dentro del elemento
    element.addEventListener("click", (event: Event) => {
      event.stopPropagation();
    });

    // Manejar el clic en el botón de cierre si el atributo data-has-close-button está presente
    if (element.dataset.hasCloseButton === "true") {
      const closeButton = element.querySelector(".bulma-delete");
      if (closeButton) {
        closeButton.addEventListener("click", (event: Event) => {
          event.stopPropagation();
          // Aplicar clases para desaparecer con gracia
          const customClasses = options.customClasses || {};
          element.classList.add(
            customClasses.hidden || VISIBILITY_CLASSES.hidden,
            customClasses.animation || VISIBILITY_CLASSES.animation
          );
          element.classList.remove(
            customClasses.visible || VISIBILITY_CLASSES.visible
          );

          // Obtener valores de atributos con valores por defecto
          const removeAfterClose =
            options.removeAfterClose ??
            element.dataset.removeAfterClose === "true";

          // Opcionalmente, remover el elemento después de la animación
          if (removeAfterClose) {
            setTimeout(() => {
              element.remove();
              initializedElements.delete(element); // Remover del conjunto de inicializados
            }, parseFloat(getComputedStyle(element).getPropertyValue("--uidx-default-animation-duration")) || 250);
          }
        });
      }
    }

    // Obtener el elemento padre si está especificado en data-parent-element
    const parentSelector = element.dataset.parentElement;
    const parentElement = parentSelector
      ? (document.querySelector(parentSelector) as HTMLElement)
      : document.body;

    // Manejar el clic en el elemento padre o en el documento
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Verificar si el clic ocurrió fuera del elemento y dentro del elemento padre
      if (!element.contains(target) && parentElement.contains(target)) {
        // Aplicar clases para desaparecer con gracia
        const customClasses = options.customClasses || {};
        element.classList.add(
          customClasses.hidden || VISIBILITY_CLASSES.hidden,
          customClasses.animation || VISIBILITY_CLASSES.animation
        );
        element.classList.remove(
          customClasses.visible || VISIBILITY_CLASSES.visible
        );

        // Obtener valores de atributos con valores por defecto
        const removeAfterClose =
          options.removeAfterClose ??
          element.dataset.removeAfterClose === "true";

        // Opcionalmente, remover el elemento después de la animación
        if (removeAfterClose) {
          setTimeout(() => {
            element.remove();
            initializedElements.delete(element); // Remover del conjunto de inicializados
          }, parseFloat(getComputedStyle(element).getPropertyValue("--uidx-default-animation-duration")) || 250);
        }
      }
    };

    // Agregar el event listener al elemento padre o al documento
    if (parentElement === document.body) {
      document.addEventListener("click", clickHandler);
    } else {
      parentElement.addEventListener("click", clickHandler);
    }
  });
}
