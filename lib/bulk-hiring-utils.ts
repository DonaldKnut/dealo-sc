// Bulk Hiring Utility Functions

export interface BulkHiringRequest {
  _id?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  teamSize: string;
  hiringType: "full-time" | "project-based" | "contract" | "outsourcing";
  budget?: string;
  timeline: string;
  skills: string;
  description: string;
  package?: string;
  createdAt?: Date;
  status?: "pending" | "reviewing" | "approved" | "rejected";
  notes?: string;
  updatedAt?: Date;
}

export interface TeamPackage {
  id: string;
  name: string;
  price: string;
  team: string;
  duration: string;
  features: string[];
  replacementGuarantee: number; // days
}

export interface BulkHiringAnalytics {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  averageTeamSize: number;
  popularIndustries: { industry: string; count: number }[];
  monthlyRevenue: number;
}

/**
 * Submit a bulk hiring request
 */
export async function submitBulkHiringRequest(
  data: BulkHiringRequest
): Promise<{ success: boolean; message: string; requestId?: string }> {
  try {
    const response = await fetch("/api/bulk-hiring/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        createdAt: new Date(),
        status: "pending",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit bulk hiring request");
    }

    const result = await response.json();
    return {
      success: true,
      message: "Request submitted successfully",
      requestId: result.requestId,
    };
  } catch (error) {
    console.error("Error submitting bulk hiring request:", error);
    return {
      success: false,
      message: "Failed to submit request. Please try again.",
    };
  }
}

/**
 * Get all bulk hiring requests (admin)
 */
export async function getBulkHiringRequests(
  status?: string
): Promise<BulkHiringRequest[]> {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await fetch(`/api/bulk-hiring/requests${query}`);

    if (!response.ok) {
      throw new Error("Failed to fetch bulk hiring requests");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bulk hiring requests:", error);
    return [];
  }
}

/**
 * Update bulk hiring request status
 */
export async function updateBulkHiringStatus(
  requestId: string,
  status: "pending" | "reviewing" | "approved" | "rejected",
  notes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/bulk-hiring/request/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error("Failed to update request status");
    }

    return {
      success: true,
      message: "Request status updated successfully",
    };
  } catch (error) {
    console.error("Error updating bulk hiring status:", error);
    return {
      success: false,
      message: "Failed to update status. Please try again.",
    };
  }
}

/**
 * Calculate pricing for bulk hiring
 */
export function calculateBulkHiringPrice(
  teamSize: number,
  hiringType: string,
  duration?: number
): number {
  const basePrice = 100000; // Base price per person in Naira
  let multiplier = 1;

  // Adjust based on hiring type
  switch (hiringType) {
    case "full-time":
      multiplier = 1.0;
      break;
    case "project-based":
      multiplier = 0.8;
      break;
    case "contract":
      multiplier = 0.7;
      break;
    case "outsourcing":
      multiplier = 1.2; // Includes management overhead
      break;
  }

  // Volume discount
  let discount = 0;
  if (teamSize >= 50) {
    discount = 0.25; // 25% discount for 50+
  } else if (teamSize >= 25) {
    discount = 0.15; // 15% discount for 25+
  } else if (teamSize >= 10) {
    discount = 0.1; // 10% discount for 10+
  }

  const subtotal = basePrice * teamSize * multiplier;
  const discountAmount = subtotal * discount;

  return subtotal - discountAmount;
}

/**
 * Get recommended team structure based on project requirements
 */
export function getRecommendedTeamStructure(
  projectType: string,
  teamSize: number
): { role: string; count: number; seniority: string }[] {
  const structures: {
    [key: string]: { role: string; percentage: number; seniority: string }[];
  } = {
    "software-development": [
      { role: "Senior Developer", percentage: 0.2, seniority: "senior" },
      { role: "Mid-Level Developer", percentage: 0.5, seniority: "mid" },
      { role: "Junior Developer", percentage: 0.2, seniority: "junior" },
      { role: "QA Engineer", percentage: 0.1, seniority: "mid" },
    ],
    marketing: [
      { role: "Marketing Manager", percentage: 0.15, seniority: "senior" },
      { role: "Content Creator", percentage: 0.3, seniority: "mid" },
      { role: "Social Media Manager", percentage: 0.25, seniority: "mid" },
      { role: "Graphic Designer", percentage: 0.2, seniority: "mid" },
      { role: "Marketing Analyst", percentage: 0.1, seniority: "junior" },
    ],
    "customer-support": [
      { role: "Support Manager", percentage: 0.1, seniority: "senior" },
      { role: "Senior Support Agent", percentage: 0.2, seniority: "mid" },
      { role: "Support Agent", percentage: 0.7, seniority: "junior" },
    ],
    sales: [
      { role: "Sales Manager", percentage: 0.15, seniority: "senior" },
      { role: "Account Executive", percentage: 0.35, seniority: "mid" },
      { role: "Sales Representative", percentage: 0.4, seniority: "junior" },
      { role: "Sales Operations", percentage: 0.1, seniority: "mid" },
    ],
  };

  const structure =
    structures[projectType] || structures["software-development"];

  return structure.map((item) => ({
    ...item,
    count: Math.max(1, Math.round(teamSize * item.percentage)),
  }));
}

