import React from 'react';
import { Routes, Route } from 'react-router-dom';
import JobsList from '../components/Jobs/JobsList';
import JobDetail from '../components/Jobs/JobDetail';
import JobForm from '../components/Jobs/JobForm';

export default function Jobs() {
  return (
    <Routes>
      <Route index element={<JobsList />} />
      <Route path="new" element={<JobForm />} />
      <Route path=":id" element={<JobDetail />} />
      <Route path=":id/edit" element={<JobForm />} />
    </Routes>
  );
}