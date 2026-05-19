import { Portfolio } from "@/components/portfolio";
import { profile } from "@/data/profile";
import { getFeaturedGitHubProjects } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [leetcode, projects] = await Promise.all([
    getLeetCodeStats(profile.leetcodeUsername),
    getFeaturedGitHubProjects(
      profile.githubUsername,
      profile.selectedGitHubRepositories,
    ),
  ]);

  return (
    <Portfolio leetcode={leetcode} profile={profile} projects={projects} />
  );
}
