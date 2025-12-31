import { useEffect, useRef, useState } from "react";
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import type { CompanyProforma } from "@/types/placement";

function stripHtml(htmlString: string): string {
  if (!htmlString) return "";
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.textContent || div.innerText || "";
}

function formatCTC(ctc: string): string {
  if (!ctc) return "-";
  const stripped = stripHtml(ctc);
  // Truncate if too long
  return stripped.length > 50 ? stripped.substring(0, 47) + "..." : stripped;
}

export default function ProformaTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Grid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/linked_company_details.json");
        if (!response.ok) throw new Error("Failed to load company data");
        const data: CompanyProforma[] = await response.json();
        
        const tableData = data.map((company: CompanyProforma) => [
          company.ID,
          company.company_name || "-",
          company.role || "-",
          company.profile || "-",
          company.tentative_job_location || "-",
          formatCTC(company.ctc_inr || company.cost_to_company),
          company.bond_details || "-"
        ]);

        setLoading(false);

        // Need a small delay for the DOM to update
        setTimeout(() => {
          if (containerRef.current) {
            // Clear previous grid if exists
            if (gridRef.current) {
              gridRef.current.destroy();
            }
            containerRef.current.innerHTML = "";

            gridRef.current = new Grid({
              columns: [
                { name: "ID", width: "80px" },
                { name: "Company Name", width: "200px" },
                { name: "Role", width: "150px" },
                { name: "Profile", width: "200px" },
                { name: "Location", width: "180px" },
                { name: "CTC", width: "180px" },
                { name: "Bond", width: "100px" }
              ],
              data: tableData,
              search: true,
              pagination: {
                limit: 20
              },
              sort: true,
              resizable: true,
              style: {
                table: {
                  "font-family": "var(--font-sans)",
                },
                th: {
                  "background-color": "hsl(216, 19%, 26%)",
                  "color": "hsl(210, 19%, 98%)",
                  "font-weight": "600",
                  "padding": "12px 16px",
                  "border": "none"
                },
                td: {
                  "padding": "12px 16px",
                  "border-bottom": "1px solid hsl(212, 26%, 83%)"
                }
              }
            });

            gridRef.current.render(containerRef.current);
          }
        }, 100);
        
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (gridRef.current) {
        gridRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading company data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="proforma-table-wrapper overflow-x-auto">
      <div ref={containerRef} className="gridjs-wrapper min-h-[400px]" />
    </div>
  );
}
