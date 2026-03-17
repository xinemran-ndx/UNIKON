/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Camera, 
  Search, 
  Zap, 
  Layers, 
  Menu,
  ChevronRight,
  Github,
  Twitter,
  Instagram,
  LogOut,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';

// --- Types ---

interface GeneratedPrompt {
  title: string;
  text: string;
  cameraAngle: string;
}

// --- Constants ---

const CAMERA_ANGLES = [
  "close-up shot", "extreme close-up", "medium shot", "wide shot", "long shot",
  "low angle shot", "high angle shot", "overhead shot", "top-down view",
  "side profile shot", "over the shoulder shot", "macro shot", "eye level shot",
  "cinematic perspective", "drone view"
];

const LENSES = ["35mm", "50mm", "85mm", "24mm", "macro lens"];
const LIGHTING = ["golden hour", "dramatic lighting", "soft natural light", "cinematic shadows", "neon reflections"];

// --- Components ---

const Navbar = ({ user }: { user: FirebaseUser | null }) => (
  <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-glow rounded-lg flex items-center justify-center neon-glow overflow-hidden">
        <img 
          src="https://i.ibb.co/7JKn0gz6/512-unikon-logo.png" 
          alt="UNIKON.AI Logo" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className="text-xl font-bold tracking-tighter font-display neon-text">UNIKON.AI</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
      <a href="#" className="hover:text-white transition-colors">Features</a>
      <a href="#" className="hover:text-white transition-colors">Showcase</a>
      {user && (
        <div className="flex items-center gap-4 border-l border-white/10 pl-8">
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full border border-white/20" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-3 h-3 text-accent" />
              </div>
            )}
            <span className="text-white/80">{user.displayName || user.email}</span>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
    <button className="md:hidden p-2">
      <Menu className="w-6 h-6" />
    </button>
  </nav>
);

