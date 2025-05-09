import React from 'react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Payments', path: '/payments' },
            { label: 'Settings', path: '/payments/settings', active: true }
          ]}
        />
        <h1 className="mt-2">Payment Settings</h1>
      </div>

      <Card className="divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Payment Gateways</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Stripe</h3>
                <p className="text-sm text-gray-500">Accept credit cards and ACH payments</p>
              </div>
              <button className="btn btn-primary">Connect</button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">PayPal</h3>
                <p className="text-sm text-gray-500">Accept PayPal payments</p>
              </div>
              <button className="btn btn-primary">Connect</button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Authorize.net</h3>
                <p className="text-sm text-gray-500">Accept credit cards and eChecks</p>
              </div>
              <button className="btn btn-primary">Connect</button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Credit Cards</h3>
                <p className="text-sm text-gray-500">Accept Visa, Mastercard, Amex</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">ACH/Bank Transfer</h3>
                <p className="text-sm text-gray-500">Accept direct bank transfers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Currency Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Currency</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}