import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvoiceList from '@/components/Invoicing/InvoiceList';
import InvoiceForm from '@/components/Invoicing/InvoiceForm';
import InvoiceDetail from '@/components/Invoicing/InvoiceDetail';
import TemplateList from '@/components/Invoicing/TemplateList';
import TemplateForm from '@/components/Invoicing/TemplateForm';
import Settings from '@/components/Invoicing/Settings';

export default function Invoicing() {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path=":id/edit" element={<InvoiceForm />} />
      <Route path="templates" element={<TemplateList />} />
      <Route path="templates/new" element={<TemplateForm />} />
      <Route path="templates/:id" element={<TemplateForm />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}