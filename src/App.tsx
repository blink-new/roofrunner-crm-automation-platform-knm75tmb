import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Conversations from './pages/Conversations';
import Calendars from './pages/Calendars';
import Deals from './pages/Deals';
import Jobs from './pages/Jobs';
import Opportunities from './pages/Opportunities';
import Automation from './pages/Automation';
import Marketing from './pages/Marketing';
import Sites from './pages/Sites';
import Reputation from './pages/Reputation';
import Reporting from './pages/Reporting';
import FileManager from './pages/FileManager';
import Invoicing from './pages/Invoicing';
import Payments from './pages/Payments';
import BlankPage from './pages/BlankPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="calendars" element={<Calendars />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="deals/*" element={<Deals />} />
          <Route path="jobs/*" element={<Jobs />} />
          <Route path="opportunities/*" element={<Opportunities />} />
          <Route path="automation" element={<Automation />} />
          <Route path="marketing/*" element={<Marketing />} />
          <Route path="sites/*" element={<Sites />} />
          <Route path="reputation/*" element={<Reputation />} />
          <Route path="reporting/*" element={<Reporting />} />
          <Route path="file-manager/*" element={<FileManager />} />
          <Route path="invoicing/*" element={<Invoicing />} />
          <Route path="payments/*" element={<Payments />} />
          <Route path="ai-agents" element={<BlankPage title="AI Agents" />} />
          <Route path="job-cam" element={<BlankPage title="Job Cam" />} />
          <Route path="instant-estimator" element={<BlankPage title="Instant Estimator" />} />
          <Route path="measurements" element={<BlankPage title="Measurements" />} />
          <Route path="proposals" element={<BlankPage title="Proposals" />} />
          <Route path="material-orders" element={<BlankPage title="Material Orders" />} />
          <Route path="work-orders" element={<BlankPage title="Work Orders" />} />
          <Route path="support" element={<BlankPage title="Support" />} />
          <Route path="settings" element={<BlankPage title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;