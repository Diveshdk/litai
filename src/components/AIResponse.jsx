'use client';

import { useState, useEffect } from 'react';

const AIChatbot = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]); // Set the connected wallet address
    } catch (error) {
      console.error('Wallet connection failed:', error.message);
      setWalletAddress('Connection failed. Please check MetaMask.');
    }
  };

  // Handle user queries
  const handleQuery = async () => {
    try {
      if (!query.trim()) return; // Ignore empty queries

      setLoading(true); // Show loading state
      const userMessage = { sender: 'user', message: query };
      setChat((prev) => [...prev, userMessage]); // Add user message to chat

      if (query.toLowerCase().includes('connect wallet')) {
        try {
          const walletAddress = await connectWallet();
          const responseMessage = { sender: 'ai', message: `Connected to wallet: ${walletAddress}` };
          setChat((prev) => [...prev, responseMessage]);
        } catch (error) {
          const responseMessage = { sender: 'ai', message: 'Failed to connect wallet.' };
          setChat((prev) => [...prev, responseMessage]);
        } finally {
          setLoading(false);
        }
        setQuery(''); // Clear input
        return;
      }

      // Fetch AI response
      const apiResponse = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: query,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }

      const reader = apiResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        try {
          const parsedChunk = JSON.parse(chunk);
          fullResponse += parsedChunk.response || ''; // Append to the complete response
        } catch (error) {
          console.error('Error parsing chunk:', error.message);
        }
      }

      const responseMessage = { sender: 'ai', message: fullResponse };
      setChat((prev) => [...prev, responseMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', message: 'Failed to get a response from AI.' };
      setChat((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false); // Hide loading state
      setQuery(''); // Clear input
    }
  };

  // Connect wallet on component mount
  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      {/* Wallet Address */}
      <div style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '10px' }}>
        {walletAddress || 'Connecting wallet...'}
      </div>

      {/* Chat Interface */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: 'white', padding: '10px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {chat.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.sender === 'user' ? '#007BFF' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : 'black',
              }}
            >
              {message.message}
            </span>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'center', fontStyle: 'italic' }}>Loading...</div>}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleQuery}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
