// Archivo: _uidxAlertModal.ts
// Dependencias: _uidxUIToggleElement.ts
import { UIToggleElement } from "./_uidxUIToggleElement";

type AllowedModalType = "success" | "alert" | "info" | "warning";

interface AlertModalOptions {
  typeOfModal: AllowedModalType;
  titleModal: string;
  typeOfIconModal: string;
  messageModal: string;
  messageButton1: string;
  itemsList?: string[];
  customClasses?: {
    visible?: string;
    hidden?: string;
    animation?: string;
    hiddenPosition?: string;
  };
  modalClasses?: {
    alertModalContent?: string;
    alertModalIcon?: string;
    alertModalButton1?: string;
  };
}

// Clases por defecto para el AlertModal
const ALERT_MODAL_CLASSES = {
  contentBase: "uidxModalContent",
  iconBase: "fontello-icon-emojiModal",
  buttonBase: "uidxModalContent-alert-btn",
};

const ALERT_MODAL_TYPES: AllowedModalType[] = [
  "info",
  "success",
  "warning",
  "alert",
];

export class AlertModalManager {
  private static instance: AlertModalManager | null = null;

  private alertModal: HTMLElement;
  private alertModalWrapper: HTMLElement;
  private alertModalWrapperToggle?: UIToggleElement;
  private alertModalCloseButtonX: HTMLButtonElement;
  private alertModalContent: HTMLDivElement;
  private modalContentTitleContainer: HTMLDivElement;
  private alertModalIcon: HTMLElement;
  private alertModalTitle: HTMLHeadingElement;
  private modalContentMessageContainer: HTMLDivElement;
  private alertModalMessage: HTMLParagraphElement;
  private alertModalItemsList: HTMLUListElement;
  private alertModalButton1: HTMLButtonElement;

  private handleCloseButtonClick: () => void;
  private handleEscapeKey: (event: KeyboardEvent) => void;

