import React, { useState } from 'react';
import axios from 'axios';

const TestForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    setErrorMessage('');

    try {
      const response = await axios.post('https://alldesignkhv.store/api/test/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (error) {
      setSubmitStatus('error');
      if (error.response) {
        setErrorMessage(`Server error: ${error.response.status} ${error.response.data.error || ''}`);
      } else if (error.request) {
        setErrorMessage('No response received from server. The request may have timed out.');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Submit</button>
      {submitStatus === 'sending' && <p>Sending...</p>}
      {submitStatus === 'success' && <p>Form submitted successfully!</p>}
      {submitStatus === 'error' && <p>Error: {errorMessage}</p>}
    </form>
  );
};

export default TestForm;
