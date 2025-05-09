import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampaignList from '../components/Marketing/CampaignList';
import CampaignBuilder from '../components/Marketing/CampaignBuilder/index';
import DripBuilder from '../components/Marketing/DripBuilder';
import RSSCampaignBuilder from '../components/Marketing/RSSCampaignBuilder';
import TemplateLibrary from '../components/Marketing/TemplateLibrary';
import BrandBoardManager from '../components/Marketing/BrandBoardManager';
import LaunchpadInterface from '../components/Marketing/LaunchpadInterface';
import SocialPlanner from '../components/Marketing/SocialPlanner';
import AdManager from '../components/Marketing/AdManager';
import CampaignReport from '../components/Marketing/CampaignReport';
import Analytics from '../components/Marketing/Analytics/index';

export default function Marketing() {
  return (
    <Routes>
      <Route index element={<CampaignList />} />
      <Route path="new" element={<CampaignBuilder />} />
      <Route path=":id" element={<CampaignBuilder />} />
      <Route path="drip/new" element={<DripBuilder />} />
      <Route path="drip/:id" element={<DripBuilder />} />
      <Route path="rss/new" element={<RSSCampaignBuilder />} />
      <Route path="rss/:id" element={<RSSCampaignBuilder />} />
      <Route path="templates" element={<TemplateLibrary standalone={true} />} />
      <Route path="brand-boards" element={<BrandBoardManager standalone={true} />} />
      <Route path="launchpad" element={<LaunchpadInterface standalone={true} />} />
      <Route path="social" element={<SocialPlanner />} />
      <Route path="ads" element={<AdManager />} />
      <Route path="reports/:id" element={<CampaignReport />} />
      <Route path="analytics" element={<Analytics />} />
    </Routes>
  );
}