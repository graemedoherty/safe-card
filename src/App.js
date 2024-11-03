import './App.css';
import React, { useState, useRef } from 'react';

const styles = {
  app: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    width: '95%',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 40px)', // Account for app padding
    justifyContent: 'space-between',
  },
  headerSection: {
    textAlign: 'center',
  },
  middleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '2rem 0',
  },
  buttonSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  button: {
    width: '100%',
    padding: '20px',
    marginBottom: '10px',
    border: 'none',
    borderRadius: '5px',
    decoration: 'none',
    backgroundColor: '#20201e',
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'background-color 0.3s ease-in-out',
    opacity: 0,
    pointerEvents: 'none',
  },
  modalOverlayVisible: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    opacity: 1,
    pointerEvents: 'auto',
  },
  modalContent: {
    color: 'white',
    background: 'black',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    transform: 'scale(0.95)',
    opacity: 0,
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  },
  modalContentVisible: {
    transform: 'scale(1)',
    opacity: 1,
  },
  modalHeader: {
    marginBottom: '30px',
  },
  modalBody: {
    marginBottom: '30px',
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
    background: '#ffffff',
    color: '#000000',
  },
  modalFooter: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
    fontSize: '16px',
    transition: 'background-color 0.2s ease',
  },
  confirmButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
  },
  headerLogo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '8px',
  },
  successMessage: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '24px',
    color: '#ffffff',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  },
  successMessageVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  pinInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  pinBoxesContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  pinBox: {
    width: '40px',
    height: '40px',
    fontSize: '24px',
    textAlign: 'center',
    border: '2px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#000',
    caretColor: 'transparent',
  },
};

const PinInput = ({ onPinComplete, onPinChange }) => {
  const [pins, setPins] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) return;

    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    // Call the parent's onChange with the complete PIN
    onPinChange(newPins.join(''));

    if (value !== '') {
      // Move to next input
      if (index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }

    // Check if PIN is complete
    if (newPins.every((pin) => pin !== '') && value !== '') {
      onPinComplete(newPins.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && pins[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('');
    const newPins = [...pins];

    pastedData.forEach((value, index) => {
      if (index < 4 && /^\d$/.test(value)) {
        newPins[index] = value;
      }
    });

    setPins(newPins);
    onPinChange(newPins.join(''));

    if (newPins.every((pin) => pin !== '')) {
      onPinComplete(newPins.join(''));
    }
  };

  return (
    <div style={styles.pinBoxesContainer}>
      {pins.map((pin, index) => (
        <input
          key={index}
          type='text'
          maxLength={1}
          value={pin}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          style={styles.pinBox}
          ref={inputRefs[index]}
          inputMode='numeric'
          pattern='\d*'
        />
      ))}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        ...styles.modalOverlay,
        ...(isVisible ? styles.modalOverlayVisible : {}),
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalContent,
          ...(isVisible ? styles.modalContentVisible : {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [accountValue, setAccountValue] = useState(14.44);
  const [errorMessage, setErrorMessage] = useState('');
  const [pinAuth, setPinAuth] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const CORRECT_PIN = '1234';

  const handleButtonClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setErrorMessage('Please enter a valid number');
      return false;
    }
    if (numAmount <= 0) {
      setErrorMessage('Amount must be greater than 0');
      return false;
    }
    if (numAmount > 1000) {
      setErrorMessage('Amount cannot exceed €1000');
      return false;
    }
    return true;
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setErrorMessage('');
  };

  const handleConfirm = () => {
    let amountToAdd =
      selectedAmount === 'other' ? customAmount : selectedAmount;

    const numAmount = parseFloat(amountToAdd);

    if (!validateAmount(numAmount)) {
      return;
    }

    setAccountValue((prevValue) => {
      const newValue = parseFloat(prevValue) + numAmount;
      return newValue.toFixed(2);
    });

    setIsModalOpen(false);
    setCustomAmount('');
    setErrorMessage('');

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
    }, 2000);
  };

  const handlePinSubmit = () => {
    // Use pinInput directly from state since it's already been updated
    if (pinInput === CORRECT_PIN) {
      setPinAuth(true);
      setPinInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect PIN');
    }
  };

  const handlePinChange = (pin) => {
    setPinInput(pin);
    setErrorMessage('');
  };

  const handlePinComplete = (pin) => {
    // Update pinInput state and check the pin immediately
    setPinInput(pin);
    if (pin === CORRECT_PIN) {
      setPinAuth(true);
      setPinInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect PIN');
    }
  };

  return (
    <div style={styles.app} className='App'>
      {confirmed ? (
        <div
          style={{
            ...styles.successMessage,
            ...styles.successMessageVisible,
          }}
        >
          Money Deposited
        </div>
      ) : (
        <>
          <div className='Main' style={styles.main}>
            <div style={styles.headerSection}>
              <h1 id='header-logo'>Safe Card</h1>
            </div>

            <div style={styles.middleSection}>
              {!pinAuth ? (
                <div style={styles.pinInputContainer}>
                  <h6>Enter pin to see account</h6>
                  <PinInput
                    onPinComplete={handlePinComplete}
                    onPinChange={handlePinChange}
                  />
                  {/* <button
                    style={styles.confirmButton}
                    onClick={handlePinSubmit}
                    disabled={pinInput.length !== 4}
                  >
                    View Balance
                  </button> */}
                  {errorMessage && (
                    <div style={styles.errorMessage}>{errorMessage}</div>
                  )}
                </div>
              ) : (
                <h1 id='account'>€{accountValue}</h1>
              )}
            </div>

            <div style={styles.buttonSection}>
              <button
                style={styles.button}
                onClick={() => handleButtonClick(2)}
              >
                €2
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick(5)}
              >
                €5
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick(10)}
              >
                €10
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick('other')}
              >
                Other
              </button>
            </div>
          </div>

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
                    onChange={handleCustomAmountChange}
                    min='0.01'
                    step='0.01'
                    placeholder='Enter amount'
                    style={styles.input}
                  />
                  {errorMessage && (
                    <div style={styles.errorMessage}>{errorMessage}</div>
                  )}
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
                  opacity:
                    selectedAmount === 'other' &&
                    (!customAmount || !validateAmount(customAmount))
                      ? 0.5
                      : 1,
                  cursor:
                    selectedAmount === 'other' &&
                    (!customAmount || !validateAmount(customAmount))
                      ? 'not-allowed'
                      : 'pointer',
                }}
                onClick={handleConfirm}
                disabled={
                  selectedAmount === 'other' &&
                  (!customAmount || !validateAmount(customAmount))
                }
              >
                Confirm
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default App;
