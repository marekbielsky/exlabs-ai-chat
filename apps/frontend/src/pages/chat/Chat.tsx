import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket.ts';
import './Chat.css';
import {Link, useParams, useSearchParams} from 'react-router';
import { useAuth } from '../../hooks/useAuth.tsx';
import Avatar from '../../components/parts/Avatar.tsx';
import SectionsView from "./components/SectionsView.tsx";

function Chat() {
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, report, isGenerating, suggestedAnswers } = useSocket(chatId, startDate, endDate);
  const highlightedRef = useRef(null);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (report.currentlyHighlightedSection && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [report.currentlyHighlightedSection, highlightedRef, isGenerating]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <>
      <div className="wrapper" id={chatId}>
        <div className="chat-container">
          <div className="messages" ref={chatboxRef}>
            {(messages ?? []).map((msg, index) => (
              <div key={index} className="message-container">
                <div className="message-container-img">
                  {msg.isUser ? <Avatar name={user.name} size="small" /> : <img src="/logo-square.svg" alt="Logo" />}
                </div>
                <div className="message-container-body">
                  <div className="message-container-title">{msg.isUser ? user.name : 'Connectd'}</div>
                  <div className="message-container-content">{msg.content}</div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="loading-animation">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            )}
          </div>
          <div className="suggested-answers">
            {suggestedAnswers && suggestedAnswers.length > 0 && (
              <>
                <span>
                  <small>Suggestions: </small>
                </span>
                {suggestedAnswers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(answer)}
                    disabled={isGenerating}
                    className="suggested-answer-btn secondary-color"
                    style={{ margin: '0 8px 8px 0' }}
                  >
                    {answer}
                  </button>
                ))}
              </>
            )}
          </div>
          <form onSubmit={handleSubmit} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isGenerating}
              title={isGenerating ? 'Response is generating, please wait...' : ''}
            />
            <button type="submit" disabled={isGenerating}>
              Send
            </button>
          </form>
        </div>
        <div className="report-container">
          <div className="report-header">
            <div className="report-header-name">
              {user.name} -{' '}
              <span>
                {startDate} - {endDate}
              </span>
            </div>
          </div>
          <div className="report-content">
            <div className="report-scroller" >
              <h1>{report.title}</h1>
              <div>{report.overview}</div>
              {report.sections && <SectionsView sections={report.sections} highlightedRef={highlightedRef} currentlyHighlightedSection={report.currentlyHighlightedSection}/>}
              <p>{report.closing}</p>
              {report.signature && (
                <div className="signature">
                  <p>{report.signature.name}</p>
                  <p>{report.signature.position}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='chat-footer'>
        <Link to={`/chat/${chatId}/final`}>
          <button disabled={isGenerating}>Finalize</button>
        </Link>
      </div>
    </>
  );
}

export default Chat;
