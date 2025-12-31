import { useEffect, useRef, useState } from "react";
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import type { StudentPlacement, StatsData } from "@/types/placement";
import { getBranchName } from "@/lib/branchMapping";

export default function StatsTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Grid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/stats.json");
        if (!response.ok) throw new Error("Failed to load stats data");
        const data: StatsData = await response.json();
        
        const students = data.student || [];
        
        const tableData = students.map((student: StudentPlacement) => [
          student.name,
          student.roll_no,
          student.company_name,
          student.profile,
          getBranchName(student.program_department_id),
          "" // Resume links placeholder
        ]);

        setLoading(false);
        setDataLoaded(true);

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
                { name: "Name", width: "180px" },
                { name: "Roll No.", width: "120px" },
                { name: "Company Name", width: "200px" },
                { name: "Profile", width: "220px" },
                { name: "Branch", width: "120px" },
                { name: "Resume Links", width: "120px" }
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
        <div className="animate-pulse text-muted-foreground">Loading placement data...</div>
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
    <div className="stats-table-wrapper overflow-x-auto">
      <div ref={containerRef} className="gridjs-wrapper min-h-[400px]" />
    </div>
  );
}
