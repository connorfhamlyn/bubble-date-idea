// Prototype mock data + tiny localStorage-backed store.
// Replace with Lovable Cloud later.

export type Person = {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string; // emoji avatar for prototype
  pronouns?: string;
};

export type DatePost = {
  id: string;
  authorId: string;
  title: string;
  venueName: string;
  neighborhood: string;
  category: "Coffee" | "Drinks" | "Food" | "Outdoors" | "Culture" | "Active";
  vibe: string;
  when: string; // freeform: "Sat afternoon"
  budget: "$" | "$$" | "$$$";
  description: string;
  // Position on the stylized map (percentages)
  x: number;
  y: number;
};

export type MatchStatus = "pending" | "accepted" | "declined" | "suggested";
export type MatchRequest = {
  id: string;
  dateId: string;
  fromUserId: string; // current user
  toUserId: string; // post author
  status: MatchStatus;
  note?: string;
  suggestion?: string;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  matchId: string;
  fromUserId: string;
  text: string;
  at: number;
};

export const CURRENT_USER_ID = "me";

export const PEOPLE: Record<string, Person> = {
  me: { id: "me", name: "You", age: 28, bio: "New here.", avatar: "🌿" },
  u1: { id: "u1", name: "Maya", age: 27, bio: "Plant nerd, slow mornings.", avatar: "🌸", pronouns: "she/her" },
  u2: { id: "u2", name: "Jordan", age: 31, bio: "Always chasing a good espresso.", avatar: "☕", pronouns: "they/them" },
  u3: { id: "u3", name: "Sam", age: 29, bio: "Bookshops > bars.", avatar: "📚", pronouns: "he/him" },
  u4: { id: "u4", name: "Riya", age: 26, bio: "Climbing, ramen, repeat.", avatar: "🧗‍♀️", pronouns: "she/her" },
  u5: { id: "u5", name: "Leo", age: 33, bio: "Vinyl, vermouth, vintage.", avatar: "🎧", pronouns: "he/him" },
  u6: { id: "u6", name: "Ana", age: 30, bio: "Sunsets and street tacos.", avatar: "🌮", pronouns: "she/her" },
};

export const INITIAL_DATES: DatePost[] = [
  {
    id: "d1", authorId: "u1", title: "Slow pour-over + people watching",
    venueName: "Sey Coffee", neighborhood: "Bushwick", category: "Coffee",
    vibe: "Quiet, unhurried", when: "Sat morning", budget: "$",
    description: "Order the Kenyan, sit by the window, see what happens.",
    x: 28, y: 35,
  },
  {
    id: "d2", authorId: "u2", title: "Natural wine + cheese flight",
    venueName: "The Four Horsemen", neighborhood: "Williamsburg", category: "Drinks",
    vibe: "Buzzy, romantic", when: "Fri 8pm", budget: "$$",
    description: "Two glasses, one cheese board. Leave room to wander after.",
    x: 55, y: 22,
  },
  {
    id: "d3", authorId: "u3", title: "Used bookshop crawl",
    venueName: "Unnameable Books", neighborhood: "Prospect Heights", category: "Culture",
    vibe: "Curious, low-key", when: "Sun afternoon", budget: "$",
    description: "We each pick a book for the other. Coffee after to debate.",
    x: 42, y: 62,
  },
  {
    id: "d4", authorId: "u4", title: "Bouldering for beginners",
    venueName: "VITAL Brooklyn", neighborhood: "Gowanus", category: "Active",
    vibe: "Playful, sweaty", when: "Weekday eve", budget: "$$",
    description: "I'll teach the basics. Tacos after, non-negotiable.",
    x: 65, y: 70,
  },
  {
    id: "d5", authorId: "u5", title: "Vinyl listening bar",
    venueName: "Public Records", neighborhood: "Gowanus", category: "Drinks",
    vibe: "Moody, intimate", when: "Thu 9pm", budget: "$$",
    description: "Low light, loud speakers, soft conversation.",
    x: 72, y: 48,
  },
  {
    id: "d6", authorId: "u6", title: "Sunset tacos at the pier",
    venueName: "Tacombi", neighborhood: "DUMBO", category: "Food",
    vibe: "Golden hour glow", when: "Any sunny eve", budget: "$$",
    description: "Walk the bridge after if it's still warm.",
    x: 18, y: 58,
  },
];

const KEY = "plotted_state_v1";
type State = {
  dates: DatePost[];
  matches: MatchRequest[];
  messages: ChatMessage[];
  profile: Person;
  signedIn: boolean;
  pendingLimit: number;
};

const DEFAULT_STATE: State = {
  dates: INITIAL_DATES,
  matches: [],
  messages: [],
  profile: PEOPLE.me,
  signedIn: false,
  pendingLimit: 5,
};

function read(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}
function write(s: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("plotted:update"));
}

export const store = {
  get: read,
  set: (patch: Partial<State>) => write({ ...read(), ...patch }),
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    const handler = () => cb();
    window.addEventListener("plotted:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("plotted:update", handler);
      window.removeEventListener("storage", handler);
    };
  },
  reset: () => write(DEFAULT_STATE),
};

export function getPerson(id: string): Person {
  return PEOPLE[id] ?? { id, name: "Someone", age: 0, bio: "", avatar: "🙂" };
}

import { useEffect, useState } from "react";
export function useStore<T>(selector: (s: State) => T): T {
  const [value, setValue] = useState(() => selector(read()));
  useEffect(() => store.subscribe(() => setValue(selector(read()))), [selector]);
  return value;
}
