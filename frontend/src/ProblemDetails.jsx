import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wrapUserLogic } from './wrap-utils'; // optional: move to a helper

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState('python');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProblem(data);
      } else {
        setError('Failed to fetch problem details.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    try {
      console.log('Starting handleCodeSubmit...');

      // Extract argument names from the first test case input
      const firstInput = problem?.testCases?.[0]?.input || '{}';
      console.log('First Test Case Input:', firstInput);

      let argNames = [];
      try {
        const parsed = JSON.parse(firstInput);
        console.log('Parsed First Input:', parsed);

        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          argNames = Object.keys(parsed); // Extract argument names
          console.log('Extracted Argument Names:', argNames);
        } else {
          console.warn('First input is not an object; defaulting argNames to empty.');
          argNames = [];
        }
      } catch (error) {
        console.error('Error parsing first test case input:', error);
        argNames = [];
      }

      // Wrap user logic into full method/function structure
      const wrappedCode = wrapUserLogic(language, code, argNames);
      console.log('Wrapped Code:', wrappedCode);

      // Prepare payload for backend
      const payload = {
        code: wrappedCode,
        testCases: problem.testCases.map(tc => ({
          input: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input),
          expectedOutput: tc.expectedOutput,
        })),
        language,
      };
      console.log('Payload for Backend:', payload);

      // Submit to backend
      const response = await fetch(`${API_BASE_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Backend Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Backend Response Data:', data);
        setResults(data.results);
      } else {
        const errorText = await response.text();
        console.error('Backend returned an error:', errorText);
        setError('Code execution failed.');
      }
    } catch (error) {
      console.error('Network or other error occurred:', error);
      setError('Network error.');
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const visibleMessage = { role: 'user', content: chatInput };
    const visibleHistory = [...chatHistory, visibleMessage];
    setChatHistory(visibleHistory);
    setChatInput('');

    // ⛏️ Check if the message sounds like a request for a solution or explanation
    const isCodeOrHelpRequest = /code|solution|solve|write|implement|explain|debug/i.test(chatInput);

    // 🧠 Include full context only when relevant
    const contextPrompt = isCodeOrHelpRequest
      ? `
You are a concise and professional coding assistant inside a developer's code editor.

Guidelines:
- ONLY return code if asked—wrap it in one clean code block.
- Keep explanations short and bullet-style (optional).
- NO headings, blog-style intros, or verbose formatting.

🧠 Problem Title: ${problem?.title}
📄 Statement: ${problem?.problemStatement}
📌 Constraints: ${problem?.constraints}
🔍 Examples:
${problem?.examples?.map((ex, i) => `Example ${i + 1}: Input: ${ex.input}, Output: ${ex.output}`).join('\n')}

💻 User's Code:
${code}

User's question:
${chatInput}
`.trim()
      : chatInput;

    const outgoingMessage = { role: 'user', content: contextPrompt };

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...visibleHistory.slice(0, -1), outgoingMessage]
        }),
      });

      const data = await response.json();
      setChatHistory([
        ...visibleHistory,
        { role: 'assistant', content: data.reply || 'No reply received.' },
      ]);
    } catch (err) {
      setChatHistory([
        ...chatHistory,
        { role: 'assistant', content: '⚠️ Oops! There was a problem talking to your AI buddy.' },
      ]);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>;
  if (error) {
    return (
      <div style={{
        backgroundColor: '#ffebcd',
        color: '#8b0000',
        textAlign: 'center',
        padding: '10px',
        borderRadius: '8px',
        border: '2px solid #8b0000',
      }}>
        {error}
      </div>
    );
  }

  const testInput = problem?.testCases?.[0]?.input || '{}';
  let argNames = [];

  try {
    const parsed = JSON.parse(testInput);
    argNames = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    ? Object.keys(parsed)
    : [];
  } catch {
    argNames = [];
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#fffbea',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)',
      position: 'relative'
    }}>
      {/* Back Button */}
      <button
        style={{
          backgroundColor: '#ffebcd',
          color: '#8b0000',
          fontWeight: 'bold',
          border: '2px solid #8b0000',
          borderRadius: '8px',
          padding: '5px 15px',
          marginBottom: '20px',
        }}
        onClick={() => navigate('/problems')}
      >
        ← Back
      </button>

      {/* Problem Details Section - Top */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          color: '#8b0000',
          fontFamily: `'Dancing Script', cursive`,
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#ffebcd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(139, 0, 0, 0.5)',
          marginBottom: '20px',
        }}>
          {problem.title}
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#8b0000', marginBottom: '10px' }}>Description</h4>
          <p style={{ color: '#333', lineHeight: '1.5', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
            {problem.problemStatement}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#8b0000', marginBottom: '10px' }}>Examples</h4>
          {problem.examples.map((example, index) => (
            <div key={index} style={{
              backgroundColor: '#fff',
              padding: '15px',
              margin: '10px 0',
              border: '2px solid #8b0000',
              borderRadius: '8px',
            }}>
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ color: '#8b0000', marginBottom: '10px' }}>Constraints</h4>
          <p style={{ color: '#333', lineHeight: '1.5', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
            {problem.constraints}
          </p>
        </div>
      </div>

      {/* Compiler and Results Section - Bottom */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Online Compiler - Left */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: '#ffebcd',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)',
            }}
          >
            <h4 style={{ color: '#8b0000', marginBottom: '15px' }}>Online Compiler</h4>

            <select
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '2px solid #8b0000',
                borderRadius: '8px',
              }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>

            {/* Visual Wrapper with Logic Editor */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                backgroundColor: '#fff8dc',
                border: '2px solid #ffd700',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '15px',
              }}
            >
              <pre style={{ margin: 0, color: '#888' }}>
                {language === 'java' && `class Solution {\n    public static Object main(${argNames.join(', ')}) {\n`}
                {language === 'python' && `def main(${argNames.join(', ')}):\n`}
                {language === 'javascript' && `function main(${argNames.join(', ')}) {\n`}
              </pre>

              <textarea
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  minHeight: '150px',
                  resize: 'vertical',
                }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your logic here"
              />

              <pre style={{ margin: 0, color: '#888' }}>
                {language === 'java' && '    }\n}'}
                {language === 'javascript' && '}'}
              </pre>
            </div>

            <button
              style={{
                width: '100%',
                backgroundColor: '#ffa500',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={handleCodeSubmit}
            >
              Run Code
            </button>
          </div>
        </div>

        {/* Test Results - Right */}
        {results.length > 0 && (
          <div style={{ flex: 1 }}>
            <div
              style={{
                backgroundColor: '#ffebcd',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)',
              }}
            >
              <h4 style={{ color: '#8b0000', marginBottom: '15px' }}>Test Results</h4>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {results.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: result.passed ? '#28a745' : '#dc3545',
                      color: '#fff',
                      padding: '15px',
                      borderRadius: '8px',
                      margin: '10px 0',
                    }}
                  >
                    <p style={{ margin: '5px 0' }}><strong>Test Case {index + 1}</strong></p>
                    <p style={{ margin: '5px 0' }}><strong>Input:</strong> {result.input}</p>
                    <p style={{ margin: '5px 0' }}><strong>Expected Output:</strong> {result.expectedOutput}</p>
                    <p style={{ margin: '5px 0' }}><strong>Your Output:</strong> {result.yourOutput}</p>
                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> {result.passed ? 'Passed ✔️' : 'Failed ❌'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chatbot Toggle Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#8b0000',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => setShowChatbot(!showChatbot)}
      >
        ☁️ Your Code Buddy
      </div>

      {/* Collapsible Chatbot Popup */}
      {showChatbot && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '350px',
            backgroundColor: '#fff',
            border: '2px solid #8b0000',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            zIndex: 999,
          }}
        >
          <h4 style={{ color: '#8b0000', marginBottom: '10px' }}>💬 Code Buddy</h4>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: '#fffcf5',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              border: '1px solid #ccc',
            }}
          >
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  color: msg.role === 'user' ? '#8b0000' : '#444',
                  marginBottom: '6px',
                }}
              >
                <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Ask your code buddy anything..."
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #8b0000',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </div>
  );
}