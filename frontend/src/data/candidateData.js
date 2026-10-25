export const CANDIDATE_INFO = {
  name: "Sarthak Mehrotra",
  title: "DevOps Engineer",
  tagline: "CI/CD • AWS • Docker • Kubernetes • Terraform",
  experienceYears: "2+ Years",
  currentRole: "DevOps Engineer at Tata Consultancy Services (TCS)",
  location: "Hyderabad, India",
  email: "mehrotrasarthak2017778@gmail.com",
  phone: "+91 91708 67048",
  linkedin: "https://linkedin.com/in/sarthak-mehrotra-8584bb20a",
  hashnode: "https://hashnode.com/@sarthak0078",
  education: "BTech in Computer Science & Engineering (2020 – 2024), Graphic Era University, Dehradun",
  
  summary: `DevOps Engineer with 2 years of experience managing CI/CD pipelines using Jenkins across dev, non-prod, and production environments. Skilled in debugging pipeline failures, onboarding applications, and supporting deployments for Java and .NET systems. Hands-on with AWS (EC2, Auto Scaling, ALB), Docker, Terraform, and Kubernetes for infrastructure provisioning, container orchestration, and deployment automation.`,

  keyMetrics: [
    { label: "Pipelines Managed", value: "15+ Jenkins Pipelines" },
    { label: "Deployment Success", value: "95%+" },
    { label: "Deployment Reduction", value: "75% manual reduction" },
    { label: "Resolution Speed", value: "55% faster MTTR" },
  ],

  skills: {
    "CI/CD & Build": ["Jenkins", "GitHub Actions", "Maven", "Gradle", "SonarQube", "Veracode"],
    "Cloud & Infrastructure": ["AWS (EC2, ASG, ALB)", "Terraform", "Docker", "Kubernetes"],
    "Monitoring & Logs": ["AWS CloudWatch", "Splunk"],
    "Development": ["Java", "HTML/CSS", "JavaScript", "ReactJS", "MySQL", "Firebase", "SQL Server"],
    "Tools & OS": ["Git", "Linux", "Bash Scripting", "Jira"],
  },

  projects: [
    {
      title: "CI/CD Pipeline with AWS Deployment",
      duration: "Sep 2025 – Nov 2025",
      desc: "Designed end-to-end Jenkins pipeline automating build, code analysis, and deployment for a Java application: Git -> SonarQube (SAST/SCA) -> Docker build -> AWS EC2 deploy. Solved Docker permission errors and container networking conflicts.",
    },
    {
      title: "Terraform Infrastructure Automation",
      duration: "May 2025 – Jun 2025",
      desc: "Built reusable Terraform configurations to provision EC2 instances and security groups, reducing manual AWS resource provisioning by 65%. Managed infrastructure lifecycle using Terraform state and CLI.",
    },
    {
      title: "Kubernetes Container Orchestration",
      duration: "Jul 2025 – Aug 2025",
      desc: "Deployed containerized application on Kubernetes to simulate production-like orchestration; exposed services using NodePort and resolved pod-level networking issues using kubectl debugging.",
    },
  ],

  suggestedQuestions: [
    {
      category: "💼 Experience at TCS",
      questions: [
        "What are Sarthak's primary responsibilities at TCS?",
        "How did Sarthak reduce manual deployment steps by 75%?",
        "How does he handle Jenkins pipeline failures in production?",
        "What kind of applications (Java, .NET) did he onboard?",
      ],
    },
    {
      category: "☁️ AWS & Cloud Infra",
      questions: [
        "What AWS services has Sarthak worked with?",
        "How did he use Terraform to automate AWS infrastructure?",
        "What is his experience with Kubernetes and Docker containers?",
        "How does he monitor deployments with CloudWatch and Splunk?",
      ],
    },
    {
      category: "🚀 Technical & Tools",
      questions: [
        "What CI/CD tools and security scanners does he know?",
        "Does Sarthak know scripting and Linux administration?",
        "Can you summarize his educational background and degree?",
        "What makes Sarthak a strong candidate for our DevOps team?",
      ],
    },
  ],
};
