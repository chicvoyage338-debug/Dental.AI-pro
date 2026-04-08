import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, User, Calendar, FileText, ChevronRight, X } from 'lucide-react';

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', contact: '' });
  const [patients, setPatients] = useState([
    { id: '1', name: 'Sarah Johnson', age: 28, lastVisit: '2024-03-15', status: 'Follow-up' },
    { id: '2', name: 'Michael Chen', age: 42, lastVisit: '2024-03-10', status: 'Completed' },
    { id: '3', name: 'Emma Wilson', age: 35, lastVisit: '2024-03-05', status: 'Pending' },
    { id: '4', name: 'David Miller', age: 55, lastVisit: '2024-02-28', status: 'Completed' },
  ]);

  const addPatient = () => {
    const p = {
      id: (patients.length + 1).toString(),
      ...newPatient,
      age: parseInt(newPatient.age),
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setPatients([p, ...patients]);
    setShowAddModal(false);
    setNewPatient({ name: '', age: '', gender: 'Male', contact: '' });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-1">Patient Records</h1>
          <p className="text-gray-500">Manage all patient histories.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-accent border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <motion.div 
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="medical-card p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-lg">
                  {patient.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{patient.name}</h3>
                  <p className="text-sm text-gray-400">{patient.age} years • ID: #{patient.id}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                patient.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                patient.status === 'Follow-up' ? 'bg-blue-100 text-blue-600' :
                'bg-green-100 text-green-600'
              }`}>
                {patient.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} className="text-primary" />
                <span>Last: {patient.lastVisit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText size={16} className="text-primary" />
                <span>4 Records</span>
              </div>
            </div>

            <button className="w-full py-2 text-primary font-medium border-t border-gray-50 flex items-center justify-center gap-1 hover:bg-primary/5 rounded-b-xl transition-colors">
              View Full Profile
              <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
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
                <h2 className="text-2xl font-bold">Add New Patient</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-accent rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                    className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Age</label>
                    <input 
                      type="number" 
                      value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                      className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Gender</label>
                    <select 
                      value={newPatient.gender}
                      onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                      className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Contact Info</label>
                  <input 
                    type="text" 
                    value={newPatient.contact}
                    onChange={e => setNewPatient({...newPatient, contact: e.target.value})}
                    className="w-full bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Phone or Email"
                  />
                </div>
                <button 
                  onClick={addPatient}
                  className="w-full pill-button gradient-bg py-4 mt-4 shadow-lg shadow-primary/20"
                >
                  Create Patient Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
