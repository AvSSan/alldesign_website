import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Order.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';

const initialFormData = {
  fio: '',
  email: '',
  object: '',
  phone: '',
  wishes: '',
  consent: false,
};

// Map field names to their corresponding Russian labels
const fieldLabels = {
  fio: 'ФИО',
  email: 'Электронная почта',
  object: 'Объект',
  phone: 'Номер телефона',
};

const Order = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    setErrorMessage('');

    try {
      const response = await axios.post('https://alldesignkhv.store/order/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData(initialFormData);
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error sending form:', error);
      setSubmitStatus('error');
      if (error.response) {
        setErrorMessage(`Server error: ${error.response.status} ${error.response.data.error || ''}`);
      } else if (error.request) {
        setErrorMessage('No response received from server. The request may have timed out.');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
      console.log(errorMessage);
    }
  };

  return (
    <div>
      <UniversalHeader />
      <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>ЗАЯВКА НА ДИЗАЙН-ПРОЕКТ</h1>
      <p className={styles.formDescription}>
        Заполните заявку на встречу, приложив всю имеющуюся информацию.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        {Object.keys(fieldLabels).map((field) => (
          <div key={field} className={styles.formField}>
            <label htmlFor={field}>{fieldLabels[field]}*</label>
            <input 
              type={field === 'email' ? 'email' : 'text'} 
              id={field} 
              name={field} 
              required={field !== 'object'}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className={styles.formField}>
          <label htmlFor="wishes">Ваши пожелания и дополнительная информация</label>
          <textarea 
            id="wishes" 
            name="wishes" 
            rows="4"
            value={formData.wishes}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className={styles.formField}>
          <input 
            type="checkbox" 
            id="consent" 
            name="consent" 
            required
            checked={formData.consent}
            onChange={handleChange}
          />
          <label htmlFor="consent" className={styles.checkboxLabel}>
            Я согласен на <a href="/privacy">обработку персональных данных</a>
          </label>
        </div>
        <button type="submit" className={styles.submitButton} disabled={submitStatus === 'sending'}>
          <span>{submitStatus === 'sending' ? 'Отправка...' : 'Отправить'}</span>
        </button>
        {submitStatus === 'success' && <p className={styles.successMessage}>Заявка успешно отправлена!</p>}
        {submitStatus === 'error' && <p className={styles.errorMessage}>Произошла ошибка при отправке. Попробуйте еще раз.</p>}
      </form>
    </div>
    <div id="contacts">
      <Contacts />
    </div>
    </div>
  );
};

export default Order;
