import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import { ToolGenerator } from '../pages/ToolGenerator';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tool-generator" element={<ToolGenerator />} />
      </Routes>
    </BrowserRouter>
  );
};