/**
 * Generate bulk hiring contract template
 */
export function generateContractTemplate(
  request: BulkHiringRequest,
  packageDetails: TeamPackage
): string {
  return `
BULK HIRING & OUTSOURCING AGREEMENT

This Agreement is made on ${new Date().toLocaleDateString()} between:

CLIENT: ${request.companyName}
Contact: ${request.contactName}
Email: ${request.email}

SERVICE PROVIDER: Dealo Africa

1. SCOPE OF SERVICES
   - Team Size: ${request.teamSize}
   - Hiring Type: ${request.hiringType}
   - Package: ${packageDetails.name}
   - Duration: ${packageDetails.duration}

2. DELIVERABLES
   ${packageDetails.features.map((f) => `   - ${f}`).join("\n")}

3. TIMELINE
   - Expected Start: ${request.timeline}
   - Replacement Guarantee: ${packageDetails.replacementGuarantee} days

4. PRICING
   - Package Price: ${packageDetails.price}
   - Payment Terms: 50% upfront, 50% upon team deployment

5. TERMS & CONDITIONS
   - All professionals are pre-vetted and background checked
   - Free replacements within guarantee period
   - Dedicated account manager assigned
   - Monthly performance reviews included

Agreed and Accepted:

_______________________          _______________________
Client Signature                 Dealo Representative
Date: ___________                Date: ___________
  `.trim();
}

/**
 * Calculate estimated time to hire based on team size and requirements
 */
export function estimateTimeToHire(
  teamSize: number,
  complexity: string
): number {
  // Base days
  let baseDays = 14;

  // Add days based on team size
  if (teamSize > 50) {
    baseDays += 28;
  } else if (teamSize > 25) {
    baseDays += 21;
  } else if (teamSize > 10) {
    baseDays += 14;
  }

  // Adjust for complexity
  const complexityMultiplier =
    complexity === "high" ? 1.5 : complexity === "medium" ? 1.2 : 1.0;

  return Math.round(baseDays * complexityMultiplier);
}

/**
 * Validate bulk hiring request data
 */
export function validateBulkHiringRequest(data: Partial<BulkHiringRequest>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push("Company name is required");
  }

  if (!data.contactName || data.contactName.trim().length < 2) {
    errors.push("Contact name is required");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email address is required");
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.push("Valid phone number is required");
  }

  if (!data.industry) {
    errors.push("Industry selection is required");
  }

  if (!data.teamSize) {
    errors.push("Team size is required");
  }

  if (!data.skills || data.skills.trim().length < 5) {
    errors.push("Required skills must be specified");
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.push("Project description must be at least 20 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper function to validate email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get bulk hiring analytics (admin)
 */
export async function getBulkHiringAnalytics(): Promise<BulkHiringAnalytics | null> {
  try {
    const response = await fetch("/api/bulk-hiring/analytics");

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bulk hiring analytics:", error);
    return null;
  }
}

/**
 * Send notification to admin about new bulk hiring request
 */
export async function notifyAdminNewRequest(
  request: BulkHiringRequest
): Promise<void> {
  try {
    await fetch("/api/notifications/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "bulk_hiring_request",
        title: "New Bulk Hiring Request",
        message: `${request.companyName} has requested to hire ${request.teamSize} professionals`,
        data: request,
      }),
    });
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
}

/**
 * Export bulk hiring data to CSV
 */
export function exportBulkHiringToCSV(requests: BulkHiringRequest[]): string {
  const headers = [
    "Company Name",
    "Contact Name",
    "Email",
    "Phone",
    "Industry",
    "Team Size",
    "Hiring Type",
    "Timeline",
    "Status",
    "Created At",
  ];

  const rows = requests.map((req) => [
    req.companyName,
    req.contactName,
    req.email,
    req.phone,
    req.industry,
    req.teamSize,
    req.hiringType,
    req.timeline,
    req.status || "pending",
    req.createdAt?.toISOString() || "",
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  return csvContent;
}
