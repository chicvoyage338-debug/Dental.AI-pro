/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Scan, 
  BookOpen, 
  ClipboardList, 
  Search, 
  Bell, 
  User,
  Plus,
  ArrowRight,
  Calendar
} from 'lucide-react';
import ScanScreen from './components/ScanScreen';
import PatientRecords from './components/PatientRecords';
import DentalLibrary from './components/DentalLibrary';
import SymptomChecker from './components/SymptomChecker';
import AppointmentScheduler from './components/AppointmentScheduler';

function HomeScreen() {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  return (
    <div className="p-6 pb-24">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl">Hello Doctor 👩‍⚕️</h1>
          <p className="text-gray-500">Welcome back to DentAI Pro</p>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-gray-600">
            <Bell size={20} />
          </button>
          <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/scan">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="medical-card flex flex-col items-start gap-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Scan size={24} />
            </div>
            <div>
              <h3 className="text-lg">Scan Tooth (AI)</h3>
              <p className="text-sm text-gray-500">Instant lesion & X-ray analysis</p>
            </div>
          </motion.div>
        </Link>

        <Link to="/appointments">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="medical-card flex flex-col items-start gap-4"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-lg">Appointments</h3>
              <p className="text-sm text-gray-500">Manage your daily schedule</p>
            </div>
          </motion.div>
        </Link>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Today's Schedule ({today})</h2>
          <Link to="/appointments" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="space-y-3">
          {[
            { name: "Sarah Johnson", time: "09:00 AM", type: "Cleaning" },
            { name: "Michael Chen", time: "10:30 AM", type: "Checkup" }
          ].map((appt, i) => (
            <div key={i} className="medical-card p-4 flex items-center justify-between border-l-4 border-l-secondary">
              <div className="flex items-center gap-3">
                <div className="text-secondary font-bold text-sm bg-secondary/5 px-2 py-1 rounded-lg">
                  {appt.time}
                </div>
                <div>
                  <h4 className="font-medium">{appt.name}</h4>
                  <p className="text-xs text-gray-400">{appt.type}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/symptoms" className="medical-card p-4 flex items-center gap-3">
            <Stethoscope size={20} className="text-primary" />
            <span className="text-sm font-medium">Symptom Check</span>
          </Link>
          <Link to="/learn" className="medical-card p-4 flex items-center gap-3">
            <BookOpen size={20} className="text-orange-500" />
            <span className="text-sm font-medium">Dental Library</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-medical-bg">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/records" element={<PatientRecords />} />
          <Route path="/learn" element={<DentalLibrary />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/appointments" element={<AppointmentScheduler />} />
        </Routes>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
          <Link to="/" className="flex flex-col items-center gap-1 text-primary">
            <div className="p-1">
              <ClipboardList size={24} />
            </div>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/appointments" className="flex flex-col items-center gap-1 text-gray-400">
            <div className="p-1">
              <Calendar size={24} />
            </div>
            <span className="text-[10px] font-medium">Schedule</span>
          </Link>
          <Link to="/scan" className="flex flex-col items-center gap-1 text-gray-400">
            <div className="p-1">
              <Scan size={24} />
            </div>
            <span className="text-[10px] font-medium">Scan</span>
          </Link>
          <Link to="/records" className="flex flex-col items-center gap-1 text-gray-400">
            <div className="p-1">
              <User size={24} />
            </div>
            <span className="text-[10px] font-medium">Patients</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}
