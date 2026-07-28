export type ProjectLink = { label: string; href: string }

export type DiagramNode = {
  id: string
  service: string // AWS service key — see src/components/projects/aws-icons/registry.ts (Task 10)
  label: string
  detail: string
  x: number // 0-100, percentage position within the diagram canvas
  y: number
}

export type DiagramEdge = { from: string; to: string }

export type ProjectDiagram = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export type ProjectMetric = { value: string; label: string }

export type Project = {
  slug: string
  title: string
  subtitle: string
  category: "MLOps" | "AI Agent" | "Side Project"
  image: string
  description: string
  techStack: string[]
  role?: string
  timeframe?: string
  links?: ProjectLink[]
  metrics?: ProjectMetric[]
  diagram?: ProjectDiagram
}

export const projects: Project[] = [
  {
    slug: "model-registry",
    title: "Model Registry",
    subtitle: "Versioned model lifecycle management",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops1/640/400",
    description:
      "Placeholder description: a centralized registry for tracking model versions, lineage, and promotion status across training and serving environments.",
    techStack: ["Python", "MLflow", "PostgreSQL", "Docker"],
    role: "Sole engineer",
    timeframe: "2025",
    links: [{ label: "Repository", href: "#" }],
    metrics: [
      { value: "3x", label: "faster rollback" },
      { value: "40%", label: "fewer promotion errors" },
    ],
    diagram: {
      nodes: [
        { id: "api", service: "api-gateway", label: "API Gateway", detail: "Receives registry read/write requests.", x: 15, y: 50 },
        { id: "lambda", service: "lambda", label: "Registry Service", detail: "Validates and persists model version metadata.", x: 50, y: 50 },
        { id: "db", service: "rds", label: "PostgreSQL", detail: "Stores model version lineage and promotion status.", x: 85, y: 50 },
      ],
      edges: [
        { from: "api", to: "lambda" },
        { from: "lambda", to: "db" },
      ],
    },
  },
  {
    slug: "feature-store",
    title: "Feature Store",
    subtitle: "Low-latency feature serving",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops2/640/400",
    description:
      "Placeholder description: a low-latency online feature store backing real-time inference, with an offline store for training-time consistency.",
    techStack: ["Python", "Redis", "DynamoDB"],
    role: "Sole engineer",
    timeframe: "2025",
  },
  {
    slug: "training-pipeline",
    title: "Training Pipeline",
    subtitle: "Distributed training orchestration",
    category: "MLOps",
    image: "https://picsum.photos/seed/mlops3/640/400",
    description:
      "Placeholder description: orchestrates distributed training jobs across a GPU cluster, with automatic checkpointing and failure recovery.",
    techStack: ["Python", "Kubernetes", "PyTorch"],
    metrics: [{ value: "2.5x", label: "training throughput" }],
  },
  {
    slug: "research-agent",
    title: "Research Agent",
    subtitle: "Autonomous literature review",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent1/640/400",
    description:
      "Placeholder description: an autonomous agent that searches, reads, and summarizes academic literature against a research question.",
    techStack: ["TypeScript", "LLM tool-use", "Vector search"],
    role: "Sole engineer",
    timeframe: "2026",
    links: [{ label: "Repository", href: "#" }, { label: "Demo", href: "#" }],
  },
  {
    slug: "code-reviewer",
    title: "Code Reviewer",
    subtitle: "LLM-powered PR analysis",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent2/640/400",
    description:
      "Placeholder description: reviews pull requests for correctness and style issues, posting inline comments via the GitHub API.",
    techStack: ["TypeScript", "GitHub API", "LLM tool-use"],
    metrics: [
      { value: "150+", label: "PRs reviewed" },
      { value: "22%", label: "fewer review-cycle iterations" },
    ],
    diagram: {
      nodes: [
        { id: "webhook", service: "api-gateway", label: "Webhook", detail: "Receives GitHub PR events.", x: 10, y: 50 },
        { id: "queue", service: "sqs", label: "Queue", detail: "Buffers incoming review requests.", x: 35, y: 50 },
        { id: "worker", service: "lambda", label: "Review Worker", detail: "Runs LLM analysis and posts comments.", x: 62, y: 50 },
        { id: "storage", service: "s3", label: "Diff Cache", detail: "Caches PR diffs for reuse across review passes.", x: 88, y: 50 },
      ],
      edges: [
        { from: "webhook", to: "queue" },
        { from: "queue", to: "worker" },
        { from: "worker", to: "storage" },
      ],
    },
  },
  {
    slug: "tool-router",
    title: "Tool Router",
    subtitle: "Dynamic tool selection layer",
    category: "AI Agent",
    image: "https://picsum.photos/seed/agent3/640/400",
    description:
      "Placeholder description: routes an agent's next action to the correct tool implementation based on intent classification.",
    techStack: ["TypeScript", "LLM tool-use"],
  },
  {
    slug: "portfolio-blog",
    title: "Portfolio Blog",
    subtitle: "This site, built with Next.js",
    category: "Side Project",
    image: "https://picsum.photos/seed/side1/640/400",
    description:
      "Placeholder description: this site — a single-user portfolio and blog built with Next.js App Router, Tailwind, and motion.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [{ label: "Repository", href: "#" }],
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    subtitle: "Minimal daily streak app",
    category: "Side Project",
    image: "https://picsum.photos/seed/side2/640/400",
    description:
      "Placeholder description: a minimal daily habit tracker focused on streak visibility and zero-friction logging.",
    techStack: ["React Native"],
  },
  {
    slug: "recipe-box",
    title: "Recipe Box",
    subtitle: "Family recipes, searchable",
    category: "Side Project",
    image: "https://picsum.photos/seed/side3/640/400",
    description:
      "Placeholder description: a searchable archive of family recipes with unit conversion and serving-size scaling.",
    techStack: ["Next.js", "SQLite"],
  },
]

export const categories: string[] = Array.from(new Set(projects.map((p) => p.category)))

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getCategoryProjects(category: string | null) {
  if (!category || !categories.includes(category)) return projects
  return projects.filter((p) => p.category === category)
}
