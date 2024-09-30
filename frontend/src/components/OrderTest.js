import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Order.module.css';

const api = axios.create({
  baseURL: 'https://alldesignkhv.store',
  withCredentials: true,
});

const initialFormData = {
  fio: '',
  email: '',
  object: '',
  phone: '',
  wishes: '',
  consent: false,
};

const OrderTest = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [fio, setFio] = useState('');
    const [email, setEmail] = useState('');
    const [object, setObject] = useState('');
    const [phone, setPhone] = useState('');
    const [wishes, setWishes] = useState('');
  
  
    function MessagePublish(e) {
        e.preventDefault();
        api.post(
          '/api/ordertest/',
          {
            fio: fio,
            email: email,
            object: object,
            phone: phone,
            wishes: wishes
          }
        ).then(function(res) {
          return res.data;
        }).catch(function(error) {
          alert("Что-то не так в введенных данных либо такого пользователя не существует");
          console.error(error);
        });
      }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>ЗАЯВКА НА ДИЗАЙН-ПРОЕКТ</h1>
      <p className={styles.formDescription}>
        Заполните заявку на встречу, приложив всю имеющуюся информацию.
      </p>
      <form className={styles.form} onSubmit={MessagePublish}>
        <div className={styles.formField}>
          <label htmlFor="fio">ФИО</label>
          <textarea 
            id="fio" 
            name="fio" 
            rows="1"
            value={fio}
            onChange={e => setFio(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formField}>
          <label htmlFor="email">Электронная почта</label>
          <textarea 
            id="email" 
            name="email" 
            rows="1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formField}>
          <label htmlFor="object">Объект</label>
          <textarea 
            id="object" 
            name="object" 
            rows="1"
            value={object}
            onChange={e => setObject(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formField}>
          <label htmlFor="phone">Номер телефона</label>
          <textarea 
            id="phone" 
            name="phone" 
            rows="4"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formField}>
          <label htmlFor="wishes">Ваши пожелания и дополнительная информация</label>
          <textarea 
            id="wishes" 
            name="wishes" 
            rows="4"
            value={wishes}
            onChange={e => setWishes(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton} disabled={submitStatus === 'sending'}>
          {submitStatus === 'sending' ? 'Отправка...' : 'Отправить заявку'}
        </button>
        {submitStatus === 'success' && <p className={styles.successMessage}>Заявка успешно отправлена!</p>}
        {submitStatus === 'error' && <p className={styles.errorMessage}>Произошла ошибка при отправке. Попробуйте еще раз.</p>}
      </form>
    </div>
  );
};

export default OrderTest;