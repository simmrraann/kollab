import { useState } from 'react';
import { Share2, Instagram, Youtube, Linkedin, Save } from 'lucide-react';

export function MediaKit() {
  const [isEditing, setIsEditing] = useState(true);
  const [stats, setStats] = useState({
    name: "Simran Singh",
    title: "AI Engineer & Tech Creator",
    bio: "Building the future of AI tools. Teaching 100K+ students how to code.",
    followers: "125K",
    engagement: "4.8%",
    email: "collab@simran.com"
  });

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💎 Live Media Kit
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">Pro</span>
          </h2>
          <p className="text-sm text-muted-foreground">Your real-time digital business card.</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-secondary px-3 py-2 rounded-lg hover:bg-secondary/80 transition">
          <Share2 className="w-4 h-4" /> Share Public Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editor Side */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Display Name</label>
          <input 
            type="text" 
            value={stats.name} 
            onChange={(e) => setStats({...stats, name: e.target.value})}
            className="w-full p-2 rounded-md border bg-background"
          />
          <label className="text-sm font-medium">Headline</label>
          <input 
            type="text" 
            value={stats.title} 
            onChange={(e) => setStats({...stats, title: e.target.value})}
            className="w-full p-2 rounded-md border bg-background"
          />
          <label className="text-sm font-medium">Bio</label>
          <textarea 
            value={stats.bio} 
            onChange={(e) => setStats({...stats, bio: e.target.value})}
            className="w-full p-2 rounded-md border bg-background h-24"
          />
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {/* Preview Side (The "Live" Look) */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 border-4 border-white/10"></div>
            <h1 className="text-3xl font-bold mb-1">{stats.name}</h1>
            <p className="text-primary-foreground/80 mb-4">{stats.title}</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">{stats.bio}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <Instagram className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                <div className="text-xl font-bold">{stats.followers}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <Youtube className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <div className="text-xl font-bold">45K</div>
                <div className="text-xs text-gray-400">Subscribers</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <Linkedin className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xl font-bold">{stats.engagement}</div>
                <div className="text-xs text-gray-400">Avg. Engagement</div>
              </div>
            </div>

            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}