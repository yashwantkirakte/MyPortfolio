export const profile = {
  name: "Yashwant Kirakte",
  initials: "YK",
  role: "Developer",
  location: "India / Amravati",
  email: "yashwantkiraktee@gmail.com",
  leetcodeUsername: "yashwant_kirakte_",
  githubUsername: "yashwantkirakte",
  tagline: "Building modern web experiences with clarity and craft.",
  bio: "I am Yashwant Kirakte, a developer focused on clean interfaces, consistent learning, and building projects that grow from practice into polished work.",
  currentFocus: "LeetCode, modern Web Development projects, and portfolio-ready builds , Machine learning",
  skills: [
    {
      group: "WebDevlopment",
      items: ["HTML","Css","Vibe Coding"],
    },

  ],
  selectedGitHubRepositories: [
    // Add public repo names here when you want them featured.
    // Example: "portfolio", "task-manager", "weather-app"
    "telegram-bot"
  ],
  timeline: [
    {
      kind: "experience",
      title: "Experience Placeholder",
      meta: "Company / Role - Date",
      description:
        "Add a compact summary of your responsibilities, stack, and measurable impact.",
    },
    {
      kind: "project",
      title: "Project / Internship Placeholder",
      meta: "Organization / Program - Date",
      description:
        "Use this slot for freelance work, an internship, open source, or a major shipped project.",
    },
    {
      kind: "education",
      title: "Education Placeholder",
      meta: "School / Degree - Date",
      description:
        "Add degree, coursework, certifications, or learning milestones that support your story.",
    },
  ],
};

export type Profile = typeof profile;
