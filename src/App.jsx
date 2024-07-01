import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you have an App.css for styling
import botImg from './assets/bot.gif'
import loader from './assets/loader.gif'
const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dnone, setDnone] = useState(false)
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/generate', { prompt: message });
      const botResponse = res.data.text.replaceAll('*', '');
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (loading === true) {
      setDnone('d-none')
    } else {
      setDnone(null)
    }
  }, [loading])
  return (
    <div className="container">
      <div className="chat-container">
        <div className="d-flex justify-content-center">
          <img src={botImg} className='bot-img' alt="" />
        </div>
        <div className="messages">
          <div className="d-flex justify-content-center">
            {
              (messages.length < 1) ? `Let's Chat` : ''
            }
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="message-form">
          <input type="text" value={message} onChange={handleMessageChange} />
          <button type="submit d-flex">
            <div>
              {loading && <p className="">
                <img src={loader} className='loading-img' alt="" />
              </p>}
            </div>
            <div className={`${dnone}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;