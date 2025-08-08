import React, { useEffect, useState } from 'react';
import styles from '../styles/Privacy.module.css';
import UniversalHeader from './UniversalHeader';
import Contacts from './mainpage/Contacts';

const Privacy = () => {
  const [policyContent, setPolicyContent] = useState('');

  useEffect(() => {
    fetch('/Обработка персональных данных.txt')
      .then(response => response.text())
      .then(data => {
        setPolicyContent(data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке файла политики:', error);
      });
  }, []);

  const renderFormattedPolicy = () => {
    if (!policyContent) return <p>Загрузка...</p>;

    const sections = policyContent.split(/^\d+\./gm);
    
    return (
      <>
        <h1 className={styles.title}>{sections[0].trim()}</h1>
        
        {sections.slice(1).map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim());
          const title = lines[0];
          
          return (
            <div key={index} className={styles.section}>
              <h2 className={styles.sectionTitle}>{`${index + 1}. ${title}`}</h2>
              
              {lines.slice(1).map((paragraph, pIndex) => {
                // Обработка таблицы (раздел 6)
                if (index === 5 && pIndex === 0) {
                  return (
                    <table className={styles.table} key={`table-${pIndex}`}>
                      <thead>
                        <tr>
                          <th>Параметр</th>
                          <th>Значение</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Цель обработки</td>
                          <td>информирование Пользователя посредством отправки электронных писем</td>
                        </tr>
                        <tr>
                          <td>Персональные данные</td>
                          <td>
                            <ul className={styles.list}>
                              <li className={styles.listItem}>фамилия, имя, отчество</li>
                              <li className={styles.listItem}>электронный адрес</li>
                              <li className={styles.listItem}>номера телефонов</li>
                            </ul>
                          </td>
                        </tr>
                        <tr>
                          <td>Правовые основания</td>
                          <td>договоры, заключаемые между оператором и субъектом персональных данных</td>
                        </tr>
                        <tr>
                          <td>Виды обработки персональных данных</td>
                          <td>Отправка информационных писем на адрес электронной почты</td>
                        </tr>
                      </tbody>
                    </table>
                  );
                }
                
                // Обработка списков с тире
                if (paragraph.startsWith('—')) {
                  return (
                    <ul key={`list-${pIndex}`} className={styles.list}>
                      <li className={styles.listItem}>{paragraph.replace('—', '').trim()}</li>
                    </ul>
                  );
                }
                
                // Обычные параграфы
                return (
                  <p key={`para-${pIndex}`} className={styles.paragraph}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <UniversalHeader />
      <div className={styles.container}>
        {renderFormattedPolicy()}
      </div>
      <div id="contacts">
        <Contacts />
      </div>
    </div>
  );
};

export default Privacy;
