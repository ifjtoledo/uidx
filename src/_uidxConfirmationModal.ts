// Archivo: _uidxConfirmModal.ts
// Dependencias: _uidxUIToggleElement.ts
import { UIToggleElement } from "./_uidxUIToggleElement";

type AllowedModalType = "success" | "alert" | "info" | "warning";

interface ConfirmModalOptions {
  typeOfModal?: AllowedModalType;
  titleModal?: string;
  typeOfIconModal?: string;
  messageModal?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  customClasses?: {
    visible?: string;
    hidden?: string;
    animation?: string;
    hiddenPosition?: string;
  };
}

// Clases por defecto para el ConfirmModal
const CONFIRM_MODAL_CLASSES = {
  contentBase: "uidxModalContent",
  iconBase: "fontello-icon-emojiModal",
  confirmButtonBase: "uidxModalContent-confirm-btn",
  cancelButtonBase: "uidxModalContent-cancel-btn",
};

const CONFIRM_MODAL_TYPES: AllowedModalType[] = [
  "info",
  "success",
  "warning",
  "alert",
];

export class ConfirmModalManager {
  private static instance: ConfirmModalManager | null = null;

  private confirmModal: HTMLElement;
  private confirmModalWrapper: HTMLElement;
  private confirmModalWrapperToggle?: UIToggleElement;
  private confirmModalCloseButtonX: HTMLButtonElement;
  private confirmModalContent: HTMLDivElement;
  private modalContentTitleContainer: HTMLDivElement;
  private confirmModalIcon: HTMLElement;
  private confirmModalTitle: HTMLHeadingElement;
  private modalContentMessageContainer: HTMLDivElement;
  private confirmModalMessage: HTMLParagraphElement;
  private buttonsContainer: HTMLDivElement;
  private confirmButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;

  private handleConfirmClick: () => void;
  private handleCancelClick: () => void;
  private handleEscapeKey: (event: KeyboardEvent) => void;

