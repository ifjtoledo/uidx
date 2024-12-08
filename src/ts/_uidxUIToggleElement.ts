const VISIBILITY_CLASSES = {
  visible: "uidx-visible-opacity",
  hidden: "uidx-hidden-opacity",
  animation: "uidx-opacity-animation",
  hiddenPosition: "uidx-hidden-position",
  noLayout: "uidx-no-layout",
};

interface CustomClasses {
  visible?: string;
  hidden?: string;
  animation?: string;
  hiddenPosition?: string;
  noLayout?: string;
}

interface UIToggleElementOptions {
  childElement?: HTMLElement;
  removeAfterClose?: boolean;
  isVisible?: boolean;
  customClasses?: CustomClasses;
  affectLayout?: boolean; // Nueva opción para determinar si afecta el layout
}

// Función para eliminar clases de manera segura
function safelyRemoveClasses(
  element: HTMLElement,
  classes: (string | undefined)[]
): void {
  classes.forEach((className) => {
    if (className) {
      element.classList.remove(className);
    }
  });
}

// Función para agregar una clase de manera segura
function safelyAddClass(
  element: HTMLElement,
  className: string | undefined
): void {
  if (className) {
    element.classList.add(className);
  }
}

export class UIToggleElement {
  element: HTMLElement;
  childElement?: HTMLElement;
  removeAfterClose: boolean;
  isVisible: boolean;
  customClasses: CustomClasses;
  affectLayout: boolean;

  constructor(element: HTMLElement, options: UIToggleElementOptions = {}) {
    this.element = element;
    this.childElement = options.childElement;
    this.removeAfterClose = options.removeAfterClose || false;
    this.isVisible = options.isVisible || false;
    this.customClasses = options.customClasses || {};
    this.affectLayout =
      options.affectLayout !== undefined ? options.affectLayout : true;

    this.handleClick = this.handleClick.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);

