import React, { useState } from 'react';
import { generateNotes } from '@/lib/gemini';
import { Sparkles, BookOpen, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

export const NotesGenerator = () => {
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            toast.error('Please enter a topic first');
            return;
        }

        setIsLoading(true);
        setNotes(''); // Clear previous notes

        try {
            const generatedText = await generateNotes(topic);
            setNotes(generatedText);
            toast.success('Notes generated successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to generate notes');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col w-full h-full relative" style={{ minHeight: '500px' }}>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none opacity-50" />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-border/50 bg-background/50 backdrop-blur z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">AI Notes Generator</h2>
                </div>
                <p className="text-muted-foreground text-sm">
                    Enter any topic below and our AI expert tutor will generate comprehensive study notes for you.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="p-6 flex-grow flex flex-col z-10 gap-6">

                {/* Input Form */}
                <form onSubmit={handleGenerate} className="flex gap-3 items-start flex-col sm:flex-row">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Mitochondria, React Hooks, The French Revolution..."
                        className="flex-grow w-full px-4 py-3 rounded-lg border border-input bg-background/50 backdrop-blur placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="shrink-0 w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-transparent focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <BookOpen className="w-4 h-4" />
                                <span>Generate Notes</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Display Area */}
                <div className="flex-grow flex flex-col rounded-lg border border-border/50 bg-muted/20 overflow-hidden relative">

                    {!notes && !isLoading && (
                        <div className="flex flex-col items-center justify-center text-center p-12 h-full my-auto opacity-60">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Ready to learn?</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Type a topic above and hit generate to get high-quality structured notes right here.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center p-12 h-full my-auto text-primary">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="text-sm font-medium animate-pulse">Consulting the expert...</p>
                        </div>
                    )}

                    {notes && !isLoading && (
                        <div className="p-6 overflow-y-auto max-h-[600px] prose prose-zinc dark:prose-invert prose-sm sm:prose-base max-w-none 
                             prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-6 prose-h2:border-b prose-h2:pb-2 
                             prose-a:text-primary prose-strong:text-foreground">
                            <ReactMarkdownRenderer markdown={notes} />
                        </div>
                    )}

                    {/* Copy / Action buttons (only show if notes exist) */}
                    {notes && !isLoading && (
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(notes);
                                    toast.success('Notes copied to clipboard!');
                                }}
                                className="p-2 bg-background/80 hover:bg-muted border border-border rounded-md shadow-sm transition-colors text-muted-foreground hover:text-foreground"
                                title="Copy to clipboard"
                            >
                                <Download className="w-4 h-4" /> {/* Re-using Download icon for copy action visually */}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Simple Markdown Parser implementation (since we can't easily install react-markdown right now)
// This handles basic headings (*, **), bold (**text**), and lists
const ReactMarkdownRenderer = ({ markdown }: { markdown: string }) => {
    if (!markdown) return null;

    const lines = markdown.split('\n');

    return (
        <>
            {lines.map((line, index) => {
                // H1
                if (line.startsWith('# ')) {
                    return <h1 key={index}>{parseInlineStyles(line.slice(2))}</h1>;
                }
                // H2
                if (line.startsWith('## ')) {
                    return <h2 key={index}>{parseInlineStyles(line.slice(3))}</h2>;
                }
                // H3
                if (line.startsWith('### ')) {
                    return <h3 key={index}>{parseInlineStyles(line.slice(4))}</h3>;
                }
                // Unordered Lists
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                        <ul key={index} className="my-1 pl-6 list-disc">
                            <li>{parseInlineStyles(line.slice(2))}</li>
                        </ul>
                    );
                }
                // Empty lines
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                // Default paragraph
                return <p key={index} className="mb-2">{parseInlineStyles(line)}</p>;
            })}
        </>
    );
};

// Helper to parse **bold** and `code` within strings
const parseInlineStyles = (text: string) => {
    // Very basic regex for bold text: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
};
