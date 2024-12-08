// Interfaz para las opciones de animación y visibilidad
interface ToggleOptions {
  removeAfterClose?: boolean; // Si se debe eliminar el elemento del DOM después de ocultarlo
  customClasses?: {
    // Clases personalizadas para visibilidad y animación
    visible?: string;
    hidden?: string;
    animation?: string;
    hiddenPosition?: string; // Clase personalizada para cambiar la posición después de ocultar
    noLayout?: string; // Clase personalizada para no afectar el layout
  };
  affectLayout?: boolean; // Nueva opción para determinar si afecta el layout
}

// Interfaz para los atributos del elemento
interface ElementAttributes {
  [key: string]: string;
}

// Clases de visibilidad por defecto
const VISIBILITY_CLASSES = {
  visible: "uidx-visible-opacity",
  hidden: "uidx-hidden-opacity",
  animation: "uidx-opacity-animation",
  hiddenPosition: "uidx-hidden-position",
  noLayout: "uidx-no-layout",
};

// Función para crear un nuevo elemento y agregarlo a un elemento padre o al body si no se proporciona un padre
export function createElement(
  tagName: string,
  attributes?: ElementAttributes,
  parent?: HTMLElement
): HTMLElement {
  const element = document.createElement(tagName);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (parent) {
    parent.appendChild(element);
  } else {
    document.body.appendChild(element);
  }

  return element;
}

// Función para mostrar un elemento con animación
export function showElement(
  element: HTMLElement,
  options: ToggleOptions = {}
): void {
  const { customClasses = {}, affectLayout = true } = options;

  const visibleClass = customClasses.visible || VISIBILITY_CLASSES.visible;
  const animationClass =
    customClasses.animation || VISIBILITY_CLASSES.animation;
  const hiddenPositionClass =
    customClasses.hiddenPosition || VISIBILITY_CLASSES.hiddenPosition;
  const noLayoutClass = customClasses.noLayout || VISIBILITY_CLASSES.noLayout;

  if (!affectLayout) {
    element.classList.add(noLayoutClass);
  }

  element.classList.remove(hiddenPositionClass);
  element.classList.add(animationClass);

  // Forzar reflow para que la transición funcione
  element.getBoundingClientRect();

  element.classList.remove(VISIBILITY_CLASSES.hidden);
  element.classList.add(visibleClass);
}

// Función para ocultar un elemento con animación
export function hideElement(
  element: HTMLElement,
  options: ToggleOptions = {}
): void {
  const {
    removeAfterClose = false,
    customClasses = {},
    affectLayout = true,
  } = options;

  const hiddenClass = customClasses.hidden || VISIBILITY_CLASSES.hidden;
  const animationClass =
    customClasses.animation || VISIBILITY_CLASSES.animation;
  const hiddenPositionClass =
    customClasses.hiddenPosition || VISIBILITY_CLASSES.hiddenPosition;
  const noLayoutClass = customClasses.noLayout || VISIBILITY_CLASSES.noLayout;

  element.classList.add(animationClass);

  // Forzar reflow para que la transición funcione
  element.getBoundingClientRect();

  element.classList.remove(VISIBILITY_CLASSES.visible);
  element.classList.add(hiddenClass);

  const durationMs =
    parseFloat(
      getComputedStyle(element).getPropertyValue(
        "--uidx-default-animation-duration"
      ) || "300"
    ) *
    (getComputedStyle(element)
      .getPropertyValue("--uidx-default-animation-duration")
      .includes("ms")
      ? 1
      : 1000);

  setTimeout(() => {
    element.classList.add(hiddenPositionClass);
    if (!affectLayout) {
      element.classList.remove(noLayoutClass);
    }
    if (removeAfterClose) {
      element.remove();
    }
  }, durationMs);
}

// Función para alternar la visibilidad de un elemento
export function toggleElement(
  element: HTMLElement,
  options: ToggleOptions = {}
): void {
  if (element.classList.contains(VISIBILITY_CLASSES.visible)) {
    hideElement(element, options);
  } else {
    showElement(element, options);
  }
}
