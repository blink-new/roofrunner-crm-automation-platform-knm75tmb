import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteList from '../components/Sites/SiteList';
import FunnelList from '../components/Sites/FunnelList';
import PageEditor from '../components/Sites/PageEditor';
import FunnelEditor from '../components/Sites/FunnelEditor';
import AnalyticsDashboard from '../components/Sites/AnalyticsDashboard';
import BlogPostEditor from '../components/Sites/BlogPostEditor';
import MembershipBuilder from '../components/Sites/MembershipBuilder';
import OrderFormBuilder from '../components/Sites/OrderFormBuilder';
import DomainManager from '../components/Sites/DomainManager';
import AssetManager from '../components/Sites/AssetManager';
import ThemeSettings from '../components/Sites/ThemeSettings';

export default function Sites() {
  return (
    <Routes>
      {/* Sites */}
      <Route index element={<SiteList />} />
      <Route path="new" element={<PageEditor />} />
      <Route path=":siteId" element={<PageEditor />} />
      <Route path=":siteId/analytics" element={<AnalyticsDashboard />} />
      <Route path=":siteId/domains" element={<DomainManager siteId="123" />} />
      <Route path=":siteId/assets" element={<AssetManager siteId="123" standalone={true} />} />
      <Route path=":siteId/themes" element={<ThemeSettings />} />
      
      {/* Funnels */}
      <Route path=":siteId/funnels" element={<FunnelList />} />
      <Route path=":siteId/funnels/new" element={<FunnelEditor />} />
      <Route path=":siteId/funnels/:funnelId" element={<FunnelEditor />} />
      <Route path=":siteId/funnels/:funnelId/analytics" element={<AnalyticsDashboard />} />
      <Route path=":siteId/funnels/:funnelId/pages/:pageId" element={<PageEditor />} />
      <Route path=":siteId/funnels/:funnelId/pages/:pageId/order-forms/new" element={<OrderFormBuilder />} />
      <Route path=":siteId/funnels/:funnelId/pages/:pageId/order-forms/:formId" element={<OrderFormBuilder />} />
      
      {/* Blog */}
      <Route path=":siteId/blog" element={<BlogPostEditor />} />
      <Route path=":siteId/blog/new" element={<BlogPostEditor />} />
      <Route path=":siteId/blog/:postId" element={<BlogPostEditor />} />
      
      {/* Memberships */}
      <Route path=":siteId/memberships" element={<MembershipBuilder />} />
      <Route path=":siteId/memberships/new" element={<MembershipBuilder />} />
      <Route path=":siteId/memberships/:planId" element={<MembershipBuilder />} />
    </Routes>
  );
}