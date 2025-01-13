import { useState } from 'react';
import { useSocket } from '../../hooks/useSocket.ts';
import markdownit from 'markdown-it';
import parse from 'html-react-parser';
import './Chat.css';
import {useParams, useSearchParams} from 'react-router';

function Chat() {
  const { chatId} = useParams();
  const [searchParams] = useSearchParams();

  const md = markdownit({breaks: true});
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, report } = useSocket(
    chatId,
    searchParams.get('start'),
    searchParams.get('end')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="wrapper" id={chatId}>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-container">
              {!msg.isUser && (
                <img src="/logo-square.svg" alt="Connectd Logo" className="message-logo" />
              )}
              <div
                className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
              >
                {msg.content}
              </div>
              {msg.isUser && (
                <img src="/person-fill.svg" alt="Company Logo" className="message-logo" />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="report-container">
        <div className="report-scroller">
          <div className="report-content">
            {report === '' ? 'Your report will appear here...' : parse(md.render(report))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
