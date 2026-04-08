import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Link, BarChart2, LayoutDashboard, Shield } from "lucide-react";
import { HeroCta } from "@/components/home/hero-cta";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Link className="size-6 text-primary" />,
    title: "Shorten Any URL",
    description:
      "Instantly transform long, unwieldy links into clean, shareable short URLs with a single click.",
  },
  {
    icon: <BarChart2 className="size-6 text-primary" />,
    title: "Track Click Counts",
    description:
      "Monitor how many times each shortened link has been visited so you always know what's working.",
  },
  {
    icon: <LayoutDashboard className="size-6 text-primary" />,
    title: "Manage Your Links",
    description:
      "Access all your shortened links in a personal dashboard. View, copy, and organise them with ease.",
  },
  {
    icon: <Shield className="size-6 text-primary" />,
    title: "Secure & Private",
    description:
      "Your links are tied to your account only. Authenticate securely so your data stays yours.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Shorten links.
            <br />
            <span className="text-muted-foreground">Track what matters.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Create short, memorable links in seconds. Monitor clicks and manage
            all your URLs from one simple dashboard.
          </p>
        </div>
        <HeroCta />
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to manage your links
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border px-6 py-20 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground">
            Sign up for free and start shortening links in seconds.
          </p>
          <HeroCta />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
}
