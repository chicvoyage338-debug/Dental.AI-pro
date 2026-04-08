import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Plus, X, ChevronRight, Check } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed';
}

export default function AppointmentScheduler() {
  const todayDate = new Date().toISOString().split('T')[0];
  const todayDisplay = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'Sarah Johnson', date: todayDate, time: '09:00 AM', type: 'Cleaning', status: 'Confirmed' },
    { id: '2', patientName: 'Michael Chen', date: todayDate, time: '10:30 AM', type: 'Checkup', status: 'Scheduled' },
    { id: '3', patientName: 'Emma Wilson', date: '2024-04-11', time: '02:00 PM', type: 'Root Canal', status: 'Scheduled' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ patientName: '', date: '', time: '', type: 'Checkup' });

  const addAppointment = () => {
    // Format time to AM/PM for display if it's from a time input (HH:mm)
    let formattedTime = newAppt.time;
    if (newAppt.time.includes(':')) {
      const [hours, minutes] = newAppt.time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 || 12;
      formattedTime = `${displayHours}:${minutes} ${ampm}`;
    }

    const appt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAppt,
      time: formattedTime,
      status: 'Scheduled'
    };
    setAppointments([...appointments, appt]);
    setShowAddModal(false);
    setNewAppt({ patientName: '', date: '', time: '', type: 'Checkup' });
  };

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-1">Appointments</h1>
          <p className="text-gray-500">Manage your daily schedule.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Today, {todayDisplay}</h2>
          <div className="space-y-4">
            {appointments.filter(a => a.date === todayDate).map((appt) => (
              <motion.div 
                key={appt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="medical-card p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-accent rounded-2xl flex flex-col items-center justify-center text-primary shrink-0">
                  <span className="text-xs font-bold uppercase">{appt.time.split(' ')[1]}</span>
                  <span className="text-lg font-bold leading-none">{appt.time.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{appt.patientName}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {appt.type}</span>
                    <span className={`flex items-center gap-1 ${appt.status === 'Confirmed' ? 'text-green-500' : 'text-blue-500'}`}>
                      <Check size={14} /> {appt.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300" />
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Upcoming</h2>
          <div className="space-y-4">
            {appointments.filter(a => a.date !== todayDate).map((appt) => (
              <div key={appt.id} className="medical-card p-4 flex items-center gap-4 opacity-70">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <CalendarIcon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{appt.patientName}</h3>
                  <p className="text-xs text-gray-400">{appt.date} • {appt.time}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{appt.type}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">New Appointment</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-accent rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Patient Name</label>
                  <input 
                    type="text" 
                    value={newAppt.patientName}
                    onChange={e => setNewAppt({...newAppt, patientName: e.target.value})}
                    className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Date</label>
                    <input 
                      type="date" 
                      value={newAppt.date}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                      className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Time</label>
                    <input 
                      type="time" 
                      value={newAppt.time}
                      onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                      className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Type</label>
                  <select 
                    value={newAppt.type}
                    onChange={e => setNewAppt({...newAppt, type: e.target.value})}
                    className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Checkup</option>
                    <option>Cleaning</option>
                    <option>Extraction</option>
                    <option>Filling</option>
                    <option>Root Canal</option>
                  </select>
                </div>
                <button 
                  onClick={addAppointment}
                  className="w-full pill-button gradient-bg py-4 mt-4 shadow-lg shadow-primary/20"
                >
                  Schedule Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
