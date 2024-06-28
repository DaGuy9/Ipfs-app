// MyComponent.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Modal Content</h2>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
};

export default MyComponent;