  private constructor() {
    const alertModalElement = document.getElementById(
      "uidxAlertModalContainer"
    );
    if (!alertModalElement) {
      console.error("El contenedor del modal no existe en el DOM.");
      throw new Error("El contenedor del modal no existe en el DOM.");
    }
    this.alertModal = alertModalElement;

    this.alertModalWrapper = document.createElement("div");
    this.alertModalWrapper.className = "uidxModalWrapper";

    this.alertModal.appendChild(this.alertModalWrapper);

    const fragment = document.createDocumentFragment();

    this.alertModalCloseButtonX = document.createElement("button");
    this.alertModalCloseButtonX.id = "modalButtonCloseX";
    this.alertModalCloseButtonX.className = "modal-close-btn";
    this.alertModalCloseButtonX.textContent = "×";

    this.alertModalContent = document.createElement("div");
    this.alertModalContent.className = ALERT_MODAL_CLASSES.contentBase;

    this.modalContentTitleContainer = document.createElement("div");
    this.modalContentTitleContainer.className = "uidxModalContent-title";
    this.modalContentTitleContainer.id = "modalTitle";

    this.alertModalIcon = document.createElement("i");
    this.alertModalIcon.className = ALERT_MODAL_CLASSES.iconBase;

    this.alertModalTitle = document.createElement("h3");
    this.alertModalTitle.textContent = "";

    this.modalContentTitleContainer.appendChild(this.alertModalIcon);
    this.modalContentTitleContainer.appendChild(this.alertModalTitle);

    this.modalContentMessageContainer = document.createElement("div");
    this.modalContentMessageContainer.className =
      "uidxModalContent-message-container";
    this.modalContentMessageContainer.id = "modalMessage";

    this.alertModalMessage = document.createElement("p");
    this.alertModalMessage.textContent = "";

    this.alertModalItemsList = document.createElement("ul");

    this.modalContentMessageContainer.appendChild(this.alertModalMessage);
    this.modalContentMessageContainer.appendChild(this.alertModalItemsList);

    this.alertModalButton1 = document.createElement("button");
    this.alertModalButton1.id = "modalButton";
    this.alertModalButton1.className = ALERT_MODAL_CLASSES.buttonBase;
    this.alertModalButton1.textContent = "";

    this.alertModalContent.appendChild(this.modalContentTitleContainer);
    this.alertModalContent.appendChild(this.modalContentMessageContainer);
    this.alertModalContent.appendChild(this.alertModalButton1);

    fragment.appendChild(this.alertModalCloseButtonX);
    fragment.appendChild(this.alertModalContent);

    this.alertModalWrapper.innerHTML = "";
    this.alertModalWrapper.appendChild(fragment);

    this.handleCloseButtonClick = (): void => {
      this.closeAlertModal();
    };

    this.handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        this.closeAlertModal();
      }
    };

    this.alertModalWrapper.addEventListener("click", (event) => {
      if (event.target === this.alertModalWrapper) {
        this.closeAlertModal();
      }
    });
  }

  public static getInstance(): AlertModalManager {
    if (!AlertModalManager.instance) {
      AlertModalManager.instance = new AlertModalManager();
    }
    return AlertModalManager.instance;
  }

  public createAlertModal(options: AlertModalOptions): void {
    let {
      typeOfModal,
      titleModal,
      typeOfIconModal,
      messageModal,
      messageButton1,
      itemsList = [],
      customClasses = {
        visible: "uidx-modal-visible--scale",
        hidden: "uidx-modal-hidden--scale",
        animation: "uidx-modal-animation-scale",
        hiddenPosition: "uidx-modal-hidden-position",
      },
      modalClasses = {},
    } = options;

    if (!ALERT_MODAL_TYPES.includes(typeOfModal)) {
      console.warn(
        `Tipo de modal no reconocido: ${typeOfModal}. Se usará 'info' por defecto.`
      );
      typeOfModal = "info";
    }

    if (this.alertModalWrapperToggle) {
      this.alertModalWrapperToggle.cleanup();
    }

    this.alertModalWrapperToggle = new UIToggleElement(this.alertModal, {
      childElement: this.alertModalWrapper,
      removeAfterClose: false,
      isVisible: false,
      customClasses: customClasses,
    });

    const contentClass =
      modalClasses.alertModalContent ||
      `${ALERT_MODAL_CLASSES.contentBase} uidxModalContent--${typeOfModal}`;

    const iconClass =
      modalClasses.alertModalIcon ||
      `${ALERT_MODAL_CLASSES.iconBase} ${typeOfIconModal}`;

    const buttonClass =
      modalClasses.alertModalButton1 ||
      `${ALERT_MODAL_CLASSES.buttonBase} uidxModalContent-alert-btn--${typeOfModal}`;

    this.alertModalContent.className = contentClass;
    this.alertModalIcon.className = iconClass;
    this.alertModalButton1.className = buttonClass;

    this.alertModalTitle.textContent = titleModal;
    this.alertModalMessage.textContent = messageModal;
    this.alertModalButton1.textContent = messageButton1;

    this.alertModalItemsList.innerHTML = "";
    if (itemsList.length > 0) {
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

  private showModal(): void {
    this.alertModalButton1.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );

    this.alertModalButton1.addEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.addEventListener(
      "click",
      this.handleCloseButtonClick
    );

    document.removeEventListener("keydown", this.handleEscapeKey);
    document.addEventListener("keydown", this.handleEscapeKey);

    if (this.alertModalWrapperToggle) {
      this.alertModalWrapperToggle.show();
    }
  }

  private closeAlertModal(): void {
    this.alertModalButton1.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );
    this.alertModalCloseButtonX.removeEventListener(
      "click",
      this.handleCloseButtonClick
    );

    document.removeEventListener("keydown", this.handleEscapeKey);

    if (this.alertModalWrapperToggle) {
      this.alertModalWrapperToggle.close();
    }
  }
}
