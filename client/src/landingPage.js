// src/LandingPage.js

import React from 'react';

const LandingPage = () => {
  return (
    <div className="landing">
      <h1>Welcome to the Landing Page</h1>
      <button onClick={() => window.location.href = '/todos'}>Go to Todos</button>
    </div>
  );
};

export default LandingPage;
