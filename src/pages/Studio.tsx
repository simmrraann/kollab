import { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, X, Trash2, Sparkles, Palette, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// --- TYPES ---
type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'orange';

interface Note {
  id: number;
  title: string;
  content: string;
  color: NoteColor;
}

// --- CONFIG: Hardcoded Pastels (Always Light, Text Always Dark) ---
const NOTE_THEMES: { [key in NoteColor]: string } = {
  yellow: 'bg-[#fff7b1] border-[#eadd78] text-slate-800 placeholder:text-slate-800/50',
  pink:   'bg-[#ffd6e8] border-[#eeb7d2] text-slate-800 placeholder:text-slate-800/50',
  blue:   'bg-[#d6eaff] border-[#b5d6f5] text-slate-800 placeholder:text-slate-800/50',
  green:  'bg-[#dcfce7] border-[#bbf7d0] text-slate-800 placeholder:text-slate-800/50',
  purple: 'bg-[#f3e8ff] border-[#e9d5ff] text-slate-800 placeholder:text-slate-800/50',
  orange: 'bg-[#ffedd5] border-[#fed7aa] text-slate-800 placeholder:text-slate-800/50',
};

// Sticker Pack
const STICKERS = ['🔥', '💡', '✅', '🚀', '❤️', '⭐', '👀', '📌', '💰', '📅'];

// Mock Data
const initialNotes: Note[] = [
  { id: 1, title: 'Matiks Reel Script', content: 'Hook: Stop studying hard... \n\nScene 1: Show messy desk.\nScene 2: Show AI tool.', color: 'yellow' },
  { id: 2, title: 'November Goals', content: '1. Hit 10k followers 🚀\n2. Launch Kollab\n3. Post 5 Reels/week', color: 'pink' },
];

export default function Studio() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  
  // Ref for the textarea to insert emojis at cursor position
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // --- HANDLERS ---
  
  const handleOpenNew = () => {
    setCurrentNote({ id: Date.now(), title: '', content: '', color: 'yellow' });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setCurrentNote(note);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!currentNote) return;
    if (!currentNote.title.trim() && !currentNote.content.trim()) {
      setIsEditorOpen(false);
      return;
    }

    setNotes((prev) => {
      const exists = prev.find((n) => n.id === currentNote.id);
      if (exists) {
        return prev.map((n) => (n.id === currentNote.id ? currentNote : n));
      } else {
        return [currentNote, ...prev];
      }
    });

    toast.success("Note saved!");
    setIsEditorOpen(false);
  };

  const handleDelete = () => {
    if (!currentNote) return;
    setNotes((prev) => prev.filter((n) => n.id !== currentNote.id));
    toast.success("Note deleted.");
    setIsEditorOpen(false);
  };

  const updateField = (field: keyof Note, value: any) => {
    if (currentNote) {
      setCurrentNote({ ...currentNote, [field]: value });
    }
  };

  // Insert Emoji into Textarea logic
  const insertSticker = (sticker: string) => {
    if (!currentNote) return;
    
    // Simple append for now to ensure it works reliably
    // (If you want perfect cursor insertion, we can add that complex logic, but append is safer)
    const newContent = currentNote.content + " " + sticker;
    updateField('content', newContent);
    
    // Auto-focus back to textarea
    setTimeout(() => textAreaRef.current?.focus(), 0);
  };

  return (
    <AppLayout title="Studio" subtitle="Your creative space for scripts & ideas.">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Aesthetic Mode: ON</span>
         </div>
         <Button onClick={handleOpenNew} className="gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> New Note
         </Button>
      </div>

      {/* Grid Layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pb-20">
        <div 
          onClick={handleOpenNew}
          className="break-inside-avoid p-6 rounded-3xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center min-h-[180px] text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer group"
        >
           <div className="w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
             <Plus className="w-6 h-6" />
           </div>
           <span className="font-medium">Create Note</span>
        </div>

        {notes.map((note) => (
           <div 
             key={note.id} 
             onClick={() => handleOpenEdit(note)}
             className={`break-inside-avoid p-5 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative ${NOTE_THEMES[note.color]}`}
           >
              <h3 className="font-bold text-lg mb-2 leading-tight">{note.title || 'Untitled'}</h3>
              <p className="text-sm whitespace-pre-wrap font-medium leading-relaxed opacity-80 line-clamp-6">
                 {note.content || <span className="opacity-40 italic">Empty note...</span>}
              </p>
           </div>
        ))}
      </div>

      {/* --- EDITOR MODAL --- */}
      {isEditorOpen && currentNote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           
           <div className={`relative w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${NOTE_THEMES[currentNote.color]}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-black/5 bg-white/20 backdrop-blur-md">
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsEditorOpen(false)} className="rounded-full hover:bg-black/10 text-slate-800">
                       <X className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="rounded-full hover:bg-red-500/20 text-red-600 hover:text-red-700">
                       <Trash2 className="w-5 h-5" />
                    </Button>
                 </div>
                 <Button onClick={handleSave} className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 border-none">
                    Save
                 </Button>
              </div>

              {/* Tools */}
              <div className="px-6 py-3 flex flex-wrap gap-4 items-center border-b border-black/5 bg-white/10">
                 
                 {/* Color Picker */}
                 <div className="flex items-center gap-3 bg-white/40 px-3 py-1.5 rounded-full">
                    <Palette className="w-4 h-4 text-slate-600" />
                    <div className="flex gap-1">
                      {(Object.keys(NOTE_THEMES) as NoteColor[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => updateField('color', c)}
                          className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-125 ${NOTE_THEMES[c].split(' ')[0]} ${currentNote.color === c ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`}
                        />
                      ))}
                    </div>
                 </div>

                 {/* Sticker Picker */}
                 <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide no-scrollbar">
                    {STICKERS.map(sticker => (
                      <button
                        key={sticker}
                        onClick={() => insertSticker(sticker)}
                        className="text-xl hover:scale-125 transition-transform cursor-pointer p-1"
                        title="Add Sticker"
                      >
                        {sticker}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Editing Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 <input 
                   value={currentNote.title}
                   onChange={(e) => updateField('title', e.target.value)}
                   placeholder="Title your note..."
                   className={`w-full bg-transparent text-3xl font-bold border-none outline-none ${NOTE_THEMES[currentNote.color]}`}
                 />
                 <textarea 
                   ref={textAreaRef}
                   value={currentNote.content}
                   onChange={(e) => updateField('content', e.target.value)}
                   placeholder="Start typing..."
                   className={`w-full h-full min-h-[300px] bg-transparent text-lg leading-relaxed border-none outline-none resize-none whitespace-pre-wrap ${NOTE_THEMES[currentNote.color]}`}
                   spellCheck={false}
                 />
              </div>

              {/* Footer */}
              <div className="p-3 text-center text-xs text-slate-800/40 font-medium">
                 {currentNote.content.length} characters
              </div>

           </div>
        </div>
      )}

    </AppLayout>
  );
}