    this.init();
  }

  init(): void {
    const { visible, hidden, animation, noLayout } = this.getClasses();

    // Eliminar clases de estado (predeterminadas y personalizadas)
    const classesToRemove = [
      VISIBILITY_CLASSES.visible,
      VISIBILITY_CLASSES.hidden,
      VISIBILITY_CLASSES.animation,
      VISIBILITY_CLASSES.hiddenPosition,
      VISIBILITY_CLASSES.noLayout,
      this.customClasses.visible,
      this.customClasses.hidden,
      this.customClasses.animation,
      this.customClasses.hiddenPosition,
      this.customClasses.noLayout,
    ];

    const filteredClassesToRemove = classesToRemove.filter(Boolean) as string[];

    safelyRemoveClasses(this.element, filteredClassesToRemove);
    safelyAddClass(this.element, animation);

    // Aplicar clase noLayout si no debe afectar el layout
    if (!this.affectLayout) {
      safelyAddClass(this.element, noLayout);
    }

    // Establecer la visibilidad inicial del elemento principal
    if (this.isVisible) {
      safelyAddClass(this.element, visible);
    } else {
      safelyAddClass(this.element, hidden);
    }

    // Configurar childElement si existe
    if (this.childElement) {
      safelyRemoveClasses(this.childElement, filteredClassesToRemove);
      safelyAddClass(this.childElement, animation);

      // Aplicar clase noLayout si no debe afectar el layout
      if (!this.affectLayout) {
        safelyAddClass(this.childElement, noLayout);
      }

      // Establecer la visibilidad inicial del childElement
      if (this.isVisible) {
        safelyAddClass(this.childElement, visible);
      } else {
        safelyAddClass(this.childElement, hidden);
      }

      this.childElement.addEventListener("click", this.handleChildClick);
    }

    this.element.addEventListener("click", this.handleClick);
  }

  updateOptions(options: Partial<UIToggleElementOptions>): void {
    if (options.customClasses !== undefined) {
      this.customClasses = options.customClasses;
    }
    if (options.removeAfterClose !== undefined) {
      this.removeAfterClose = options.removeAfterClose;
    }
    if (options.isVisible !== undefined) {
      this.isVisible = options.isVisible;
    }
    if (options.affectLayout !== undefined) {
      this.affectLayout = options.affectLayout;
    }
  }

  async show(): Promise<void> {
    const { visible, hidden, hiddenPosition, noLayout } = this.getClasses();

    safelyRemoveClasses(this.element, [hidden, hiddenPosition]);
    safelyAddClass(this.element, visible);

    if (!this.affectLayout) {
      safelyAddClass(this.element, noLayout);
    }

    if (this.childElement) {
      safelyRemoveClasses(this.childElement, [hidden, hiddenPosition]);
      safelyAddClass(this.childElement, visible);

      if (!this.affectLayout) {
        safelyAddClass(this.childElement, noLayout);
      }
    }

    await this.waitForAnimation();
    this.isVisible = true;
  }

  async close(): Promise<void> {
    const { visible, hidden, hiddenPosition, noLayout } = this.getClasses();

    safelyRemoveClasses(this.element, [visible]);
    safelyAddClass(this.element, hidden);

    if (this.childElement) {
      safelyRemoveClasses(this.childElement, [visible]);
      safelyAddClass(this.childElement, hidden);
    }

    await this.waitForAnimation();

    // Aplicar posición absoluta después de la animación
    safelyAddClass(this.element, hiddenPosition);
    if (this.childElement) {
      safelyAddClass(this.childElement, hiddenPosition);
    }

    if (this.removeAfterClose) {
      await this.waitForAnimation(); // Esperar la animación antes de eliminar
      if (this.childElement) {
        this.childElement.remove();
      }
      this.element.remove();
    }

    this.isVisible = false;
  }

  toggle(): void {
    this.isVisible ? this.close() : this.show();
  }

  cleanup(): void {
    const { visible, hidden, animation, hiddenPosition, noLayout } =
      this.getClasses();

    safelyRemoveClasses(this.element, [
      visible,
      hidden,
      animation,
      hiddenPosition,
      noLayout,
      VISIBILITY_CLASSES.visible,
      VISIBILITY_CLASSES.hidden,
      VISIBILITY_CLASSES.animation,
      VISIBILITY_CLASSES.hiddenPosition,
      VISIBILITY_CLASSES.noLayout,
    ]);

    this.element.removeEventListener("click", this.handleClick);

    if (this.childElement) {
      safelyRemoveClasses(this.childElement, [
        visible,
        hidden,
        animation,
        hiddenPosition,
        noLayout,
        VISIBILITY_CLASSES.visible,
        VISIBILITY_CLASSES.hidden,
        VISIBILITY_CLASSES.animation,
        VISIBILITY_CLASSES.hiddenPosition,
        VISIBILITY_CLASSES.noLayout,
      ]);

      this.childElement.removeEventListener("click", this.handleChildClick);
    }
  }

  private getClasses() {
    return {
      visible: this.customClasses.visible || VISIBILITY_CLASSES.visible,
      hidden: this.customClasses.hidden || VISIBILITY_CLASSES.hidden,
      animation: this.customClasses.animation || VISIBILITY_CLASSES.animation,
      hiddenPosition:
        this.customClasses.hiddenPosition || VISIBILITY_CLASSES.hiddenPosition,
      noLayout: this.customClasses.noLayout || VISIBILITY_CLASSES.noLayout,
    };
  }

  waitForAnimation(): Promise<void> {
    return new Promise((resolve) => {
      const duration = parseFloat(
        getComputedStyle(this.element).getPropertyValue(
          "--uidx-default-animation-duration"
        )
      );
      setTimeout(resolve, duration || 300);
    });
  }

  handleClick(): void {
    this.close();
  }

  handleChildClick(event: Event): void {
    event.stopPropagation();
  }
}
