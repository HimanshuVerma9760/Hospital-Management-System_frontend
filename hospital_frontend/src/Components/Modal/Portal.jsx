import React from "react";
import ReactDOM from "react-dom";
import { motion } from "motion/react";

const Portal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div style={styles.overlay}>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0}}
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "25rem",
    height: "10rem",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default Portal;
