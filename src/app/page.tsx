import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import dynamic from "next/dynamic";

const BeforeAfterSlider = dynamic(() => import("@/components/BeforeAfterSlider").then(mod => mod.BeforeAfterSlider), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <BeforeAfterSlider 
        beforeSrc="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
        afterSrc="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
      />
      <Testimonials />
    </main>
  );
}
