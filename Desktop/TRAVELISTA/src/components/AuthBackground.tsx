import React from 'react';

const AuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundColor: '#f0f9ff', // Fallback color
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white/95 to-blue-100/15" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 