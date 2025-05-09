import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FileList from '../components/FileManager/FileList';
import FileDetail from '../components/FileManager/FileDetail';

export default function FileManager() {
  return (
    <Routes>
      <Route index element={<FileList />} />
      <Route path=":id" element={<FileDetail />} />
    </Routes>
  );
}