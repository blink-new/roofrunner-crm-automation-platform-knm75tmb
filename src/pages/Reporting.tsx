import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportList from '../components/Reporting/ReportList';
import ReportBuilder from '../components/Reporting/ReportBuilder';
import ReportDetail from '../components/Reporting/ReportDetail';
import DashboardBuilder from '../components/Reporting/DashboardBuilder';
import DashboardList from '../components/Reporting/DashboardList';
import AppointmentReport from '../components/Reporting/StandardReports/AppointmentReport';
import CallReport from '../components/Reporting/StandardReports/CallReport';
import AttributionReport from '../components/Reporting/StandardReports/AttributionReport';
import AgentReport from '../components/Reporting/StandardReports/AgentReport';

export default function Reporting() {
  return (
    <Routes>
      <Route index element={<ReportList />} />
      <Route path="new" element={<ReportBuilder />} />
      <Route path=":id" element={<ReportDetail />} />
      <Route path="dashboards" element={<DashboardList />} />
      <Route path="dashboards/new" element={<DashboardBuilder />} />
      <Route path="dashboards/:id" element={<DashboardBuilder />} />
      <Route path="appointments" element={<AppointmentReport />} />
      <Route path="calls" element={<CallReport />} />
      <Route path="attribution" element={<AttributionReport />} />
      <Route path="agent" element={<AgentReport />} />
    </Routes>
  );
}