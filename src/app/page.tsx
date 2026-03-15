import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";

const BeforeAfterSlider = dynamic(() => import("@/components/BeforeAfterSlider").then(mod => mod.BeforeAfterSlider));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials));

export default async function Home() {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);

  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <BeforeAfterSlider 
        beforeSrc="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
        afterSrc="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
        config={config}
      />
      <Testimonials />
    </main>
  );
}
