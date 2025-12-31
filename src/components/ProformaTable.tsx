import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import type { CompanyProforma } from "@/types/placement";

export default function ProformaTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Grid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
          company.ID // For the view details button
        ]);

        setLoading(false);

        setTimeout(() => {
          if (containerRef.current) {
            if (gridRef.current) {
              gridRef.current.destroy();
            }
            containerRef.current.innerHTML = "";

            gridRef.current = new Grid({
              columns: [
                { name: "ID", width: "80px" },
                { name: "Company Name", width: "200px" },
                { name: "Role Name", width: "180px" },
                { name: "Profile", width: "200px" },
                { 
                  name: "View Details", 
                  width: "120px",
                  formatter: (cell) => html(`<button class="view-details-btn" data-id="${cell}">View Details</button>`)
                }
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

            // Add click handler for view details buttons
            containerRef.current.addEventListener("click", (e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains("view-details-btn")) {
                const id = target.getAttribute("data-id");
                if (id) {
                  navigate(`/details/${id}`);
                }
              }
            });
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
  }, [navigate]);

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
