import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, X, Loader2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { analyzeDentalImage, DentalAnalysis } from '../services/geminiService';

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DentalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await analyzeDentalImage(base64Data, mimeType);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl mb-2">AI Dental Scan</h1>
        <p className="text-gray-500">Upload an X-ray or photo for instant diagnosis and treatment planning.</p>
      </header>

      <div className="medical-card mb-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-primary/20 bg-accent/50">
        {!image ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-primary w-10 h-10" />
            </div>
            <p className="mb-4 text-gray-600">Capture or upload dental image</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="pill-button gradient-bg flex items-center gap-2 mx-auto"
            >
              <Upload size={18} />
              Choose File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        ) : (
          <div className="relative w-full">
            <img src={image} alt="Target" className="w-full h-auto rounded-2xl" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {image && !result && !isAnalyzing && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={startAnalysis}
          className="w-full pill-button gradient-bg py-4 text-lg shadow-lg shadow-primary/20"
        >
          Analyze Scan
        </motion.button>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium animate-pulse">AI is analyzing your scan...</p>
          <p className="text-sm text-gray-400 mt-2">Identifying lesions, caries, and symptoms</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mt-4">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6 mt-8"
          >
            <div className="medical-card border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-primary" />
                <h2 className="text-xl">Analysis Result</h2>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                  result.severity === 'High' ? 'bg-red-100 text-red-600' : 
                  result.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {result.severity} Severity
                </span>
              </div>
              
              <div className="space-y-4">
                <section>
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Findings</h3>
                  <p className="text-gray-700 leading-relaxed">{result.findings}</p>
                </section>

                <section>
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Diagnosis</h3>
                  <p className="text-primary font-semibold text-lg">{result.diagnosis}</p>
                </section>

                {result.symptoms && result.symptoms.length > 0 && (
                  <section>
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Associated Symptoms</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.symptoms.map((s, i) => (
                        <span key={i} className="bg-accent px-3 py-1 rounded-full text-sm">{s}</span>
                      ))}
                    </div>
                  </section>
                )}

                {result.radiographicNotes && (
                  <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-accent/50 p-3 rounded-xl border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bone Levels</h4>
                      <p className="text-xs text-gray-700">{result.radiographicNotes.boneLoss}</p>
                    </div>
                    <div className="bg-accent/50 p-3 rounded-xl border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Caries</h4>
                      <p className="text-xs text-gray-700">{result.radiographicNotes.caries}</p>
                    </div>
                    <div className="bg-accent/50 p-3 rounded-xl border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Periapical</h4>
                      <p className="text-xs text-gray-700">{result.radiographicNotes.periapical}</p>
                    </div>
                  </section>
                )}

                <section className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h3 className="text-sm uppercase tracking-wider text-primary mb-2 font-bold">Treatment Plan</h3>
                  <p className="text-gray-700">{result.treatmentPlan}</p>
                </section>
              </div>
            </div>

            <button className="w-full pill-button border-2 border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2">
              Save to Patient Records
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
