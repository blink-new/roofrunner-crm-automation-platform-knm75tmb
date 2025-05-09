import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OpportunitiesList from '../components/Opportunities/OpportunitiesList';
import OpportunityDetail from '../components/Opportunities/OpportunityDetail';
import PipelineSettings from '../components/Opportunities/PipelineSettings/index';

export default function Opportunities() {
  return (
    <Routes>
      <Route index element={<OpportunitiesList />} />
      <Route path=":id" element={<OpportunityDetail />} />
      <Route path="pipelines" element={<PipelineSettings />} />
    </Routes>
  );
}