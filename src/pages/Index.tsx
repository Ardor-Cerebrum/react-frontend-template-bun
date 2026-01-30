import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Terminal, 
  Layout, 
  Paintbrush, 
  Database, 
  Code, 
  CheckCircle2,
  Rocket
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
    <CardHeader className="space-y-1">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Environment Ready
          </Badge>
          
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
              Project <span className="text-primary">Initialized</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              You've successfully deployed the <span className="text-foreground font-semibold">React Frontend Template</span>.
              Everything is set up and ready for you to build.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" onClick={() => window.open('https://ui.shadcn.com', '_blank')}>
              <Layout className="mr-2 h-4 w-4" />
              Explore Components
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => window.open('https://react.dev', '_blank')}>
              <Code className="mr-2 h-4 w-4" />
              Read Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard 
            icon={Layout} 
            title="Shadcn UI" 
            description="Pre-configured with 40+ accessible components built on Radix UI." 
          />
          <FeatureCard 
            icon={Paintbrush} 
            title="Tailwind CSS" 
            description="Utility-first CSS framework for rapid UI development." 
          />
          <FeatureCard 
            icon={Database} 
            title="React Query" 
            description="Powerful asynchronous state management for server state." 
          />
          <FeatureCard 
            icon={Rocket} 
            title="Production Ready" 
            description="Optimized build setup with Vite and TypeScript." 
          />
        </div>

        {/* Getting Started Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Get Started
              </CardTitle>
              <CardDescription>
                Edit this page to start building your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg border p-4 font-mono text-sm flex items-center justify-between group">
                <code className="text-primary">src/pages/Index.tsx</code>
                <span className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Current File
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Run <code className="bg-muted px-1 py-0.5 rounded text-foreground">bun dev</code> to start the development server</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Check <code className="bg-muted px-1 py-0.5 rounded text-foreground">src/App.tsx</code> for routing configuration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built with <span className="text-red-500">❤️</span> by Ardor Cloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
