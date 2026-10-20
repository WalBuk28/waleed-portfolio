// GSAP and its plugins, registered once. Import gsap from here, never from "gsap" directly,
// so every module shares the one ticker with ScrollTrigger, SplitText and useGSAP registered.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
