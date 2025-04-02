import React from "react";
import ReactDOM from "react-dom";
import { motion } from "motion/react";
import { cyan, indigo } from "@mui/material/colors";

const Portal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div style={styles.overlay}>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition="1.5s"
        style={styles.modal}
      >
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </motion.div>
    </div>,
    document.getElementById("root")
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
    backdropFilter: "blur(4px)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    animation: "fadeIn 0.3s ease-out",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#555",
    transition: "color 0.2s",
  },
  closeButtonHover: {
    color: "#000",
  },
};

export default Portal;
