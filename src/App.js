import './App.css';
import React, { useState } from 'react';

const styles = {
  app: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  button: {
    width: '100%',
    padding: '20px',
    marginBottom: '8px',
    border: 'none',
    borderRadius: '2px',
    backgroundColor: 'blue',
    cursor: 'pointer',
    color: 'white',
    fontSize: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1.0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    color: 'white',
    background: 'black',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  modalHeader: {
    marginBottom: '20px',
  },
  modalBody: {
    marginBottom: '20px',
  },
  customAmountInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
  },
  headerLogo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const handleButtonClick = (amount) => {
    setSelectedAmount(amount);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const amount = selectedAmount === 'other' ? customAmount : selectedAmount;
    console.log(`Processing payment for €${amount}`);
    setIsModalOpen(false);
    setCustomAmount('');
  };

  return (
    <div style={styles.app} className='App'>
      <h1 id='header-logo'>Safe Card</h1>
      <button style={styles.button} onClick={() => handleButtonClick(2)}>
        €2
      </button>
      <button style={styles.button} onClick={() => handleButtonClick(5)}>
        €5
      </button>
      <button style={styles.button} onClick={() => handleButtonClick(10)}>
        €10
      </button>
      <button style={styles.button} onClick={() => handleButtonClick('other')}>
        Other
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={styles.modalHeader}>
          <h2>Confirm Payment</h2>
        </div>
        <div style={styles.modalBody}>
          {selectedAmount === 'other' ? (
            <div style={styles.customAmountInput}>
              <label>Enter amount in euros:</label>
              <input
                type='number'
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min='0'
                step='0.01'
                placeholder='Enter amount'
                style={styles.input}
              />
            </div>
          ) : (
            <p>Are you sure you want to pay €{selectedAmount}?</p>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelButton}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.confirmButton,
              opacity: selectedAmount === 'other' && !customAmount ? 0.5 : 1,
              cursor:
                selectedAmount === 'other' && !customAmount
                  ? 'not-allowed'
                  : 'pointer',
            }}
            onClick={handleConfirm}
            disabled={selectedAmount === 'other' && !customAmount}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