  private constructor() {
    const confirmModalElement = document.getElementById(
      "uidxConfirmModalContainer"
    );
    if (!confirmModalElement) {
      console.error("El contenedor del modal no existe en el DOM.");
      throw new Error("El contenedor del modal no existe en el DOM.");
    }
    this.confirmModal = confirmModalElement;

    this.confirmModalWrapper = document.createElement("div");
    this.confirmModalWrapper.className = "uidxModalWrapper";

    this.confirmModal.appendChild(this.confirmModalWrapper);

    const fragment = document.createDocumentFragment();

    this.confirmModalCloseButtonX = document.createElement("button");
    this.confirmModalCloseButtonX.id = "confirmModalButtonCloseX";
    this.confirmModalCloseButtonX.className = "modal-close-btn";
    this.confirmModalCloseButtonX.textContent = "×";

    this.confirmModalContent = document.createElement("div");
    this.confirmModalContent.className = CONFIRM_MODAL_CLASSES.contentBase;

    this.modalContentTitleContainer = document.createElement("div");
    this.modalContentTitleContainer.className = "uidxModalContent-title";
    this.modalContentTitleContainer.id = "confirmModalTitle";

    this.confirmModalIcon = document.createElement("i");
    this.confirmModalIcon.className = CONFIRM_MODAL_CLASSES.iconBase;

    this.confirmModalTitle = document.createElement("h3");
    this.confirmModalTitle.textContent = "";

    this.modalContentTitleContainer.appendChild(this.confirmModalIcon);
    this.modalContentTitleContainer.appendChild(this.confirmModalTitle);

    this.modalContentMessageContainer = document.createElement("div");
    this.modalContentMessageContainer.className =
      "uidxModalContent-message-container";
    this.modalContentMessageContainer.id = "confirmModalMessage";

    this.confirmModalMessage = document.createElement("p");
    this.confirmModalMessage.textContent = "";

    this.modalContentMessageContainer.appendChild(this.confirmModalMessage);

    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "uidxModalContent-buttons-container";

    this.confirmButton = document.createElement("button");
    this.confirmButton.id = "confirmModalConfirmBtn";
    this.confirmButton.className = CONFIRM_MODAL_CLASSES.confirmButtonBase;
    this.confirmButton.textContent = "";

    this.cancelButton = document.createElement("button");
    this.cancelButton.id = "confirmModalCancelBtn";
    this.cancelButton.className = CONFIRM_MODAL_CLASSES.cancelButtonBase;
    this.cancelButton.textContent = "";

    this.buttonsContainer.appendChild(this.confirmButton);
    this.buttonsContainer.appendChild(this.cancelButton);

    this.confirmModalContent.appendChild(this.modalContentTitleContainer);
    this.confirmModalContent.appendChild(this.modalContentMessageContainer);
    this.confirmModalContent.appendChild(this.buttonsContainer);

    fragment.appendChild(this.confirmModalCloseButtonX);
    fragment.appendChild(this.confirmModalContent);

    this.confirmModalWrapper.innerHTML = "";
    this.confirmModalWrapper.appendChild(fragment);

    this.handleConfirmClick = (): void => {
      this.closeConfirmModal();
    };

    this.handleCancelClick = (): void => {
      this.closeConfirmModal();
    };

    this.handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        this.closeConfirmModal();
      }
    };

    this.confirmModalWrapper.addEventListener("click", (event) => {
      if (event.target === this.confirmModalWrapper) {
        this.closeConfirmModal();
      }
    });
  }

  public static getInstance(): ConfirmModalManager {
    if (!ConfirmModalManager.instance) {
      ConfirmModalManager.instance = new ConfirmModalManager();
    }
    return ConfirmModalManager.instance;
  }

  public createConfirmModal(options: ConfirmModalOptions): void {
    let {
      typeOfModal = "warning",
      titleModal = "¿Estás seguro?",
      typeOfIconModal = "icon-warning",
      messageModal = "Esta acción no se puede deshacer.",
      confirmText = "Confirmar",
      cancelText = "Cancelar",
      onConfirm,
      onCancel,
      customClasses = {
        visible: "uidx-modal-visible--scale",
        hidden: "uidx-modal-hidden--scale",
        animation: "uidx-modal-animation-scale",
        hiddenPosition: "uidx-modal-hidden-position",
      },
    } = options;

    if (!CONFIRM_MODAL_TYPES.includes(typeOfModal)) {
      console.warn(
        `Tipo de modal no reconocido: ${typeOfModal}. Se usará 'warning' por defecto.`
      );
      typeOfModal = "warning";
    }

    if (this.confirmModalWrapperToggle) {
      this.confirmModalWrapperToggle.cleanup();
    }

    this.confirmModalWrapperToggle = new UIToggleElement(this.confirmModal, {
      childElement: this.confirmModalWrapper,
      removeAfterClose: false,
      isVisible: false,
      customClasses: customClasses,
    });

    const contentClass = `${CONFIRM_MODAL_CLASSES.contentBase} uidxModalContent--${typeOfModal}`;
    const iconClass = `${CONFIRM_MODAL_CLASSES.iconBase} ${typeOfIconModal}`;
    const confirmButtonClass = `${CONFIRM_MODAL_CLASSES.confirmButtonBase} uidxModalContent-confirm-btn--${typeOfModal}`;
    const cancelButtonClass = CONFIRM_MODAL_CLASSES.cancelButtonBase;

    this.confirmModalContent.className = contentClass;
    this.confirmModalIcon.className = iconClass;
    this.confirmButton.className = confirmButtonClass;
    this.cancelButton.className = cancelButtonClass;

    this.confirmModalTitle.textContent = titleModal;
    this.confirmModalMessage.textContent = messageModal;
    this.confirmButton.textContent = confirmText;
    this.cancelButton.textContent = cancelText;

    this.showModal(onConfirm, onCancel);
  }

  private showModal(onConfirm?: () => void, onCancel?: () => void): void {
    this.confirmButton.removeEventListener("click", this.handleConfirmClick);
    this.cancelButton.removeEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.removeEventListener(
      "click",
      this.handleCancelClick
    );

    this.handleConfirmClick = () => {
      onConfirm?.();
      this.closeConfirmModal();
    };
    this.handleCancelClick = () => {
      onCancel?.();
      this.closeConfirmModal();
    };

    this.confirmButton.addEventListener("click", this.handleConfirmClick);
    this.cancelButton.addEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.addEventListener(
      "click",
      this.handleCancelClick
    );

    document.removeEventListener("keydown", this.handleEscapeKey);
    document.addEventListener("keydown", this.handleEscapeKey);

    if (this.confirmModalWrapperToggle) {
      this.confirmModalWrapperToggle.show();
    }
  }

  private closeConfirmModal(): void {
    this.confirmButton.removeEventListener("click", this.handleConfirmClick);
    this.cancelButton.removeEventListener("click", this.handleCancelClick);
    this.confirmModalCloseButtonX.removeEventListener(
      "click",
      this.handleCancelClick
    );

    document.removeEventListener("keydown", this.handleEscapeKey);

    if (this.confirmModalWrapperToggle) {
      this.confirmModalWrapperToggle.close();
    }
  }
}
