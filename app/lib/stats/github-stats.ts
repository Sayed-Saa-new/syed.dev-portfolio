"use server";

import { unstable_cache } from "next/cache";
import type { GitHubStats, ContributionData } from "./types";

const GITHUB_USERNAME = "abushaidislam";

async function fetchContributions(token: string): Promise<{ data: ContributionData | null; totalCommits: number }> {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return { data: null, totalCommits: 0 };

    const json = await response.json();
    const collection = json?.data?.user?.contributionsCollection;
    const calendar = collection?.contributionCalendar;
    if (!calendar) return { data: null, totalCommits: 0 };

    return {
      data: {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks,
      },
      totalCommits: collection.totalCommitContributions || 0,
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return { data: null, totalCommits: 0 };
  }
}

async function fetchUserRepoTotals(headers: HeadersInit): Promise<{ stars: number; forks: number }> {
  let stars = 0;
  let forks = 0;
  let page = 1;
  try {
    while (page < 10) {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&type=owner`,
        { headers }
      );
      if (!res.ok) break;
      const repos = await res.json();
      if (!Array.isArray(repos) || repos.length === 0) break;
      for (const r of repos) {
        if (r.fork) continue;
        stars += r.stargazers_count || 0;
        forks += r.forks_count || 0;
      }
      if (repos.length < 100) break;
      page++;
    }
  } catch (e) {
    console.error("Error fetching user repos:", e);
  }
  return { stars, forks };
}

export const getGitHubStats = unstable_cache(
  async (): Promise<GitHubStats> => {
    const token =
      process.env.GITHUB_FINE_GRAINED_PERSONAL_ACCESS_TOKEN ||
      process.env.GITHUB_TOKEN;

    const empty: GitHubStats = { stars: 0, forks: 0, commits: 0, contributions: null };

    if (!token) {
      console.warn("GITHUB_TOKEN not set, returning zeros");
      return empty;
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };

    try {
      const [{ stars, forks }, contrib] = await Promise.all([
        fetchUserRepoTotals(headers),
        fetchContributions(token),
      ]);

      return {
        stars,
        forks,
        commits: contrib.totalCommits,
        contributions: contrib.data,
      };
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      return empty;
    }
  },
  ["github-stats-syed"],
  { revalidate: 86400 }
);
