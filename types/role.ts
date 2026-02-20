export enum Role {
  COMPANY = "COMPANY",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
  FREELANCER = "FREELANCER",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
  JOB_SEEKER = "JOB_SEEKER",
  BLUE_COLLAR = "BLUE_COLLAR",
  WHITE_COLLAR = "WHITE_COLLAR",
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export enum Status {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  BUSY = "BUSY",
  AWAY = "AWAY",
  UNVERIFIED = "UNVERIFIED", // ✅ Added for unverified accounts
  SUSPENDED = "SUSPENDED", // ✅ Added for suspended accounts
}

export enum CollarType {
  BLUE_COLLAR = "BLUE_COLLAR",
  WHITE_COLLAR = "WHITE_COLLAR",
}

export enum BlueCollarCategory {
  CONSTRUCTION = "Construction",
  MANUFACTURING = "Manufacturing",
  TRANSPORTATION = "Transportation",
  MAINTENANCE = "Maintenance",
  CLEANING = "Cleaning",
  SECURITY = "Security",
  FOOD_SERVICE = "Food Service",
  HEALTHCARE_SUPPORT = "Healthcare Support",
  TECHNICAL_TRADE = "Technical Trade",
  AGRICULTURE = "Agriculture",
  WAREHOUSE = "Warehouse",
  DELIVERY = "Delivery",
  PLUMBING = "Plumbing",
  ELECTRICAL = "Electrical",
  CARPENTRY = "Carpentry",
  PAINTING = "Painting",
  MECHANIC = "Mechanic",
  WELDING = "Welding",
  OTHER = "Other",
}

export enum WhiteCollarCategory {
  TECHNOLOGY = "Technology",
  FINANCE = "Finance",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  LEGAL = "Legal",
  MARKETING = "Marketing",
  CONSULTING = "Consulting",
  HUMAN_RESOURCES = "Human Resources",
  ACCOUNTING = "Accounting",
  SALES = "Sales",
  MANAGEMENT = "Management",
  RESEARCH = "Research",
  DESIGN = "Design",
  MEDIA = "Media",
  OTHER = "Other",
}

export enum ServiceCategory {
  DRY_CLEANING = "Dry Cleaning",
  LAUNDRY = "Laundry",
  ERRAND = "Errand",
  PLUMBING = "Plumbing",
  ELECTRICAL_REPAIR = "Electrical Repair",
  DELIVERY = "Delivery",
  HOME_CLEANING = "Home Cleaning",
  TAILORING = "Tailoring",
  CONSTRUCTION = "Construction",
  MAINTENANCE = "Maintenance",
  SECURITY = "Security",
  FOOD_SERVICE = "Food Service",
  TECHNICAL_SUPPORT = "Technical Support",
  TRANSPORTATION = "Transportation",
  OTHERS = "Others",
}
