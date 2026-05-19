export type GitHubProject = {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
  fork: boolean;
};

export async function getFeaturedGitHubProjects(
  username: string,
  selectedNames: string[],
): Promise<GitHubProject[]> {
  if (selectedNames.length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 60 * 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }

    const repos = (await response.json()) as GitHubRepo[];
    const selectedOrder = selectedNames.map((name) => name.toLowerCase());
    const selected = new Set(selectedOrder);

    return repos
      .filter((repo) => !repo.fork && selected.has(repo.name.toLowerCase()))
      .sort(
        (a, b) =>
          selectedOrder.indexOf(a.name.toLowerCase()) -
          selectedOrder.indexOf(b.name.toLowerCase()),
      )
      .map((repo) => ({
        name: repo.name,
        description:
          repo.description ??
          "Add a GitHub repository description to make this project card stronger.",
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        topics: repo.topics ?? [],
      }));
  } catch {
    return [];
  }
}
