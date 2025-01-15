import { useState } from 'react';
import { useSocket } from '../../hooks/useSocket.ts';
import markdownit from 'markdown-it';
import parse from 'html-react-parser';
import './Chat.css';
import {useParams, useSearchParams} from 'react-router';
import {useAuth} from "../../hooks/useAuth.tsx";
import Avatar from "../../components/parts/Avatar.tsx";

function Chat() {
  const { chatId} = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const md = markdownit({breaks: true});
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, report } = useSocket(
    chatId,
    startDate,
    endDate,
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
      <div className="progress-container">
        <div className="progress-container-title">
          Founder Update
        </div>
        <div className="progress-container-chart">
          <img src="/report-progress.svg" alt="Progress Chart" />
          <div className="progress-container-chart-number">12%</div>
        </div>
        <div className="progress-container-chart-points">
         <div className="progress-container-chart-points-step done">
           <img src="/done.svg" alt="done-data" />
           Data
           <span>100%</span>
         </div>
          <div className="progress-container-chart-points-step">
            <img src="/todo.svg" alt="todo-core" />
            Core Metrics
            <span>0%</span>
          </div>
          <div className="progress-container-chart-points-step">
            <img src="/todo.svg" alt="todo-custom" />
            Custom Metrics
            <span>0%</span>
          </div>
          <div className="progress-container-chart-points-step">
            <img src="/todo.svg" alt="todo-share" />
            Share
            <span>0%</span>
          </div>
        </div>
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-container">
              <div className="message-container-img">
                {msg.isUser ? <Avatar name={user.name} size='small' /> : (
                  <img src="/logo-square.svg" alt="Connectd Logo" className="message-logo" />
                )}
              </div>
              <div className="message-container-body">
                <div className="message-container-title">
                  {msg.isUser ? user.name : 'Connectd' }
                </div>
                <div className="message-container-content">
                  {msg.content}
                </div>
              </div>
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
        <div className="report-header">
          <div className="report-header-name">
            {user.name} -
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="report-header-dates">

          </div>

          <div className="report-header-logo">
            <Avatar name={user.name} size='big' />
          </div>
        </div>
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
