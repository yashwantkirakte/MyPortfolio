export type LeetCodeStats = {
  username: string;
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  calendar: Record<string, number>;
  recentAccepted: {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }[];
  error?: string;
};

type LeetCodeCalendar = {
  streak: number;
  totalActiveDays: number;
  submissionCalendar: string;
};

type LeetCodeResponse = {
  data?: {
    matchedUser?: {
      userCalendar?: LeetCodeCalendar;
      submitStats?: {
        acSubmissionNum?: {
          difficulty: "All" | "Easy" | "Medium" | "Hard";
          count: number;
        }[];
      };
    };
    recentAcSubmissionList?: LeetCodeStats["recentAccepted"];
  };
  errors?: unknown[];
};

type SolvedCount = {
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  count: number;
};

type AlfaLeetCodeProfile = {
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  submissionCalendar?: Record<string, number>;
  recentSubmissions?: {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay?: string;
  }[];
};

const userStatsQuery = `
  query portfolioLeetCode($username: String!, $limit: Int!) {
    matchedUser(username: $username) {
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

function parseCalendar(calendar?: string) {
  if (!calendar) {
    return {};
  }

  try {
    return JSON.parse(calendar) as Record<string, number>;
  } catch {
    return {};
  }
}

function getBestStreak(calendar: Record<string, number>) {
  const activeDays = Object.keys(calendar)
    .map((timestamp) => {
      const date = new Date(Number(timestamp) * 1000);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => a - b);

  let best = 0;
  let current = 0;
  let previous = 0;
  const day = 24 * 60 * 60 * 1000;

  for (const value of activeDays) {
    if (previous && value === previous + day) {
      current += 1;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
    previous = value;
  }

  return best;
}

function getCurrentStreak(calendar: Record<string, number>) {
  const days = Object.keys(calendar)
    .map((timestamp) => {
      const date = new Date(Number(timestamp) * 1000);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => b - a);

  if (days.length === 0) {
    return 0;
  }

  let current = 1;
  let previous = days[0];
  const day = 24 * 60 * 60 * 1000;

  for (const value of days.slice(1)) {
    if (value === previous - day) {
      current += 1;
      previous = value;
    } else if (value !== previous) {
      break;
    }
  }

  return current;
}

function countFor(stats: SolvedCount[] | undefined, difficulty: SolvedCount["difficulty"]) {
  if (!Array.isArray(stats)) {
    return 0;
  }

  return stats.find((item) => item.difficulty === difficulty)?.count ?? 0;
}

async function getLeetCodeStatsFromAlfa(
  username: string,
): Promise<LeetCodeStats> {
  const response = await fetch(
    `https://alfa-leetcode-api.onrender.com/${username}/profile`,
    {
      next: { revalidate: 60 * 60 },
    },
  );

  if (!response.ok) {
    throw new Error(`LeetCode fallback responded with ${response.status}`);
  }

  const data = (await response.json()) as AlfaLeetCodeProfile;
  const calendar = data.submissionCalendar ?? {};
  const recentAccepted =
    data.recentSubmissions
      ?.filter((submission) => submission.statusDisplay === "Accepted")
      .slice(0, 5)
      .map((submission) => ({
        id: `${submission.titleSlug}-${submission.timestamp}`,
        title: submission.title,
        titleSlug: submission.titleSlug,
        timestamp: submission.timestamp,
      })) ?? [];

  return {
    username,
    currentStreak: getCurrentStreak(calendar),
    bestStreak: getBestStreak(calendar),
    totalActiveDays: Object.keys(calendar).length,
    totalSolved: data.totalSolved ?? 0,
    easySolved: data.easySolved ?? 0,
    mediumSolved: data.mediumSolved ?? 0,
    hardSolved: data.hardSolved ?? 0,
    calendar,
    recentAccepted,
  };
}

export async function getLeetCodeStats(
  username: string,
): Promise<LeetCodeStats> {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: userStatsQuery,
        variables: { username, limit: 5 },
      }),
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`LeetCode responded with ${response.status}`);
    }

    const json = (await response.json()) as LeetCodeResponse;
    const matchedUser = json.data?.matchedUser;

    if (!matchedUser || json.errors) {
      throw new Error("LeetCode profile data was not available");
    }

    const calendar = parseCalendar(
      matchedUser.userCalendar?.submissionCalendar,
    );
    const solved = matchedUser.submitStats?.acSubmissionNum;

    return {
      username,
      currentStreak: matchedUser.userCalendar?.streak ?? 0,
      bestStreak: getBestStreak(calendar),
      totalActiveDays: matchedUser.userCalendar?.totalActiveDays ?? 0,
      totalSolved: countFor(solved, "All"),
      easySolved: countFor(solved, "Easy"),
      mediumSolved: countFor(solved, "Medium"),
      hardSolved: countFor(solved, "Hard"),
      calendar,
      recentAccepted: json.data?.recentAcSubmissionList ?? [],
    };
  } catch (error) {
    try {
      return await getLeetCodeStatsFromAlfa(username);
    } catch (fallbackError) {
      return {
        username,
        currentStreak: 0,
        bestStreak: 0,
        totalActiveDays: 0,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        calendar: {},
        recentAccepted: [],
        error:
          fallbackError instanceof Error
            ? fallbackError.message
            : error instanceof Error
              ? error.message
              : "Unable to load LeetCode stats",
      };
    }
  }
}
