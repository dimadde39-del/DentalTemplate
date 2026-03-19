import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";

const BeforeAfterSlider = dynamic(
  () => import("@/components/BeforeAfterSlider").then(mod => mod.BeforeAfterSlider),
  { loading: () => <div className="w-full max-w-4xl mx-auto my-12 aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl" /> }
);
const Testimonials = dynamic(
  () => import("@/components/Testimonials").then(mod => mod.Testimonials),
  { loading: () => <div className="w-full h-96 bg-zinc-50 dark:bg-zinc-950 animate-pulse" /> }
);

export default async function Home() {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);

  return (
    <main className="min-h-screen">
      <Hero config={config} />
      <Services config={config} />
      <BeforeAfterSlider 
        beforeSrc="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
        afterSrc="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
        config={config}
      />
      <Testimonials />
    </main>
  );
}
