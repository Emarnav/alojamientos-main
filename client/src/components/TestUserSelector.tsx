"use client";

import React, { useState, useEffect } from 'react';
import { testUsers, switchTestUser, getCurrentTestUser, testLogout, type TestUser } from '@/lib/testAuth';

export const TestUserSelector: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentTestUser());
  }, []);

  const handleUserChange = (email: string) => {
    if (email === 'logout') {
      testLogout();
      setCurrentUser(null);
    } else {
      const user = switchTestUser(email);
      setCurrentUser(user);
    }
    setIsOpen(false);
    // Recargar la página para que tome efecto el cambio
    window.location.reload();
  };

  // Solo mostrar en desarrollo o cuando USE_TEST_AUTH está activo
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_USE_TEST_AUTH !== 'true') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 shadow-lg">
      <div className="text-xs font-bold text-yellow-800 mb-2">
        🧪 MODO PRUEBA
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 min-w-[150px] text-left"
        >
          {currentUser ? (
            <span>
              <span className="font-semibold">{currentUser.name}</span>
              <br />
              <span className="text-xs text-gray-500">{currentUser.role}</span>
            </span>
          ) : (
            'Seleccionar usuario'
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg min-w-[200px]">
            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleUserChange(user.email)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  currentUser?.email === user.email ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <div className="text-xs text-blue-600">{user.role}</div>
              </button>
            ))}
            <button
              onClick={() => handleUserChange('logout')}
              className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 mt-2">
        <div>Para requests HTTP:</div>
        <div className="font-mono text-xs bg-gray-100 p-1 rounded mt-1">
          {currentUser ? `Bearer ${currentUser.token.substring(0, 20)}...` : 'No token'}
        </div>
      </div>
    </div>
  );
};

export default TestUserSelector;