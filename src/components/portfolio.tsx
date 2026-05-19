"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Flame,
  GitBranch,
  GraduationCap,
  Layers3,
  Link,
  Mail,
  MapPin,
  Rocket,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import type { Profile } from "@/data/profile";
import type { GitHubProject } from "@/lib/github";
import type { LeetCodeStats } from "@/lib/leetcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

const navItems = ["Coding", "Projects", "Skills", "About", "Experience", "Contact"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="mx-auto mb-10 max-w-2xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </motion.div>
  );
}

function getHeatmapDays(calendar: Record<string, number>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 98 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (97 - index));
    const timestamp = Math.floor(date.getTime() / 1000).toString();
    const count = calendar[timestamp] ?? 0;

    return {
      date: date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      count,
    };
  });
}

function heatColor(count: number) {
  if (count >= 8) return "bg-cyan-700";
  if (count >= 5) return "bg-cyan-500";
  if (count >= 2) return "bg-cyan-300";
  if (count >= 1) return "bg-cyan-100";
  return "bg-slate-100";
}

function CodingActivity({ leetcode }: { leetcode: LeetCodeStats }) {
  const heatmap = getHeatmapDays(leetcode.calendar);
  const stats = [
    {
      label: "Current streak",
      value: leetcode.currentStreak,
      suffix: "days",
      icon: Flame,
    },
    {
      label: "Best streak",
      value: leetcode.bestStreak,
      suffix: "days",
      icon: Trophy,
    },
    {
      label: "Active days",
      value: leetcode.totalActiveDays,
      suffix: "total",
      icon: CalendarDays,
    },
    {
      label: "Solved",
      value: leetcode.totalSolved,
      suffix: "problems",
      icon: Code2,
    },
  ];

  return (
    <section id="coding" className="border-b border-slate-200 bg-white px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="LeetCode activity"
          title="Consistent practice, tracked through problem solving."
          description={`A live look at @${leetcode.username}'s LeetCode progress, recent accepted submissions, and solving consistency.`}
        />
        {leetcode.error ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6 text-sm text-amber-900">
              LeetCode data could not be loaded right now. The section is ready
              and will populate when the profile API responds.
            </CardContent>
          </Card>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <Card>
                    <CardContent className="flex items-center justify-between gap-5 pt-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {stat.suffix}
                        </p>
                      </div>
                      <div className="grid size-12 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                        <Icon size={23} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consistency panel</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Last 14 weeks of public accepted/submission activity.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
                {heatmap.map((day, index) => (
                  <span
                    key={`${day.date}-${index}`}
                    title={`${day.date}: ${day.count} submissions`}
                    className={`aspect-square rounded-[3px] ${heatColor(day.count)}`}
                  />
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Badge className="justify-center bg-emerald-50 text-emerald-700">
                  Easy: {leetcode.easySolved}
                </Badge>
                <Badge className="justify-center bg-blue-50 text-blue-700">
                  Medium: {leetcode.mediumSolved}
                </Badge>
                <Badge className="justify-center bg-rose-50 text-rose-700">
                  Hard: {leetcode.hardSolved}
                </Badge>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-slate-950">
                  Recent accepted
                </p>
                {leetcode.recentAccepted.length > 0 ? (
                  leetcode.recentAccepted.map((submission) => (
                    <a
                      key={submission.id}
                      href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-slate-950"
                    >
                      <span>{submission.title}</span>
                      <ArrowUpRight size={16} />
                    </a>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    Recent accepted submissions will appear here automatically.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Projects({
  githubUsername,
  projects,
}: {
  githubUsername: string;
  projects: GitHubProject[];
}) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="Featured projects"
        title="Projects that show what I am building."
        description="A curated selection of public work, code experiments, and shipped projects from GitHub."
      />
      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.a
              key={project.name}
              href={project.homepage || project.url}
              target="_blank"
              rel="noreferrer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100">
                <div className="aspect-[16/10] border-b border-slate-200 bg-[radial-gradient(circle_at_30%_20%,#67e8f9,transparent_30%),linear-gradient(135deg,#eff6ff,#ffffff_48%,#ecfeff)] p-5">
                  <div className="flex h-full flex-col justify-between rounded-md border border-white/80 bg-white/70 p-4 backdrop-blur">
                    <Layers3 className="text-cyan-700" size={24} />
                    <span className="text-sm font-semibold text-slate-700">
                      {project.language ?? "Repository"}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    {project.name}
                    <ArrowUpRight
                      className="shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-700"
                      size={20}
                    />
                  </CardTitle>
                  <p className="leading-7 text-slate-600">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(project.topics.length > 0
                      ? project.topics.slice(0, 4)
                      : [project.language ?? "GitHub"]
                    ).map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Star size={15} /> {project.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitBranch size={15} /> {project.forks}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="grid gap-4 pt-6 text-center">
            <Layers3 className="mx-auto text-cyan-700" size={32} />
            <h3 className="font-heading text-2xl font-semibold text-slate-950">
              No featured projects selected yet.
            </h3>
            <p className="mx-auto max-w-2xl leading-7 text-slate-600">
              I am currently preparing my first public project showcases. New
              work will appear here as I publish and refine it.
            </p>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer"
              className="mx-auto"
            >
              <Button variant="outline">
                View GitHub Profile
                <ArrowUpRight size={18} />
              </Button>
            </a>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export function Portfolio({
  leetcode,
  profile,
  projects,
}: {
  leetcode: LeetCodeStats;
  profile: Profile;
  projects: GitHubProject[];
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a
            href="#"
            className="flex items-center gap-2 font-heading text-lg font-semibold"
          >
            <span className="grid size-9 place-items-center rounded-md bg-slate-950 text-sm text-white">
              {profile.initials}
            </span>
            <span>{profile.name}</span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {item}
              </a>
            ))}
          </div>
          <a href="#contact">
            <Button size="sm">Contact</Button>
          </a>
        </nav>
      </header>

      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-6 gap-2 border-blue-200 bg-blue-50 text-blue-800">
              <Sparkles size={14} />
              Open to opportunities
            </Badge>
            <h1 className="max-w-3xl font-heading text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              {profile.tagline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Hi, I am {profile.name}, a developer focused on clean interfaces,
              consistent practice, and project work that can grow into real
              products.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#projects">
                <Button className="w-full sm:w-auto">
                  View Projects
                  <ArrowUpRight size={18} />
                </Button>
              </a>
              <a href="#coding">
                <Button variant="outline" className="w-full sm:w-auto">
                  LeetCode Activity
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
              <a
                className="rounded-md border border-slate-200 bg-white p-2 transition-colors hover:border-cyan-300 hover:text-cyan-700"
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={18} />
              </a>
              <a
                className="rounded-md border border-slate-200 bg-white p-2 transition-colors hover:border-cyan-300 hover:text-cyan-700"
                href={`https://leetcode.com/u/${profile.leetcodeUsername}/`}
                target="_blank"
                rel="noreferrer"
              >
                <Flame size={18} />
              </a>
              <a
                className="rounded-md border border-slate-200 bg-white p-2 transition-colors hover:border-cyan-300 hover:text-cyan-700"
                href={`mailto:${profile.email}`}
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="rounded-lg border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/50"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          >
            <div className="mb-4 flex gap-2">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-4 rounded-md border border-white/10 bg-white/[0.03] p-5 font-mono text-sm text-slate-300">
              <p className="text-cyan-300">const developer = &#123;</p>
              <p className="pl-4">name: &quot;{profile.name}&quot;,</p>
              <p className="pl-4">github: &quot;{profile.githubUsername}&quot;,</p>
              <p className="pl-4">leetcode: &quot;{profile.leetcodeUsername}&quot;,</p>
              <p className="pl-4">
                solved: &quot;{leetcode.totalSolved} problems&quot;,
              </p>
              <p className="pl-4">status: &quot;Ready to build&quot;</p>
              <p className="text-cyan-300">&#125;;</p>
            </div>
          </motion.div>
        </div>
      </section>

      <CodingActivity leetcode={leetcode} />
      <Projects githubUsername={profile.githubUsername} projects={projects} />

      <section id="skills" className="border-y border-slate-200 bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Skills"
            title="Tools and technologies I work with."
            description="A focused stack for building clean interfaces, reliable features, and modern web experiences."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {profile.skills.map((group, index) => (
              <motion.div
                key={group.group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <Code2 className="text-blue-700" size={24} />
                    <CardTitle>{group.group}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Badge key={item} className="bg-slate-50 text-slate-700">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            About
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            A short story section for the person behind the work.
          </h2>
        </div>
        <Card>
          <CardContent className="space-y-5 pt-6 text-base leading-8 text-slate-600">
            <p>{profile.bio}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <MapPin className="mb-3 text-cyan-700" size={20} />
                <p className="font-semibold text-slate-950">Location</p>
                <p className="text-sm">{profile.location}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <Sparkles className="mb-3 text-blue-700" size={20} />
                <p className="font-semibold text-slate-950">Current focus</p>
                <p className="text-sm">{profile.currentFocus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="experience" className="border-y border-slate-200 bg-white px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Experience / Education"
            title="Learning, experience, and milestones."
            description="A simple timeline of education, practice, projects, and professional growth."
          />
          <div className="space-y-4">
            {profile.timeline.map((item, index) => {
              const Icon =
                item.kind === "education"
                  ? GraduationCap
                  : item.kind === "project"
                    ? Rocket
                    : BriefcaseBusiness;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card>
                    <CardContent className="flex gap-4 pt-6">
                      <div className="grid size-11 shrink-0 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                        <Icon size={21} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {item.meta}
                        </p>
                        <p className="mt-3 leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Contact
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            Let&apos;s build something useful.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            Have an opportunity, collaboration, or project idea? Send a message
            and I will get back to you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`}>
              <Button variant="outline">
                <Mail size={18} />
                {profile.email}
              </Button>
            </a>
            <a
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost">
                <Link size={18} />
                GitHub
              </Button>
            </a>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ContactForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
