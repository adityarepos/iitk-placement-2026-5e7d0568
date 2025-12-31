import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Building2 } from "lucide-react";
import StatsTable from "@/components/StatsTable";
import ProformaTable from "@/components/ProformaTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Placement Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View placement statistics and company proformas
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="proforma" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Proforma
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-0">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Student Placements
              </h2>
              <StatsTable />
            </div>
          </TabsContent>

          <TabsContent value="proforma" className="mt-0">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Company Proformas
              </h2>
              <ProformaTable />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Placement Statistics Dashboard
        </div>
      </footer>
    </div>
  );
};

export default Index;
