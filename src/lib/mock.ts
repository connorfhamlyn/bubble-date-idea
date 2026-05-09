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
  when: string;
  budget: "$" | "$$" | "$$$";
  description: string;
  // Real venue coordinates
  lat: number;
  lng: number;
  address?: string;
};

// Kingston, Ontario center
export const KINGSTON_CENTER: [number, number] = [44.2312, -76.481];

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

// Real Kingston, Ontario venues — coordinates from OpenStreetMap.
export const INITIAL_DATES: DatePost[] = [
  {
    id: "d1", authorId: "u1", title: "Slow pour-over + people watching",
    venueName: "Sipps Coffee", neighborhood: "Downtown", category: "Coffee",
    vibe: "Quiet, unhurried", when: "Sat morning", budget: "$",
    description: "Order something single origin, sit by the window, see what happens.",
    address: "11 Princess St, Kingston",
    lat: 44.2305, lng: -76.4815,
  },
  {
    id: "d2", authorId: "u2", title: "Live jazz + a Manhattan",
    venueName: "Musiikki Cafe", neighborhood: "Downtown", category: "Drinks",
    vibe: "Buzzy, romantic", when: "Fri 8pm", budget: "$$",
    description: "Two cocktails, low light, see who plays the upstairs room.",
    address: "61 Brock St, Kingston",
    lat: 44.2317, lng: -76.4837,
  },
  {
    id: "d3", authorId: "u3", title: "Used bookshop crawl",
    venueName: "Novel Idea Bookstore", neighborhood: "Princess St", category: "Culture",
    vibe: "Curious, low-key", when: "Sun afternoon", budget: "$",
    description: "We each pick a book for the other. Coffee after to debate.",
    address: "156 Princess St, Kingston",
    lat: 44.2329, lng: -76.4854,
  },
  {
    id: "d4", authorId: "u4", title: "Bouldering for beginners",
    venueName: "Boiler Room Climbing Gym", neighborhood: "Inner Harbour", category: "Active",
    vibe: "Playful, sweaty", when: "Weekday eve", budget: "$$",
    description: "I'll teach the basics. Snacks at the Tea Store after.",
    address: "185 Bagot St, Kingston",
    lat: 44.2353, lng: -76.4853,
  },
  {
    id: "d5", authorId: "u5", title: "Patio pints by the water",
    venueName: "The Toucan", neighborhood: "Market Square", category: "Drinks",
    vibe: "Easy, golden hour", when: "Thu 7pm", budget: "$$",
    description: "Tucked-away patio, a couple pints, no pressure.",
    address: "76 Princess St, Kingston",
    lat: 44.2316, lng: -76.4827,
  },
  {
    id: "d6", authorId: "u6", title: "Sunset walk along the lake",
    venueName: "Breakwater Park", neighborhood: "Lake Ontario", category: "Outdoors",
    vibe: "Golden hour glow", when: "Any sunny eve", budget: "$",
    description: "Loop the path, watch the lake change colour, ice cream after.",
    address: "King St W, Kingston",
    lat: 44.2266, lng: -76.4929,
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
