import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Plus, X, Loader2, Info, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ diagnosis: string; explanation: string; urgency: string; plan: string } | null>(null);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (s: string) => {
    setSymptoms(symptoms.filter(item => item !== s));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;
    setIsAnalyzing(true);
    try {
      const prompt = `
        A dental patient is experiencing the following symptoms: ${symptoms.join(', ')}.
        Based on these dental symptoms, provide a probable diagnosis, an explanation of the condition, the level of urgency (Low, Medium, High), and a preliminary treatment plan.
        Return the response in JSON format with fields: diagnosis, explanation, urgency, plan.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      setAnalysis(JSON.parse(response.text || '{}'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl mb-2">Symptom Checker</h1>
        <p className="text-gray-500">Enter patient symptoms for AI-assisted differential diagnosis.</p>
      </header>

      <div className="medical-card mb-6">
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
            placeholder="e.g. Bleeding gums, tooth sensitivity..." 
            className="flex-1 bg-accent border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button onClick={addSymptom} className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {symptoms.map((s, i) => (
            <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {s}
              <button onClick={() => removeSymptom(s)}><X size={14} /></button>
            </span>
          ))}
          {symptoms.length === 0 && <p className="text-sm text-gray-400 italic">No symptoms added yet.</p>}
        </div>
      </div>

      <button 
        disabled={symptoms.length === 0 || isAnalyzing}
        onClick={analyzeSymptoms}
        className="w-full pill-button gradient-bg mb-8 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isAnalyzing ? <Loader2 className="animate-spin" /> : <Stethoscope size={20} />}
        Analyze Symptoms
      </button>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="medical-card border-l-4 border-l-secondary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">AI Assessment</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analysis.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {analysis.urgency} Urgency
                </span>
              </div>

              <div className="space-y-4">
                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">Probable Diagnosis</h3>
                  <p className="text-secondary font-semibold text-lg">{analysis.diagnosis}</p>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">Explanation</h3>
                  <p className="text-gray-600 leading-relaxed">{analysis.explanation}</p>
                </section>

                <section className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
                  <h3 className="text-sm font-bold text-secondary uppercase mb-2">Recommended Plan</h3>
                  <p className="text-gray-700">{analysis.plan}</p>
                </section>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 text-orange-700 text-sm">
              <Info className="shrink-0" size={20} />
              <p>This is an AI-assisted assessment. Clinical examination by a licensed dentist is required for definitive diagnosis.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
