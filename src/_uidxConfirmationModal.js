// Nombre del archivo: _uidxConfirmModal.js
// Dependencias: _uidxUIToggleElement.js
import { UIToggleElement } from "./_uidxUIToggleElement.js";

export class ConfirmModalManager {
  // Instancia única (Singleton)
  static instance = null;

  constructor() {
    if (ConfirmModalManager.instance) {
      // Retornar la instancia existente si ya fue creada
      return ConfirmModalManager.instance;
    }

    // Obtener el contenedor principal del modal
    this.confirmModal = document.getElementById("uidxConfirmModalContainer");
    if (!this.confirmModal) {
      console.error("El contenedor del modal no existe en el DOM.");
      return;
    }

    // Crear el contenedor del modal una vez
    this.confirmModalWrapper = document.createElement("div");
    this.confirmModalWrapper.className = "uidxModalWrapper";

    // Añadir el contenedor al DOM
    this.confirmModal.appendChild(this.confirmModalWrapper);

    // Crear elementos del modal
    this.initModalElements();

    // Asociar eventos
    this.handleConfirmClick = null; // Callback dinámico
    this.handleCancelClick = null; // Callback dinámico
    this.handleEscapeKey = this.handleEscapeKey.bind(this);

    // Inicializar UIToggleElement
    this.confirmModalWrapperToggle = new UIToggleElement(this.confirmModal, {
      childElement: this.confirmModalWrapper,
      closeMethod: "display",
      opacityDuration: 300,
      removeAfterClose: false, // Reutilizar el modal
    });

    // Evento para cerrar al hacer clic en el fondo
    this.confirmModalWrapper.addEventListener("click", (event) => {
      if (event.target === this.confirmModalWrapper) {
        this.executeOnCancel(); // Ejecutar onCancel al hacer clic afuera
      }
    });

    ConfirmModalManager.instance = this; // Guardar la instancia
  }

  initModalElements() {
    const fragment = document.createDocumentFragment();

    // Botón de cierre (X)
    this.confirmModalCloseButtonX = document.createElement("button");
    this.confirmModalCloseButtonX.id = "confirmModalButtonCloseX";
    this.confirmModalCloseButtonX.className = "modal-close-btn";
    this.confirmModalCloseButtonX.textContent = "×";

    // Contenido del modal
    this.confirmModalContent = document.createElement("div");
    this.confirmModalContent.className = "uidxModalContent";

    // Título e ícono
    this.modalContentTitleContainer = document.createElement("div");
    this.modalContentTitleContainer.className = "uidxModalContent-title";
    this.modalContentTitleContainer.id = "confirmModalTitle";

    this.confirmModalIcon = document.createElement("i");
    this.confirmModalIcon.className = "fontello-icon-emojiModal";

    this.confirmModalTitle = document.createElement("h3");
    this.confirmModalTitle.textContent = "¿Estás seguro?";

    this.modalContentTitleContainer.appendChild(this.confirmModalIcon);
    this.modalContentTitleContainer.appendChild(this.confirmModalTitle);

    // Mensaje
    this.modalContentMessageContainer = document.createElement("div");
    this.modalContentMessageContainer.className =
      "uidxModalContent-message-container";
    this.modalContentMessageContainer.id = "confirmModalMessage";

    this.confirmModalMessage = document.createElement("p");
    this.confirmModalMessage.textContent = "Esta acción no se puede deshacer.";

    this.modalContentMessageContainer.appendChild(this.confirmModalMessage);

    // Contenedor de botones
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "uidxModalContent-buttons-container";

    // Botón Confirmar
    this.confirmButton = document.createElement("button");
    this.confirmButton.className = "uidxModalContent-confirm-btn";
    this.confirmButton.textContent = "Confirmar";

    // Botón Cancelar
    this.cancelButton = document.createElement("button");
    this.cancelButton.className = "uidxModalContent-cancel-btn";
    this.cancelButton.textContent = "Cancelar";

    // Añadir botones al contenedor
    this.buttonsContainer.appendChild(this.confirmButton);
    this.buttonsContainer.appendChild(this.cancelButton);

    // Construcción del modal
    this.confirmModalContent.appendChild(this.modalContentTitleContainer);
    this.confirmModalContent.appendChild(this.modalContentMessageContainer);
    this.confirmModalContent.appendChild(this.buttonsContainer);

    fragment.appendChild(this.confirmModalCloseButtonX);
    fragment.appendChild(this.confirmModalContent);

    this.confirmModalWrapper.innerHTML = ""; // Limpiar contenido anterior
    this.confirmModalWrapper.appendChild(fragment);
  }

