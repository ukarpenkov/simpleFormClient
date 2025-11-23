import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WorkplaceForm } from "./WorkplaceForm";
import { WorkplaceProvider } from "./WorkplaceContext";
import { WorkplaceList } from "./WorkplaceList";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <WorkplaceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorkplaceList />} />
          <Route path="/create" element={<WorkplaceForm />} />
          <Route path="/workplace/:id" element={<WorkplaceForm />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </WorkplaceProvider>
  );
}
