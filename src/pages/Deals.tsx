import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DealsList from '../components/Deals/DealsList';
import DealDetail from '../components/Deals/DealDetail';
import PipelineSettings from '../components/Deals/PipelineSettings';

export default function Deals() {
  return (
    <Routes>
      <Route index element={<DealsList />} />
      <Route path=":id" element={<DealDetail />} />
      <Route path="pipelines" element={<PipelineSettings />} />
    </Routes>
  );
}