const PromptCard = ({ prompt, index }: { prompt: GeneratedPrompt; index: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-4 group hover:border-accent/50 transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Camera className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{prompt.cameraAngle}</span>
        </div>
        <span className="text-white/20 text-xs font-mono">#0{index + 1}</span>
      </div>
      <h3 className="text-lg font-bold font-display">{prompt.title}</h3>
      <p className="text-white/70 text-sm leading-relaxed min-h-[100px]">
        {prompt.text}
      </p>
      <button
        onClick={handleCopy}
        className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all ${
          copied 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
    </div>
  );
};

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent-glow/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-glow rounded-xl flex items-center justify-center mx-auto mb-4 neon-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2 tracking-tight">UNIKON.AI</h1>
          <p className="text-white/50">{isLogin ? 'Welcome back, creator.' : 'Join the future of prompts.'}</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent/50 focus:ring-0 transition-all outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent/50 focus:ring-0 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent hover:bg-accent/90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-background px-4 text-white/20">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google Account
        </button>

        <p className="text-center mt-8 text-sm text-white/40">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Image size should be less than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setSelectedImage(base64String.split(',')[1]);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageMimeType(null);
    setImagePreview(null);
  };

  const generatePrompts = async () => {
    if (!keywords.trim() && !selectedImage) return;

    setLoading(true);
    setError(null);
    setPrompts([]);

    try {
      const apiKey = import.meta.env.VITE_YIM_NDX_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please set VITE_YIM_NDX_GEMINI_API_KEY.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [];
      
      if (selectedImage && imageMimeType) {
        parts.push({
          inlineData: {
            data: selectedImage,
            mimeType: imageMimeType
          }
        });
      }

      let promptText = "";
      if (selectedImage) {
        promptText = `CONSISTENCY LOCK SYSTEM ACTIVATED.
        
        1. ANALYZE AND LOCK:
        - Face and identity of the main character (if present)
        - Hairstyle and facial features
        - Clothing and outfit
        - Important objects in the scene
        - Environment and scene type
        - Lighting style and mood
        
        2. GENERATION TASK:
        Generate 4 ultra-realistic image prompts based on the reference image.
        
        3. CONSISTENCY RULES:
        - Subject identity and face MUST remain identical across all 4 prompts.
        - Outfit and character appearance MUST remain consistent unless the user's description below explicitly changes them.
        - Environment and lighting should be preserved unless a new scene is described.
        
        4. USER INPUT:
        ${keywords.trim() ? `The user wants to modify the scene or add actions: "${keywords}"` : "The user wants to see the character/scene from different perspectives (image only)."}
        
        5. CAMERA RULES:
        - If the user specified a camera angle in their description, use it for at least one prompt.
        - Otherwise, ensure each of the 4 prompts uses a DIFFERENT cinematic camera angle.`;
      } else {
        promptText = `Generate 4 ultra-realistic image prompts based on these keywords: "${keywords}"`;
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: { parts },
        config: {
          systemInstruction: `You are UNIKON.AI, an advanced Ultra Realistic Image Prompt Generator with a built-in Consistency Lock System.
          
          CORE MISSION:
          When a reference image is provided, your primary goal is to maintain absolute visual consistency for the subject's identity (face, hair, body type) and their outfit across all generated prompts.
          
          RULES:
          1. Generate exactly 4 prompts.
          2. Each prompt must use a DIFFERENT camera angle from this list: ${CAMERA_ANGLES.join(", ")} (unless the user specifies a specific angle).
          3. Focus ONLY on ultra-realistic photography. No cartoons, illustrations, or fantasy styles.
          4. Each prompt must be cinematic and photorealistic.
          5. Each prompt should be between 50 and 100 words for maximum detail.
          6. Use professional camera gear terminology (Lenses: ${LENSES.join(", ")}, Lighting: ${LIGHTING.join(", ")}).
          7. If a reference image is provided, LOCK the character's face, hairstyle, and clothing. Even if the character is placed in a new scene (e.g., "driving a car" or "in a cyberpunk city"), their physical appearance must be described consistently so an AI generator can reproduce the same person.
          8. Structure each prompt to include: subject description (with consistency details), environment, lighting, lens details, depth of field, atmosphere, and quality keywords (8k detail, HDR, ray tracing, etc.).
          
          OUTPUT FORMAT:
          Return a JSON array of 4 objects, each with:
          - "title": A short catchy title.
          - "text": The full generated prompt text.
          - "cameraAngle": The specific camera angle used.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                text: { type: Type.STRING },
                cameraAngle: { type: Type.STRING }
              },
              required: ["title", "text", "cameraAngle"]
            }
          }
        }
      });

      const result = JSON.parse(response.text || "[]");
      setPrompts(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate prompts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Next-Gen Prompt Engineering
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 tracking-tight"
          >
            UNIKON<span className="text-accent">.AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Cinematic & Consistent Image Prompts in Seconds. Optimized for Midjourney, Stable Diffusion & Nano Banana 2.
          </motion.p>

          {/* Input Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-glow rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col gap-4 p-4 glass-card">
              
              {/* Image Upload Area */}
              <div className="flex flex-wrap gap-4 items-center">
                {!imagePreview ? (
                  <label className="flex-1 flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-accent/50 hover:bg-white/5 transition-all cursor-pointer group/upload">
                    <Upload className="w-5 h-5 text-white/40 group-hover/upload:text-accent transition-colors" />
                    <span className="text-sm text-white/40 group-hover/upload:text-white/60 transition-colors">Upload Reference Image (Optional)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden border border-white/10 group/preview">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white transition-all opacity-0 group-hover/preview:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 backdrop-blur-sm">
                      <p className="text-[10px] text-white/80 truncate flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Reference Image Active
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center px-4 gap-3 bg-white/5 rounded-xl border border-white/5 focus-within:border-accent/30 transition-all">
                  <Search className="w-5 h-5 text-white/40" />
                  <input 
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generatePrompts()}
                    placeholder={selectedImage ? 'Add keywords to refine analysis...' : 'e.g., "cyberpunk street rain night neon lights"'}
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 py-4"
                  />
                </div>
                <button 
                  onClick={generatePrompts}
                  disabled={loading || (!keywords.trim() && !selectedImage)}
                  className="px-8 py-4 bg-accent hover:bg-accent/90 disabled:bg-white/10 disabled:text-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Generate
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {prompts.map((prompt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
              >
                <PromptCard prompt={prompt} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State / Error */}
        {!loading && prompts.length === 0 && !error && (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl">
            <Layers className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-medium">Enter keywords above to start generating</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
            {error}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="https://i.ibb.co/7JKn0gz6/512-unikon-logo.png" 
                  alt="UNIKON.AI Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-lg font-bold font-display">UNIKON.AI</span>
            </div>
            <p className="text-white/40 text-sm">Ultra Realistic Prompt Generator</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/unikon_art/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://github.com/xinemran-ndx" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 UNIKON.AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
