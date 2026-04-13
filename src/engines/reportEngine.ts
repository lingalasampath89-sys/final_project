// reportEngine.ts
// 230+ lines Enterprise XML Intelligence Engine

export type Severity = "ERROR" | "WARNING" | "INFO";

export interface ReportIssue {
    severity: Severity;
    message: string;
    suggestion?: string;
}

export interface ExecutiveSummary {
    totalElements: number;
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
    confidenceScore: number;
    structureDepth: number;
    status: string;
}

export interface FullReport {
    executive: ExecutiveSummary;
    validation: ReportIssue[];
    predictive: ReportIssue[];
    analytics: string[];
}

const parseXml = (xml: string): Document => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) {
        throw new Error("Invalid XML");
    }
    return doc;
};

const calculateDepth = (element: Element): number => {
    if (!element.children.length) return 1;
    return (
        1 +
        Math.max(...Array.from(element.children).map(c => calculateDepth(c)))
    );
};

export const generateFullReport = (xml: string): FullReport => {
    const validation: ReportIssue[] = [];
    const predictive: ReportIssue[] = [];
    const analytics: string[] = [];

    let totalElements = 0;
    let depth = 0;

    try {
        const doc = parseXml(xml);
        const elements = Array.from(doc.querySelectorAll("*"));
        totalElements = elements.length;
        depth = calculateDepth(doc.documentElement);

        const idMap = new Map<string, number>();

        elements.forEach(el => {
            const id = el.getAttribute("id");
            if (id) idMap.set(id, (idMap.get(id) || 0) + 1);

            if (el.children.length === 0 && !el.textContent?.trim()) {
                validation.push({
                    severity: "WARNING",
                    message: `Empty element <${el.tagName}> detected`,
                    suggestion: "Provide valid content inside element"
                });
            }

            if (el.textContent && /^\d+$/.test(el.textContent.trim())) {
                const value = parseInt(el.textContent.trim());
                if (value < 0) {
                    predictive.push({
                        severity: "ERROR",
                        message: `Negative numeric value in <${el.tagName}>`,
                        suggestion: "Validate numeric constraints"
                    });
                }
            }
        });

        idMap.forEach((count, id) => {
            if (count > 1) {
                validation.push({
                    severity: "ERROR",
                    message: `Duplicate ID detected: ${id}`,
                    suggestion: "Ensure unique identifiers"
                });
            }
        });

        // Structural analytics
        const frequency: Record<string, number> = {};
        elements.forEach(e => {
            frequency[e.tagName] = (frequency[e.tagName] || 0) + 1;
        });

        const avg =
            Object.values(frequency).reduce((a, b) => a + b, 0) /
            Object.keys(frequency).length;

        analytics.push(`Total Unique Tags: ${Object.keys(frequency).length}`);
        analytics.push(`Average Tag Frequency: ${avg.toFixed(2)}`);
        analytics.push(`Structure Depth: ${depth}`);

        Object.entries(frequency).forEach(([tag, count]) => {
            analytics.push(`Tag ${tag}: ${count}`);
        });

    } catch {
        validation.push({
            severity: "ERROR",
            message: "Malformed XML structure",
            suggestion: "Fix XML syntax errors"
        });
    }

    const errors =
        validation.filter(v => v.severity === "ERROR").length +
        predictive.filter(p => p.severity === "ERROR").length;

    const warnings =
        validation.filter(v => v.severity === "WARNING").length +
        predictive.filter(p => p.severity === "WARNING").length;

    const info =
        validation.filter(v => v.severity === "INFO").length +
        predictive.filter(p => p.severity === "INFO").length;

    let confidenceScore = 95 - errors * 20 - warnings * 5;
    confidenceScore = Math.max(0, Math.min(100, confidenceScore));

    const executive: ExecutiveSummary = {
        totalElements,
        totalIssues: errors + warnings + info,
        errors,
        warnings,
        info,
        confidenceScore,
        structureDepth: depth,
        status: errors > 0 ? "CRITICAL" : warnings > 0 ? "STABLE WITH WARNINGS" : "HEALTHY"
    };

    return {
        executive,
        validation,
        predictive,
        analytics
    };
};