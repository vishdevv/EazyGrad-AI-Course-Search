/**
 * Seed script — run once to populate the programs collection.
 * Usage: npm run seed
 *
 * Drops and re-inserts all programs on every run so the dataset
 * stays deterministic during development and demos.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProgramModel } from "../models/Program";
import type { ProgramDocument } from "../models/Program";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not set in your environment.");
  process.exit(1);
}

type SeedProgram = Omit<ProgramDocument, keyof mongoose.Document>;

const programs: SeedProgram[] = [
  // ── MBA ──────────────────────────────────────────────────────────────────
  {
    name: "MBA in Business Analytics",
    provider: "Northvale University Online",
    degreeType: "MBA",
    specialization: "Business Analytics",
    durationMonths: 24,
    feeMin: 180_000,
    feeMax: 220_000,
    description:
      "A two-year online MBA focused on data-driven decision-making, SQL for business, dashboarding, and applied statistics. Designed for working professionals who want to move into analytics-heavy management roles.",
    eligibility: "Any bachelor's degree with 2+ years of work experience",
    mode: "online",
    tags: [
      "analytics",
      "data",
      "management",
      "working professional",
      "statistics",
      "business intelligence",
    ],
  },
  {
    name: "MBA in Marketing Management",
    provider: "Crestfield School of Business",
    degreeType: "MBA",
    specialization: "Marketing Management",
    durationMonths: 18,
    feeMin: 150_000,
    feeMax: 190_000,
    description:
      "An 18-month accelerated MBA with deep focus on digital marketing, brand strategy, consumer behaviour, and marketing analytics. Suitable for marketing executives looking to move into leadership.",
    eligibility: "Any bachelor's degree with 1+ year of work experience",
    mode: "online",
    tags: [
      "marketing",
      "branding",
      "digital marketing",
      "leadership",
      "consumer behaviour",
      "management",
    ],
  },
  {
    name: "MBA in Finance",
    provider: "Meridian Institute of Management",
    degreeType: "MBA",
    specialization: "Finance",
    durationMonths: 24,
    feeMin: 200_000,
    feeMax: 260_000,
    description:
      "A rigorous finance MBA covering corporate finance, investment analysis, financial modelling, and risk management. Strong placement record in banking and fintech sectors.",
    eligibility: "Any bachelor's degree with 2+ years of work experience",
    mode: "hybrid",
    tags: [
      "finance",
      "investment",
      "banking",
      "fintech",
      "risk management",
      "corporate finance",
      "CA background",
    ],
  },
  {
    name: "MBA in Human Resource Management",
    provider: "Pinnacle Open University",
    degreeType: "MBA",
    specialization: "Human Resource Management",
    durationMonths: 24,
    feeMin: 120_000,
    feeMax: 160_000,
    description:
      "Covers talent acquisition, performance management, labour law, and organisational behaviour. Ideal for HR professionals who want to formalise their expertise and move into CHRO tracks.",
    eligibility: "Any graduate",
    mode: "online",
    tags: [
      "HR",
      "human resources",
      "talent",
      "people management",
      "organisational behaviour",
      "labour law",
    ],
  },
  {
    name: "MBA in Operations & Supply Chain",
    provider: "Ironridge Business School",
    degreeType: "MBA",
    specialization: "Operations & Supply Chain",
    durationMonths: 24,
    feeMin: 170_000,
    feeMax: 210_000,
    description:
      "Focuses on supply chain strategy, logistics optimisation, lean manufacturing, and procurement. Popular with engineers moving into operations management and manufacturing leadership.",
    eligibility: "Any bachelor's degree; engineering background preferred",
    mode: "online",
    tags: [
      "operations",
      "supply chain",
      "logistics",
      "manufacturing",
      "lean",
      "procurement",
      "engineer",
    ],
  },

  // ── BBA ──────────────────────────────────────────────────────────────────
  {
    name: "BBA in General Management",
    provider: "Greenvale Open College",
    degreeType: "BBA",
    specialization: "General Management",
    durationMonths: 36,
    feeMin: 60_000,
    feeMax: 90_000,
    description:
      "A three-year undergraduate business degree covering accounting, marketing, economics, and management fundamentals. Entry-level management careers and entrepreneurship.",
    eligibility: "10+2 (any stream)",
    mode: "online",
    tags: [
      "undergraduate",
      "management",
      "freshers",
      "business basics",
      "entrepreneurship",
      "first degree",
    ],
  },
  {
    name: "BBA in Retail & E-Commerce",
    provider: "Horizon Learning Institute",
    degreeType: "BBA",
    specialization: "Retail & E-Commerce",
    durationMonths: 36,
    feeMin: 70_000,
    feeMax: 100_000,
    description:
      "Designed for students interested in retail operations, marketplace management, and D2C commerce. Covers category management, digital storefronts, and customer experience.",
    eligibility: "10+2 (any stream)",
    mode: "online",
    tags: [
      "retail",
      "e-commerce",
      "D2C",
      "marketplace",
      "customer experience",
      "commerce",
    ],
  },

  // ── MCA ──────────────────────────────────────────────────────────────────
  {
    name: "MCA — Master of Computer Applications",
    provider: "Northvale University Online",
    degreeType: "MCA",
    specialization: "General Computing",
    durationMonths: 24,
    feeMin: 110_000,
    feeMax: 150_000,
    description:
      "A comprehensive MCA covering data structures, algorithms, software engineering, databases, and cloud computing. Designed for graduates from any stream who want to build a career in software development.",
    eligibility: "Any bachelor's degree with Mathematics at 10+2 or graduation level",
    mode: "online",
    tags: [
      "software development",
      "programming",
      "algorithms",
      "cloud",
      "career switch to IT",
      "non-engineering background",
    ],
  },
  {
    name: "MCA in Artificial Intelligence & Machine Learning",
    provider: "Techvance University",
    degreeType: "MCA",
    specialization: "AI & Machine Learning",
    durationMonths: 24,
    feeMin: 160_000,
    feeMax: 200_000,
    description:
      "Specialised MCA with heavy focus on Python, ML algorithms, deep learning, NLP, and AI deployment. Bridging program for graduates who want to enter the AI/data science field without a prior CS degree.",
    eligibility: "Any bachelor's degree",
    mode: "online",
    tags: [
      "AI",
      "machine learning",
      "deep learning",
      "Python",
      "data science",
      "NLP",
      "career switch",
    ],
  },
  {
    name: "MCA in Cybersecurity",
    provider: "Ironridge Business School",
    degreeType: "MCA",
    specialization: "Cybersecurity",
    durationMonths: 24,
    feeMin: 140_000,
    feeMax: 180_000,
    description:
      "Covers network security, ethical hacking, digital forensics, and compliance frameworks (ISO 27001, GDPR). For IT professionals and graduates who want to specialise in information security.",
    eligibility: "Any bachelor's degree; IT background preferred",
    mode: "online",
    tags: [
      "cybersecurity",
      "ethical hacking",
      "network security",
      "infosec",
      "IT professional",
      "forensics",
    ],
  },

  // ── BCA ──────────────────────────────────────────────────────────────────
  {
    name: "BCA — Bachelor of Computer Applications",
    provider: "Greenvale Open College",
    degreeType: "BCA",
    specialization: "General Computing",
    durationMonths: 36,
    feeMin: 50_000,
    feeMax: 80_000,
    description:
      "Three-year undergraduate program covering core programming, web development, database management, and networking. Ideal stepping stone to IT careers or further studies (MCA, MBA IT).",
    eligibility: "10+2 (any stream)",
    mode: "online",
    tags: [
      "undergraduate",
      "programming",
      "web development",
      "freshers",
      "IT career start",
      "first degree",
    ],
  },
  {
    name: "BCA in Cloud & DevOps",
    provider: "Techvance University",
    degreeType: "BCA",
    specialization: "Cloud & DevOps",
    durationMonths: 36,
    feeMin: 65_000,
    feeMax: 95_000,
    description:
      "Modern BCA with cloud computing, CI/CD pipelines, containerisation (Docker/Kubernetes), and DevOps practices embedded into the curriculum. Targets fresher roles in cloud-native companies.",
    eligibility: "10+2 (Science/Maths preferred)",
    mode: "online",
    tags: [
      "cloud",
      "DevOps",
      "Docker",
      "Kubernetes",
      "infrastructure",
      "freshers",
    ],
  },

  // ── MScIT ─────────────────────────────────────────────────────────────────
  {
    name: "MSc in Information Technology",
    provider: "Meridian Institute of Management",
    degreeType: "MScIT",
    specialization: "Information Technology",
    durationMonths: 24,
    feeMin: 90_000,
    feeMax: 130_000,
    description:
      "Research-oriented master's in IT covering advanced networking, software architecture, cloud infrastructure, and IoT. Suited for IT professionals seeking specialisation without a full MBA.",
    eligibility: "BCA, BSc CS, or any IT-related bachelor's",
    mode: "online",
    tags: [
      "IT",
      "networking",
      "software architecture",
      "IoT",
      "research",
      "technical specialisation",
    ],
  },
  {
    name: "MSc in Data Science",
    provider: "Pinnacle Open University",
    degreeType: "MScIT",
    specialization: "Data Science",
    durationMonths: 18,
    feeMin: 130_000,
    feeMax: 170_000,
    description:
      "An 18-month intensive covering statistical modelling, Python, R, big data tools (Spark, Hadoop), and visualisation. Preferred by analysts and engineers who want to formalise data science credentials.",
    eligibility: "Any graduate with Mathematics or Statistics background",
    mode: "online",
    tags: [
      "data science",
      "Python",
      "R",
      "statistics",
      "big data",
      "analytics",
      "Spark",
    ],
  },

  // ── BScCS ─────────────────────────────────────────────────────────────────
  {
    name: "BSc in Computer Science",
    provider: "Horizon Learning Institute",
    degreeType: "BScCS",
    specialization: "Computer Science",
    durationMonths: 36,
    feeMin: 55_000,
    feeMax: 85_000,
    description:
      "Theoretical and practical undergraduate CS degree: algorithms, OS, computer networks, and software engineering fundamentals. Strong foundation for students aiming at product companies or higher studies.",
    eligibility: "10+2 with Science/Maths",
    mode: "online",
    tags: [
      "undergraduate",
      "computer science",
      "algorithms",
      "software engineering",
      "freshers",
      "product companies",
    ],
  },

  // ── MCom ──────────────────────────────────────────────────────────────────
  {
    name: "MCom in Accounting & Taxation",
    provider: "Crestfield School of Business",
    degreeType: "MCom",
    specialization: "Accounting & Taxation",
    durationMonths: 24,
    feeMin: 80_000,
    feeMax: 120_000,
    description:
      "Advanced commerce degree covering GST, income tax, financial reporting (Ind AS), and audit. Ideal for BCom graduates who want deeper accounting expertise for CA supplement or corporate finance roles.",
    eligibility: "BCom or equivalent",
    mode: "online",
    tags: [
      "accounting",
      "taxation",
      "GST",
      "finance",
      "audit",
      "commerce background",
      "CA supplement",
    ],
  },
  {
    name: "MCom in Banking & Financial Services",
    provider: "Northvale University Online",
    degreeType: "MCom",
    specialization: "Banking & Financial Services",
    durationMonths: 24,
    feeMin: 85_000,
    feeMax: 115_000,
    description:
      "Covers banking operations, credit management, derivatives, and RBI regulations. Designed for commerce graduates and banking professionals seeking managerial roles in the BFSI sector.",
    eligibility: "BCom or equivalent; working experience in banking is a plus",
    mode: "online",
    tags: [
      "banking",
      "BFSI",
      "credit",
      "finance",
      "RBI",
      "commerce background",
      "fintech",
    ],
  },

  // ── BCom ──────────────────────────────────────────────────────────────────
  {
    name: "BCom in Financial Accounting",
    provider: "Greenvale Open College",
    degreeType: "BCom",
    specialization: "Financial Accounting",
    durationMonths: 36,
    feeMin: 40_000,
    feeMax: 65_000,
    description:
      "Three-year undergraduate commerce program with deep coverage of financial accounting, cost accounting, business law, and economics. Strong base for commerce careers, CA foundation, or MBA Finance.",
    eligibility: "10+2 (Commerce preferred, all streams accepted)",
    mode: "online",
    tags: [
      "undergraduate",
      "commerce",
      "accounting",
      "CA foundation",
      "freshers",
      "first degree",
    ],
  },
  {
    name: "BCom in Business Economics",
    provider: "Horizon Learning Institute",
    degreeType: "BCom",
    specialization: "Business Economics",
    durationMonths: 36,
    feeMin: 45_000,
    feeMax: 70_000,
    description:
      "Blends economics theory with business applications — microeconomics, macroeconomics, business statistics, and applied econometrics. Suited for students interested in policy, consulting, or economics-driven roles.",
    eligibility: "10+2 (any stream)",
    mode: "online",
    tags: [
      "economics",
      "business",
      "statistics",
      "policy",
      "consulting",
      "undergraduate",
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB.");

  await ProgramModel.deleteMany({});
  console.log("Cleared existing programs.");

  const inserted = await ProgramModel.insertMany(programs);
  console.log(`Seeded ${inserted.length} programs successfully.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
