import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Instagram, Mail } from "lucide-react"; // Make sure to import icons

const Auth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) alert(error.message);
  };

  // 📸 NEW: Instagram Login Handler
  // Note: For this to work, you need to enable 'Facebook' provider in Supabase
  // because Instagram login is handled via Facebook's Graph API.
  const handleInstagramLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook", // Meta handles Instagram auth
      options: { 
        redirectTo: window.location.origin,
        scopes: 'instagram_basic,pages_show_list' 
      },
    });
    if (error) alert("To make this work real, you need a Meta Developer Account linked to Supabase.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Welcome to Kollab
          </h1>
          <p className="text-muted-foreground">Manage your creator business in one place</p>
        </div>

        <div className="space-y-4">
            {/* 📸 INSTAGRAM BUTTON (The new cool feature) */}
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white font-semibold h-11"
              onClick={handleInstagramLogin}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Continue with Instagram
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
            </div>

            <Button variant="outline" className="w-full h-11" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
        </div>

        <div className="space-y-4">
           <div className="text-center text-xs text-muted-foreground uppercase">Or use email</div>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/30"
              />
              <Button onClick={handleEmailLogin} disabled={loading}>
                {loading ? "..." : <Mail className="w-4 h-4" />}
              </Button>
            </div>
        </div>

      </div>
    </div>
  );
};
export default Auth;