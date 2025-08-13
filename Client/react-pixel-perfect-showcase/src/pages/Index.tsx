import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroIllustration from "@/assets/dev-hero-illustration.png";
import { Quote, Timer, Feather, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Index = () => {
  const API_BASE = "https://dev-landing-ngab.vercel.app";

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = quote.trim();
    if (trimmed.length < 20 || trimmed.length > 1000) {
      toast.error("Quote must be between 20 and 1000 characters.");
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting quote to:', `${API_BASE}/api/quotes`);
      
      const response = await fetch(`${API_BASE}/api/quotes`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name: name.trim() || undefined, 
          role: role.trim() || undefined, 
          quote: trimmed 
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('API Error:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.message || 'Failed to submit quote');
      }

      const data = await response.json();
      console.log('Success:', data);
      
      toast.success("Thanks for your quote! We'll review it soon.");
      setName("");
      setRole("");
      setQuote("");
      
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const message = err instanceof Error ? err.message : "Failed to submit quote. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-2 font-extrabold tracking-tight story-link">
            <img src="/Logo.svg.svg" alt="Dev Quotes Logo" className="h-12 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
            <a href="#submit" className="text-foreground/80 hover:text-foreground transition-colors">Submit</a>
          </nav>
        </div>
      </header>

      <main id="top" className="container mx-auto">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-10 items-center py-20 md:py-28">
          <div className="space-y-6 animate-fade-in">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Motivation for Developers</p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Dev Quotes
              <span className="block text-lg font-semibold text-foreground/70">stay consistent, ship confidently</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">A Chrome extension that delivers short, motivating quotes right in your browser. Show up. Keep going.</p>
            <div className="pt-2">
              <a href="#features">
                <Button variant="pill" size="lg">Learn more</Button>
              </a>
            </div>
          </div>

          <div className="md:pl-8">
            <Card className="rounded-3xl border-2 border-primary/30 shadow-elegant p-2 animate-fade-in">
              <CardContent className="p-0">
                <img
                  src={heroIllustration}
                  alt="Developer coding at desk illustration for Dev Quotes"
                  loading="lazy"
                  className="w-full h-auto rounded-2xl"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-10 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Why Dev Quotes</h2>
            <p className="text-muted-foreground">A tiny extension with a big impact on your daily consistency.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border-2 border-primary/30 p-6 hover-scale">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <Quote className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Curated for Developers</h3>
                  <p className="text-sm text-muted-foreground">A tiny extension with a big impact on your daily consistency.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/30 p-6 hover-scale">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <Timer className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Right on Time</h3>
                  <p className="text-sm text-muted-foreground">Get a nudge when you start your day or open a new tab.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/30 p-6 hover-scale">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <Feather className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Simple & Lightweight</h3>
                  <p className="text-sm text-muted-foreground">Minimal design, zero clutter, and privacy-friendly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Quote className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Wisdom</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Have an inspiring quote that motivates developers? Share it with our community!
                </p>
              </div>
              
              <Button 
              id="submit"
                variant="default" 
                size="lg" 
                className="px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSegp1G6Oq38hNHsPfcLuho_nKy5rwEhxDBxvcvofogwj71bLw/viewform?usp=dialognk', '_blank')}
              >
                <MessageSquareText className="mr-2 h-5 w-5" />
                Submit Your Quote
              </Button>
              
              <div className="mt-16">
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-6"></div>
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -rotate-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <MessageSquareText className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Your Quote Here</h3>
                      <p className="text-muted-foreground text-sm">Inspire fellow developers!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-6 text-sm flex items-center justify-between">
          <span>© 2025 Dev Quotes. Stay consistent.</span>
          <div className="hidden md:flex gap-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#submit" className="text-muted-foreground hover:text-foreground">Submit</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
