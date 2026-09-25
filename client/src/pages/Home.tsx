import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 shadow-md">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">MediGuide</h1>
          <p className="text-lg opacity-90">Your Personal Health Guidance & Hospital Finder</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get Instant Health Guidance</h2>
            <p className="text-lg text-muted-foreground mb-6">
              MediGuide helps you assess your symptoms, find nearby hospitals, and access emergency
              support. Available 24/7 without requiring a login.
            </p>
            <a
              href="/symptom-checker"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Symptom Checker
            </a>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/hospitals">Find Hospitals</Link>
              </Button>
              <Button asChild variant="destructive">
                <Link href="/emergency-sos">Emergency SOS</Link>
              </Button>
            </div>
          </div>
          <div className="bg-accent/10 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Quick Assessment</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Symptom Checker</h3>
            <p className="text-muted-foreground text-sm">
              Multi-step assessment to evaluate your symptoms and get severity recommendations.
            </p>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Hospital Finder</h3>
            <p className="text-muted-foreground text-sm">
              Find nearby hospitals and clinics in Hyderabad based on your location and needs.
            </p>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Emergency SOS</h3>
            <p className="text-muted-foreground text-sm">
              Quick access to emergency services with geolocation and ambulance tracking.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-accent/5 border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Assess your symptoms now to get personalized health guidance and find the right medical
            specialist.
          </p>
          <a
            href="/symptom-checker"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Assessment
          </a>
        </div>

        {/* Medical Disclaimer */}
        <div className="medical-disclaimer mt-12">
          <p>
            <strong>Disclaimer:</strong> MediGuide provides general guidance only and is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </main>
    </div>
  );
}
