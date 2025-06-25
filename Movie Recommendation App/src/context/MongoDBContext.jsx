import React, { createContext, useContext, useState, useEffect } from 'react';
import connectDB from '../utils/db';

const MongoDBContext = createContext();

export const useDatabase = () => useContext(MongoDBContext);

export const MongoDBProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const connect = async () => {
      try {
        await connectDB();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('MongoDB connection error:', err);
        setIsConnected(false);
        setError(err.message);
      }
    };
    
    connect();
  }, []);
  
  return (
    <MongoDBContext.Provider value={{ 
      isConnected, 
      error,
      reconnect: async () => {
        try {
          await connectDB();
          setIsConnected(true);
          setError(null);
        } catch (err) {
          setIsConnected(false);
          setError(err.message);
        }
      }
    }}>
      {children}
    </MongoDBContext.Provider>
  );
};

export default MongoDBContext;