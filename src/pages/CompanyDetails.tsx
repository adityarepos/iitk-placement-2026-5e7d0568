import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CompanyProforma } from "@/types/placement";

function stripHtml(htmlString: string): string {
  if (!htmlString) return "";
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.textContent || div.innerText || "";
}

function RenderHtml({ html }: { html: string }) {
  if (!html || html === "<p><br></p>") return <span className="text-muted-foreground">-</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm max-w-none dark:prose-invert" />;
}

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyProforma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const response = await fetch("/data/linked_company_details.json");
        if (!response.ok) throw new Error("Failed to load company data");
        const data: CompanyProforma[] = await response.json();
        
        const found = data.find((c) => c.ID.toString() === id);
        if (!found) {
          setError("Company not found");
        } else {
          setCompany(found);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading company details...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="text-destructive text-lg">{error || "Company not found"}</div>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const DetailRow = ({ label, value }: { label: string; value: string | undefined }) => {
    if (!value || value.trim() === "") return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3">
        <dt className="font-medium text-muted-foreground">{label}</dt>
        <dd className="md:col-span-2 text-foreground">{value}</dd>
      </div>
    );
  };

  const HtmlDetailRow = ({ label, value }: { label: string; value: string | undefined }) => {
    if (!value || value.trim() === "" || value === "<p><br></p>") return null;
    return (
      <div className="py-4">
        <dt className="font-medium text-muted-foreground mb-2">{label}</dt>
        <dd className="text-foreground bg-muted/50 rounded-lg p-4">
          <RenderHtml html={value} />
        </dd>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Proforma
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{company.company_name}</CardTitle>
                <p className="text-muted-foreground mt-1">{company.profile}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  ID: {company.ID}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <DetailRow label="Role" value={company.role} />
              <DetailRow label="Profile" value={company.profile} />
              <DetailRow label="Location" value={company.tentative_job_location} />
              <DetailRow label="Bond Details" value={company.bond_details} />
            </dl>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Compensation</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <DetailRow label="CTC (INR)" value={company.ctc_inr} />
              <DetailRow label="Gross" value={company.gross} />
              <DetailRow label="Take Home" value={company.take_home} />
              <DetailRow label="Base" value={company.base} />
              <DetailRow label="Joining Bonus" value={company.joining_bonus} />
              <DetailRow label="Relocation Bonus" value={company.relocation_bonus} />
              <DetailRow label="Retention Bonus" value={company.retention_bonus} />
              <DetailRow label="First Year CTC" value={company.first_ctc} />
              <DetailRow label="Deductions" value={company.deductions} />
              <DetailRow label="Perks" value={company.perks} />
            </dl>
            <HtmlDetailRow label="Package Details" value={company.package_details} />
            <HtmlDetailRow label="Cost to Company Details" value={company.cost_to_company} />
          </CardContent>
        </Card>

        {/* Skills */}
        {company.skill_set && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-foreground">{company.skill_set}</p>
            </CardContent>
          </Card>
        )}

        {/* Job Description */}
        {company.job_description && company.job_description !== "<p><br></p>" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <RenderHtml html={company.job_description} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
