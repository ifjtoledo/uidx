// _uidxToggleElement.js
export class UIToggleElement {
  constructor(element, options = {}) {
    this.element = element;
    this.childElement = options.childElement || null;
    this.closeMethod = options.closeMethod || "display"; // 'display' o 'remove'
    this.removeAfterClose = options.removeAfterClose || false;
    this.opacityDuration = options.opacityDuration || 300;
    this.initialOpacity = options.initialOpacity || 0;
    this.initialDisplay = options.initialDisplay || "none";

    this.handleClick = this.handleClick.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);

    this.init();
  }

  init() {
    // Asegurar que la opacidad inicial es 0 (oculto)
    this.element.style.opacity = this.initialOpacity;
    this.element.style.display = this.initialDisplay;

    if (this.childElement) {
      this.childElement.style.opacity = "0";
      this.childElement.addEventListener("click", this.handleChildClick);
    }

    this.element.addEventListener("click", this.handleClick);
  }

  handleChildClick(event) {
    event.stopPropagation();
  }

  handleClick() {
    this.close();
  }

  show(displayType, displayChildType = null) {
    // Usar displayType si se proporciona; de lo contrario, obtenerlo con getDisplayType()
    const elementDisplayType = displayType || this.getDisplayType(this.element);

    // Establecer el display y opacity iniciales
    this.element.style.display = elementDisplayType;
    this.element.style.opacity = "0";

    // Forzar reflujo para asegurar que los estilos anteriores se apliquen
    this.element.offsetHeight; // Forzar reflujo

    // Ahora establecer la transición
    this.element.style.transition = `opacity ${this.opacityDuration}ms`;

    // Forzar otro reflujo para asegurarnos de que la transición se registre
    this.element.offsetHeight; // Forzar reflujo

    // Cambiar la opacidad a 1 para iniciar la transición
    this.element.style.opacity = "1";

    // Si hay un elemento hijo, hacemos lo mismo
    if (this.childElement) {
      const childDisplayType =
        displayChildType || this.getDisplayType(this.childElement);

      this.childElement.style.display = childDisplayType;
      this.childElement.style.opacity = "0";
      this.childElement.offsetHeight; // Forzar reflujo

      this.childElement.style.transition = `opacity ${this.opacityDuration}ms`;

      this.childElement.offsetHeight; // Forzar reflujo

      this.childElement.style.opacity = "1";
    }
  }

  close() {
    // Iniciar animación de fade-out en el elemento principal
    this.element.style.transition = `opacity ${this.opacityDuration}ms`;
    this.element.style.opacity = "0";

    // Si hay un elemento hijo, animarlo
    if (this.childElement) {
      this.childElement.style.transition = `opacity ${this.opacityDuration}ms`;
      this.childElement.style.opacity = "0";
    }

    setTimeout(() => {
      if (this.closeMethod === "display") {
        this.element.style.display = "none";
        if (this.childElement) {
          this.childElement.style.display = "none";
        }
      }

      if (this.removeAfterClose) {
        this.cleanup();
        if (this.childElement) {
          this.childElement.remove();
        } else {
          this.element.remove();
        }
      }
    }, this.opacityDuration);
  }
  cleanup() {
    this.element.removeEventListener("click", this.handleClick);
    if (this.childElement) {
      this.childElement.removeEventListener("click", this.handleChildClick);
    }
  }

  // Método para determinar el tipo de display por defecto
  getDisplayType(element) {
    const tag = element.tagName.toLowerCase();
    switch (tag) {
      case "div":
      case "section":
      case "header":
      case "footer":
      case "nav":
      case "article":
      case "aside":
        return "block";
      case "span":
      case "a":
      case "img":
      case "button":
      case "input":
        return "inline-block";
      case "ul":
      case "ol":
        return "block";
      case "li":
        return "list-item";
      default:
        return "block";
    }
  }
}
