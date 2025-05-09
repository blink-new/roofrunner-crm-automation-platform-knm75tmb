import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentList from '../components/Payments/PaymentList';
import PaymentDetail from '../components/Payments/PaymentDetail';
import Settings from '../components/Payments/Settings';

export default function Payments() {
  return (
    <Routes>
      <Route index element={<PaymentList />} />
      <Route path=":id" element={<PaymentDetail />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}