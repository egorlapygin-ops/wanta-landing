import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { WhyDifferent } from "@/components/sections/WhyDifferent";
import { EmotionalBlock } from "@/components/sections/EmotionalBlock";
import { Waitlist } from "@/components/sections/Waitlist";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <UseCases />
      <WhyDifferent />
      <EmotionalBlock />
      <Waitlist />
      <FAQ />
    </>
  );
}
