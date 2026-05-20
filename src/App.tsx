import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Play, Film, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Video {
  id: string;
  title: string;
  status: string;
  processed_url: string;
  created_at: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <div 
      className="masonry-item group relative bg-black overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <video
          ref={videoRef}
          src={video.processed_url}
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase mb-1 opacity-60">Featured Work</p>
        <h3 className="text-white text-xl font-serif uppercase leading-none">{video.title}</h3>
      </div>
    </div>
  );
};

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/videos`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(data.filter((v: Video) => v.status === 'completed'));
      }
    } catch (err) {
      console.error('Failed to fetch videos', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setFile(null);
        fetchVideos();
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-sm border-b border-black/5 px-6 py-4 flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-serif font-black tracking-tight leading-none">LUMINA</h1>
          <p className="text-[10px] font-sans tracking-[0.5em] uppercase opacity-50">Visual Portfolio</p>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6 text-[11px] font-sans tracking-[0.2em] uppercase font-medium">
            <a href="#" className="hover:opacity-50 transition-opacity">Archive</a>
            <a href="#" className="hover:opacity-50 transition-opacity">About</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
          >
            <Plus size={14} />
            <span>Submit Work</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <section className="mb-24 flex flex-col items-start max-w-2xl">
          <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8">
            Directing <br /> <span className="italic">Emotion</span> Through Motion.
          </h2>
          <p className="text-lg leading-relaxed opacity-70 mb-8 font-sans">
            A curated showcase of cinematic excellence. Minimalist by design, powerful by execution. Exploration of light, shadow, and human narrative.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-sans tracking-[0.2em] uppercase">
            <div className="w-12 h-[1px] bg-black"></div>
            <span>Latest Collections</span>
          </div>
        </section>

        {/* Grid */}
        <div className="masonry-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => !isUploading && setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-xl p-12 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 hover:rotate-90 transition-transform duration-300"
              disabled={isUploading}
            >
              <X size={24} />
            </button>
            
            <div className="mb-10 text-black">
              <h3 className="text-3xl font-serif mb-2 uppercase">Upload Vision</h3>
              <p className="text-[11px] font-sans tracking-[0.2em] uppercase opacity-40">Add your work to the archive</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-8 text-black">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-3">Project Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border-b border-black/20 focus:border-black outline-none py-2 text-xl font-serif transition-colors bg-transparent"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-3">Video File</label>
                <div className="relative h-48 border-2 border-dashed border-black/10 flex flex-col items-center justify-center group hover:border-black/30 transition-colors cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex flex-col items-center p-4">
                      <Film size={32} className="mb-2" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-[10px] opacity-40 mt-1 uppercase">Ready for export</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mb-2 opacity-20 group-hover:scale-110 transition-transform" />
                      <p className="text-[11px] tracking-[0.1em] opacity-40 uppercase">Drag or Click to choose file</p>
                    </>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploading}
                className={`w-full py-5 text-[12px] tracking-[0.3em] uppercase font-bold transition-all flex items-center justify-center gap-3 ${
                  isUploading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ChevronRight size={16} />
                    <span>Initialize Upload</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-[11px] font-sans tracking-[0.3em] uppercase font-bold">Lumina Portfolio</p>
          <p className="text-[10px] opacity-40 uppercase mt-1">© 2024 All rights reserved</p>
        </div>
        
        <div className="flex gap-8 text-[10px] tracking-[0.2em] uppercase font-medium">
          <a href="#" className="hover:underline">Instagram</a>
          <a href="#" className="hover:underline">Vimeo</a>
          <a href="#" className="hover:underline">LinkedIn</a>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] tracking-[0.1em] uppercase opacity-60">System Online</span>
        </div>
      </footer>
    </div>
  );
}
