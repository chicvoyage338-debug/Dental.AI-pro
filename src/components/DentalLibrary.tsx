import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

export default function DentalLibrary() {
  const topics = [
    { title: 'Oral Lesions', category: 'Pathology', description: 'Identification and management of common mouth sores.' },
    { title: 'Periodontitis', category: 'Gum Disease', description: 'Advanced stages of gum infection and bone loss.' },
    { title: 'Endodontics', category: 'Root Canal', description: 'Procedures involving the dental pulp and tissues.' },
    { title: 'Dental Radiography', category: 'Diagnostics', description: 'Best practices for X-ray interpretation.' },
  ];

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-primary" size={24} />
          <h1 className="text-3xl">Dental Library</h1>
        </div>
        <p className="text-gray-500">AI-curated knowledge base for dental professionals.</p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search topics, symptoms, or treatments..." 
          className="w-full bg-accent border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-4">
        {topics.map((topic, i) => (
          <motion.div 
            key={i}
            whileHover={{ x: 5 }}
            className="medical-card p-5 flex items-center justify-between cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{topic.category}</span>
                <h3 className="text-lg font-semibold">{topic.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{topic.description}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300" />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 medical-card bg-primary/5 border-primary/10">
        <h3 className="text-lg mb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          Ask DentAI
        </h3>
        <p className="text-sm text-gray-600 mb-4">Have a specific question about a lesion or treatment? Ask our AI assistant.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. How to treat leukoplakia?" 
            className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="pill-button gradient-bg py-2 text-sm">Ask</button>
        </div>
      </div>
    </div>
  );
}
