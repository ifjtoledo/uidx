// Nombre del archivo: _uidxAlertModal.js
// Dependencias: _uidxUIToggleElement.js
import { UIToggleElement } from "./_uidxUIToggleElement.js";

export class AlertModalManager {
  // Instancia única (Singleton)
  static instance = null;

  constructor() {
    if (AlertModalManager.instance) {
      // Retornar la instancia existente si ya fue creada
      return AlertModalManager.instance;
    }

    // Obtener el contenedor principal del modal
    this.alertModal = document.getElementById("uidxAlertModalContainer");
    if (!this.alertModal) {
      console.error("El contenedor del modal no existe en el DOM.");
      return;
    }

    // Crear el contenedor del modal una vez
    this.alertModalWrapper = document.createElement("div");
    this.alertModalWrapper.className = "uidxModalWrapper";

    // Añadir el contenedor al DOM
    this.alertModal.appendChild(this.alertModalWrapper);

    // Crear elementos del modal
    this.initModalElements();

    // Asociar eventos
    this.handleCloseButtonClick = this.closeAlertModal.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);

    // Inicializar UIToggleElement
    this.alertModalWrapperToggle = new UIToggleElement(this.alertModal, {
      childElement: this.alertModalWrapper,
      closeMethod: "display",
      opacityDuration: 300,
      removeAfterClose: false, // Reutilizar el modal
    });

    // Agregar evento para cerrar al hacer clic en el fondo
    this.alertModalWrapper.addEventListener("click", (event) => {
      if (event.target === this.alertModalWrapper) {
        this.closeAlertModal();
      }
    });

    AlertModalManager.instance = this; // Guardar la instancia
  }

  // Inicializar los elementos del modal y guardarlos como propiedades
  initModalElements() {
    const fragment = document.createDocumentFragment();

    // Botón de cierre (X)
    this.alertModalCloseButtonX = document.createElement("button");
    this.alertModalCloseButtonX.id = "modalButtonCloseX";
    this.alertModalCloseButtonX.className = "modal-close-btn";
    this.alertModalCloseButtonX.textContent = "×";

    // Contenido del modal
    this.alertModalContent = document.createElement("div");
    this.alertModalContent.className = "uidxModalContent";

    // Título e ícono
    this.modalContentTitleContainer = document.createElement("div");
    this.modalContentTitleContainer.className = "uidxModalContent-title";
    this.modalContentTitleContainer.id = "modalTitle";

    this.alertModalIcon = document.createElement("i");
    this.alertModalIcon.className = "fontello-icon-emojiModal";

    this.alertModalTitle = document.createElement("h3");
    this.alertModalTitle.textContent = "¡Operación Exitosa!";

    this.modalContentTitleContainer.appendChild(this.alertModalIcon);
    this.modalContentTitleContainer.appendChild(this.alertModalTitle);

    // Mensaje
    this.modalContentMessageContainer = document.createElement("div");
    this.modalContentMessageContainer.className =
      "uidxModalContent-message-container";
    this.modalContentMessageContainer.id = "modalMessage";

    this.alertModalMessage = document.createElement("p");
    this.alertModalMessage.textContent = "";

    this.alertModalItemsList = document.createElement("ul");
    // Opcional: No agregamos ítems por defecto

    this.modalContentMessageContainer.appendChild(this.alertModalMessage);
    this.modalContentMessageContainer.appendChild(this.alertModalItemsList);

    // Botón principal
    this.alertModalButton1 = document.createElement("button");
    this.alertModalButton1.id = "modalButton";
    this.alertModalButton1.className = "uidxModalContent-alert-btn";
    this.alertModalButton1.textContent = "";

    // Construcción del modal
    this.alertModalContent.appendChild(this.modalContentTitleContainer);
    this.alertModalContent.appendChild(this.modalContentMessageContainer);
    this.alertModalContent.appendChild(this.alertModalButton1);

    fragment.appendChild(this.alertModalCloseButtonX);
    fragment.appendChild(this.alertModalContent);

    this.alertModalWrapper.innerHTML = ""; // Limpiar contenido anterior
    this.alertModalWrapper.appendChild(fragment);
  }

  // Función para crear o actualizar el modal de alerta
  createAlertModal(
    typeOfModal,
    titleModal,
    typeOfIconModal,
    messageModal,
    messageButton1,
    itemsList = []
  ) {
    // Actualizar clases y contenido

    // Asegurar que typeOfModal es uno de los tipos permitidos
    const allowedTypes = ["success", "alert", "info"];
    if (!allowedTypes.includes(typeOfModal)) {
      console.warn(
        `Tipo de modal no reconocido: ${typeOfModal}. Se usará 'info' por defecto.`
      );
      typeOfModal = "info";
    }

    this.alertModalContent.className = `uidxModalContent uidxModalContent--${typeOfModal}`;
    this.alertModalTitle.textContent = titleModal;
    this.alertModalIcon.className = `fontello-icon-emojiModal ${typeOfIconModal}`;
    this.alertModalMessage.textContent = messageModal;
    this.alertModalButton1.textContent = messageButton1;

    // Actualizar clase del botón
    this.alertModalButton1.className = `uidxModalContent-alert-btn uidxModalContent-alert-btn--${typeOfModal}`;

    // Limpiar y actualizar la lista de ítems
    this.alertModalItemsList.innerHTML = "";
    if (itemsList && itemsList.length > 0) {
      itemsList.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        this.alertModalItemsList.appendChild(li);
      });
      this.alertModalItemsList.style.display = "block";
    } else {
      this.alertModalItemsList.style.display = "none";
    }

    this.showModal();
  }

  showModal() {
    // Eliminar event listeners previos si existen
    this.alertModalButton1.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );

    // Agregar event listeners a los botones de cerrar
    this.alertModalButton1.addEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.addEventListener(
      "click",
      this.handleCloseButtonClick
    );

    // Evento para cerrar con la tecla Escape
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.addEventListener("keydown", this.handleEscapeKey);

    // Mostrar el modal
    this.alertModalWrapperToggle.show("flex", "inline-block");
  }

  // Función para cerrar el modal de alerta
  closeAlertModal() {
    // Remover event listeners de los botones
    this.alertModalButton1.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );

    // Remover evento de tecla Escape
    document.removeEventListener("keydown", this.handleEscapeKey);

    // Cerrar el modal
    this.alertModalWrapperToggle.close();
  }

  // Manejar la tecla Escape para cerrar el modal
  handleEscapeKey(event) {
    if (event.key === "Escape") {
      this.closeAlertModal();
    }
  }
}