  createConfirmModal({
    typeOfModal = "warning",
    titleModal = "¿Estás seguro?",
    typeOfIconModal = "icon-warning",
    messageModal = "Esta acción no se puede deshacer.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm = null, // Callback al confirmar
    onCancel = null, // Callback al cancelar
  }) {
    // Actualizar clases y contenido

    // Asegurar que typeOfModal es uno de los tipos permitidos
    const allowedTypes = ["success", "alert", "info", "warning"];
    if (!allowedTypes.includes(typeOfModal)) {
      console.warn(
        `Tipo de modal no reconocido: ${typeOfModal}. Se usará 'warning' por defecto.`
      );
      typeOfModal = "warning";
    }

    this.confirmModalContent.className = `uidxModalContent uidxModalContent--${typeOfModal}`;
    this.confirmModalTitle.textContent = titleModal;
    this.confirmModalIcon.className = `fontello-icon-emojiModal ${typeOfIconModal}`;
    this.confirmModalMessage.textContent = messageModal;
    this.confirmButton.textContent = confirmText;
    this.cancelButton.textContent = cancelText;

    // Actualizar clases de los botones si es necesario
    this.confirmButton.className = `uidxModalContent-confirm-btn uidxModalContent-confirm-btn--${typeOfModal}`;
    this.cancelButton.className = "uidxModalContent-cancel-btn";

    // Remover event listeners previos
    this.confirmButton.removeEventListener("click", this.handleConfirmClick);
    this.cancelButton.removeEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.removeEventListener(
      "click",
      this.handleCancelClick
    );

    // Asignar nuevas callbacks
    this.handleConfirmClick = () => {
      if (onConfirm && typeof onConfirm === "function") {
        onConfirm(); // Ejecutar la callback pasada
      }
      this.closeConfirmModal();
    };

    this.handleCancelClick = () => {
      if (onCancel && typeof onCancel === "function") {
        onCancel(); // Ejecutar la callback pasada
      }
      this.closeConfirmModal();
    };

    // Asignar event listeners
    this.confirmButton.addEventListener("click", this.handleConfirmClick);
    this.cancelButton.addEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.addEventListener(
      "click",
      this.handleCancelClick
    );

    // Evento para cerrar con la tecla Escape
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.addEventListener("keydown", this.handleEscapeKey);

    // Mostrar el modal
    this.confirmModalWrapperToggle.show("flex", "inline-block");
  }

  // Manejar la tecla Escape para cerrar el modal
  handleEscapeKey(event) {
    if (event.key === "Escape") {
      this.executeOnCancel(); // Ejecutar onCancel al presionar Escape
    }
  }

  // Ejecutar la callback onCancel
  executeOnCancel() {
    if (this.handleCancelClick) {
      this.handleCancelClick();
    } else {
      this.closeConfirmModal();
    }
  }

  closeConfirmModal() {
    // Remover event listeners de los botones
    this.confirmButton.removeEventListener("click", this.handleConfirmClick);
    this.cancelButton.removeEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.removeEventListener(
      "click",
      this.handleCancelClick
    );
    document.removeEventListener("keydown", this.handleEscapeKey);

    // Resetear callbacks
    this.handleConfirmClick = null;
    this.handleCancelClick = null;

    // Cerrar el modal
    this.confirmModalWrapperToggle.close();
  }
}
