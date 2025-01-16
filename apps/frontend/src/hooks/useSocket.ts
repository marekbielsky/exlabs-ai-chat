import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth.tsx';
import { Lexer } from 'streaming-json';

type Table = {
  headers: string[];
  rows: string[][];
};

type MetricSection = {
  description: string | null;
  table: Table;
};

type Report = {
  title?: string | null;
  greeting?: string | null;
  overview?: string | null;
  currentlyHighlightedSection?: string | null;
  sections?: {
    overview?: string | null;
    financialHealth?: MetricSection;
    liquidityMetrics?: MetricSection;
    customerMetrics?: MetricSection;
    revenueMetrics?: MetricSection;
    burnMetrics?: MetricSection;
    transactionMetrics?: MetricSection;
  } | null;
  closing?: string | null;
  signature?: {
    name?: string | null;
    position?: string | null;
  } | null;
  suggestedAnswers?: string[] | null;
};

type ResponseSchema = {
  userMessage: string;
  suggestedAnswers: string[];
  report: Report;
};

export function useSocket(reportId, startDate, endDate) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState<Report>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAnswers, setSuggestedAnswers] = useState<string[]>([]);
  const { user } = useAuth();

  let lexer = null;

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      query: { reportId, startDate, endDate },
      extraHeaders: { Authorization: `Bearer ${user.token}` },
    });
    setSocket(socketInstance);

    socketInstance.emit('start', { reportId });

    socketInstance.on('message', (message) => {
      if (message === '<|startoftext|>') {
        lexer = new Lexer();
        setIsGenerating(true);
        return;
      } else if (message === '<|endoftext|>') {
        setIsGenerating(false);
        return;
      }

      lexer.AppendString(message);
      const completedJSON = lexer.CompleteJSON();
      const parsedJSON: ResponseSchema = JSON.parse(completedJSON);

      if (parsedJSON) {
        const { userMessage, report: newReport, suggestedAnswers } = parsedJSON;

        if (userMessage) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && userMessage.startsWith(lastMessage.content)) {
              const updatedMessage = { ...lastMessage, content: userMessage };
              return [...prev.slice(0, -1), updatedMessage];
            } else if (userMessage.trim() !== '' && (!lastMessage || userMessage !== lastMessage.content)) {
              return [...prev, { content: userMessage, isUser: false }];
            }
            return prev;
          });
        }

        if (newReport) {
          setReport((prev) => {
            const mergeReports = (prevReport, newReport) => {
              for (const key in newReport) {
                // Update only those sections of the report that are not empty in the response
                if (typeof newReport[key] === 'object' && newReport[key] !== null && !Array.isArray(newReport[key])) {
                  prevReport[key] = mergeReports(prevReport[key] || {}, newReport[key]);
                } else if (
                  newReport[key] !== null &&
                  newReport[key] !== undefined &&
                  newReport[key] !== '' &&
                  (!Array.isArray(newReport[key]) || newReport[key].length > 0)
                ) {
                  prevReport[key] = newReport[key];
                }
              }
              return prevReport;
            };
            return mergeReports({ ...prev }, newReport);
          });
        }

        if (suggestedAnswers) {
          setSuggestedAnswers(suggestedAnswers);
        }
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [reportId, user.token]);

  const sendMessage = useCallback(
    (message) => {
      if (!socket) return;

      setMessages((prev) => [...prev, { content: message, isUser: true }]);
      socket.emit('message', message);
    },
    [socket]
  );

  return { messages, sendMessage, report, isGenerating, suggestedAnswers };
}
