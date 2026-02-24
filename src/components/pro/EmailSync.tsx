import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';

export function EmailSync() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [dealsFound, setDealsFound] = useState(0);

  const handleConnect = () => {
    setStatus('connecting');
    // Simulate API connection delay
    setTimeout(() => {
      setStatus('connected');
      setDealsFound(3);
    }, 2000);
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm max-w-2xl mx-auto">
       <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
         📧 Auto-Deal Scanner
       </h2>
       <p className="text-muted-foreground mb-6">Connect your Gmail to automatically detect sponsorship offers and add them to your board.</p>

       {status === 'disconnected' && (
         <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Mail className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-semibold mb-2">No Account Connected</h3>
           <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
             We only scan for keywords like "Collaboration", "Budget", and "Sponsorship". Your privacy is safe.
           </p>
           <button 
             onClick={handleConnect}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all"
           >
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-5 h-5 bg-white rounded-full p-0.5" />
             Connect with Google
           </button>
         </div>
       )}

       {status === 'connecting' && (
         <div className="text-center py-12">
            <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Authenticating...</p>
         </div>
       )}

       {status === 'connected' && (
         <div className="animate-in fade-in slide-in-from-bottom-4">
           <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 mb-6">
             <ShieldCheck className="w-6 h-6 text-green-500" />
             <div>
               <div className="font-semibold text-green-700 dark:text-green-400">Securely Connected</div>
               <div className="text-xs text-green-600/80">Last scan: Just now</div>
             </div>
           </div>

           <div className="space-y-3">
             <h4 className="font-medium text-sm text-muted-foreground uppercase">Found Opportunities ({dealsFound})</h4>
             
             {/* Mock Deal Items */}
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition cursor-pointer">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">N</div>
                    <div>
                      <div className="font-medium">Nike Collaboration Inquiry</div>
                      <div className="text-xs text-muted-foreground">Received 2 hours ago</div>
                    </div>
                 </div>
                 <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-medium">
                   Add to Board
                 </button>
               </div>
             ))}
           </div>
         </div>
       )}
    </div>
  );
}