import { useState } from "react";

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState<{
    title: string;
    mensaje: string;
    action: () => void;
    actionButton?: string;
    closeButton?: string;
    linkText?: string;
    linkAction?: () => void;
  }>({
    title: "",
    mensaje: "",
    action: () => {},
    actionButton: "",
    closeButton: "Cerrar",
  });

  const openModal = (
    title: string,
    mensaje: string,
    action: () => void,
    actionButton: string = "",
    closeButton: string = "Cerrar",
    linkText?: string,
    linkAction?: () => void
  ) => {
    setModalProps({ title, mensaje, action, actionButton, closeButton, linkText, linkAction });
    setModalVisible(true);
  };

  return {
    modalVisible,
    setModalVisible,
    modalProps,
    openModal,
  };
};
