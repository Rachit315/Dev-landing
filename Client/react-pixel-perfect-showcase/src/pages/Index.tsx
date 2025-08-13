import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroIllustration from "@/assets/dev-hero-illustration.png";
import { Quote, Timer, Feather } from "lucide-react";
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

        {/* Submit */}
        <section id="submit" className="py-16 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Submit Your Quote</h2>
            <p className="text-muted-foreground">Share a short, motivating line for fellow developers.</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="rounded-2xl border-2 border-primary/30 shadow-elegant">
              <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name (optional)"
                      aria-label="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Role (optional)"
                      aria-label="Your role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Quote"
                      aria-label="Your quote"
                      className="min-h-28"
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      required
                      minLength={20}
                      maxLength={1000}
                      disabled={submitting}
                    />
                    <div className="mt-1 text-xs text-muted-foreground text-right">{quote.trim().length}/1000</div>
                  </div>
                  <p className="text-xs text-muted-foreground">By submitting, you confirm you have the right to share this content.</p>
                  <div className="pt-2">
                    <Button type="submit" variant="pill" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? "Sending..." : "Send Quote"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
