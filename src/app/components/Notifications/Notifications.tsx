"use client";

import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi2';
import Link from 'next/link';
export default function Notifications() {
  const [activeTab, setActiveTab] = useState('Read');

  const notifications = {
    today: [
      {
        title: "New Recipe Alert!",
        desc: "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum",
        time: "10 mins ago",
      },
      {
        title: "New Recipe Alert!",
        desc: "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum",
        time: "30 mins ago",
      },
      {
        title: "Save Recipe Alert!",
        desc: "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum",
        time: "30 mins ago",
      },
    ],
    yesterday: [
      {
        title: "New Recipe Alert!",
        desc: "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum",
        time: "1 day ago",
      },
      {
        title: "New Recipe Alert!",
        desc: "Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum",
        time: "1 day ago",
      },
    ]
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col p-4 relative pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
       <Link href={"/home"}>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </button></Link>
        <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Tabs (All / Read / Unread) */}
      <div className="flex bg-gray-50 p-1 rounded-2xl mb-6">
        {['All', 'Read', 'Unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-[#129575] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
        {/* Today Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">Today</h2>
          <div className="space-y-3">
            {notifications.today.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#F9F9F9] border border-gray-100/80 rounded-2xl p-4 flex gap-3 relative shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <HiDocumentText className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">
                    {item.desc}
                  </p>
                  <span className="text-[10px] text-gray-300 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yesterday Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">Yesterday</h2>
          <div className="space-y-3">
            {notifications.yesterday.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#F9F9F9] border border-gray-100/80 rounded-2xl p-4 flex gap-3 relative shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <HiDocumentText className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">
                    {item.desc}
                  </p>
                  <span className="text-[10px] text-gray-300 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}