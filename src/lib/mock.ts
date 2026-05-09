// Prototype mock data + tiny localStorage-backed store.
// Replace with Lovable Cloud later.

export type Person = {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string; // emoji avatar for prototype
  avatarUrl?: string;
  pronouns?: string;
  gender?: string;
  hometown?: string;
  interests: ProfileInterest[];
  openTo: ProfileIntent[];
  photos: ProfilePhoto[];
  clearFacePhotoId: string;
};

export type ProfilePhoto = {
  id: string;
  url: string;
  soloFace: boolean;
  layout: "portrait" | "square" | "landscape";
};

export const INTEREST_OPTIONS = [
  "Coffee",
  "Foodie spots",
  "Live music",
  "Art galleries",
  "Hiking",
  "Bookstores",
  "Cooking",
  "Fitness",
  "Museums",
  "Farmers markets",
  "Photography",
  "Cycling",
  "Climbing",
  "Board games",
  "Film nights",
  "Dog walks",
  "Kayaking",
  "Trivia",
  "Wine bars",
  "Brunch",
  "Travel",
] as const;
export type ProfileInterest = (typeof INTEREST_OPTIONS)[number];

export const OPEN_TO_OPTIONS = [
  "New friends",
  "Casual dates",
  "Intentional dating",
  "Activity partner",
  "Long-term relationship",
] as const;
export type ProfileIntent = (typeof OPEN_TO_OPTIONS)[number];

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

export type MatchStatus = "interested" | "chat_opened" | "closed";
export type MatchRequest = {
  id: string;
  dateId: string;
  fromUserId: string; // current user
  toUserId: string; // post author
  status: MatchStatus;
  note?: string;
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
  me: {
    id: "me",
    name: "Taylor Swift",
    age: 35,
    bio: "Songwriter mode, coffee mode, and sunset walks.",
    avatar: "🌿",
    avatarUrl: "https://loremflickr.com/600/800/taylor,swift,portrait?lock=101",
    gender: "Woman",
    hometown: "Nashville, TN",
    interests: ["Live music", "Coffee", "Travel"],
    openTo: ["Intentional dating", "Activity partner"],
    photos: buildCelebrityPhotos("me", "taylor-swift"),
    clearFacePhotoId: "me-p1",
  },
  u1: {
    id: "u1",
    name: "Zendaya",
    age: 28,
    bio: "Film sets, fashion nights, and low-key brunch plans.",
    avatar: "🌸",
    avatarUrl: "https://loremflickr.com/600/800/zendaya,portrait?lock=111",
    pronouns: "she/her",
    gender: "Woman",
    hometown: "Oakland, CA",
    interests: ["Film nights", "Art galleries", "Brunch"],
    openTo: ["Intentional dating"],
    photos: buildCelebrityPhotos("u1", "zendaya"),
    clearFacePhotoId: "u1-p1",
  },
  u2: {
    id: "u2",
    name: "Timothee Chalamet",
    age: 29,
    bio: "Cinema nerd with a soft spot for espresso bars.",
    avatar: "☕",
    avatarUrl: "https://loremflickr.com/600/800/timothee,chalamet,portrait?lock=121",
    pronouns: "they/them",
    gender: "Man",
    hometown: "New York, NY",
    interests: ["Live music", "Coffee", "Film nights"],
    openTo: ["Casual dates", "Intentional dating"],
    photos: buildCelebrityPhotos("u2", "timothee-chalamet"),
    clearFacePhotoId: "u2-p1",
  },
  u3: {
    id: "u3",
    name: "Margot Robbie",
    age: 34,
    bio: "Beach mornings, movie nights, and spontaneous day plans.",
    avatar: "📚",
    avatarUrl: "https://loremflickr.com/600/800/margot,robbie,portrait?lock=131",
    pronouns: "she/her",
    gender: "Woman",
    hometown: "Gold Coast, AU",
    interests: ["Travel", "Film nights", "Brunch"],
    openTo: ["Intentional dating", "Long-term relationship"],
    photos: buildCelebrityPhotos("u3", "margot-robbie"),
    clearFacePhotoId: "u3-p1",
  },
  u4: {
    id: "u4",
    name: "Michael B Jordan",
    age: 38,
    bio: "Training days, ramen nights, and city walks.",
    avatar: "🧗‍♀️",
    avatarUrl: "https://loremflickr.com/600/800/michael,b,jordan,portrait?lock=141",
    pronouns: "he/him",
    gender: "Man",
    hometown: "Santa Ana, CA",
    interests: ["Fitness", "Foodie spots", "Travel"],
    openTo: ["Activity partner", "Casual dates"],
    photos: buildCelebrityPhotos("u4", "michael-b-jordan"),
    clearFacePhotoId: "u4-p1",
  },
  u5: {
    id: "u5",
    name: "Rihanna",
    age: 37,
    bio: "Style-forward, music-first, always down for a rooftop drink.",
    avatar: "🎧",
    avatarUrl: "https://loremflickr.com/600/800/rihanna,portrait?lock=151",
    pronouns: "she/her",
    gender: "Woman",
    hometown: "Bridgetown, BB",
    interests: ["Live music", "Wine bars", "Photography"],
    openTo: ["Intentional dating"],
    photos: buildCelebrityPhotos("u5", "rihanna"),
    clearFacePhotoId: "u5-p1",
  },
  u6: {
    id: "u6",
    name: "Ryan Gosling",
    age: 44,
    bio: "Late-night diners, movie soundtracks, and long drives.",
    avatar: "🌮",
    avatarUrl: "https://loremflickr.com/600/800/ryan,gosling,portrait?lock=161",
    pronouns: "he/him",
    gender: "Man",
    hometown: "London, ON",
    interests: ["Film nights", "Coffee", "Travel"],
    openTo: ["New friends", "Activity partner"],
    photos: buildCelebrityPhotos("u6", "ryan-gosling"),
    clearFacePhotoId: "u6-p1",
  },
  u7: {
    id: "u7",
    name: "Dua Lipa",
    age: 29,
    bio: "Tour energy, dancing, and coffee after midnight.",
    avatar: "🚲",
    avatarUrl: "https://loremflickr.com/600/800/dua,lipa,portrait?lock=171",
    pronouns: "she/her",
    gender: "Woman",
    hometown: "London, UK",
    interests: ["Live music", "Travel", "Fitness"],
    openTo: ["Activity partner", "Intentional dating"],
    photos: buildCelebrityPhotos("u7", "dua-lipa"),
    clearFacePhotoId: "u7-p1",
  },
  u8: {
    id: "u8",
    name: "Keanu Reeves",
    age: 60,
    bio: "Motorcycles, quiet coffee spots, and kind conversation.",
    avatar: "📸",
    avatarUrl: "https://loremflickr.com/600/800/keanu,reeves,portrait?lock=181",
    pronouns: "he/him",
    gender: "Man",
    hometown: "Beirut, LB",
    interests: ["Travel", "Coffee", "Film nights"],
    openTo: ["Intentional dating", "Long-term relationship"],
    photos: buildCelebrityPhotos("u8", "keanu-reeves"),
    clearFacePhotoId: "u8-p1",
  },
  u9: {
    id: "u9",
    name: "Emma Stone",
    age: 36,
    bio: "Bookstores, comedy nights, and spontaneous weekend trips.",
    avatar: "🍜",
    avatarUrl: "https://loremflickr.com/600/800/emma,stone,portrait?lock=191",
    pronouns: "she/her",
    gender: "Woman",
    hometown: "Scottsdale, AZ",
    interests: ["Film nights", "Bookstores", "Brunch"],
    openTo: ["Casual dates", "New friends"],
    photos: buildCelebrityPhotos("u9", "emma-stone"),
    clearFacePhotoId: "u9-p1",
  },
};

function buildCelebrityPhotos(personId: string, celebrityQuery: string): ProfilePhoto[] {
  const layouts: Array<ProfilePhoto["layout"]> = [
    "portrait",
    "square",
    "landscape",
    "portrait",
    "square",
    "portrait",
    "landscape",
    "square",
    "portrait",
    "landscape",
  ];
  const dimensionsByLayout: Record<ProfilePhoto["layout"], { w: number; h: number }> = {
    portrait: { w: 900, h: 1200 },
    square: { w: 1100, h: 1100 },
    landscape: { w: 1400, h: 1000 },
  };
  const queryTokensByLayout: Record<ProfilePhoto["layout"], string> = {
    portrait: `${celebrityQuery},portrait,solo`,
    square: `${celebrityQuery},group,event`,
    landscape: `${celebrityQuery},redcarpet,crowd`,
  };
  return Array.from({ length: 10 }, (_, idx) => {
    const id = `${personId}-p${idx + 1}`;
    const layout = layouts[idx];
    const dims = dimensionsByLayout[layout];
    const url = `https://loremflickr.com/${dims.w}/${dims.h}/${queryTokensByLayout[layout]}?lock=${personId.length}${idx + 1}`;
    if (idx === 0) {
      return {
        id,
        url,
        soloFace: true,
        layout,
      };
    }
    return {
      id,
      url,
      soloFace: false,
      layout,
    };
  });
}

// Real Kingston, Ontario venues — coordinates from OpenStreetMap.
export const INITIAL_DATES: DatePost[] = [
  {
    id: "d1", authorId: "u1", title: "Slow pour-over + people watching",
    venueName: "Sipps Coffee", neighborhood: "Downtown", category: "Coffee",
    vibe: "Quiet, unhurried", when: "Sat morning", budget: "$",
    description: "Order something single origin, sit by the window, see what happens.",
    address: "11 Princess St, Kingston",
    lat: 44.2312169, lng: -76.4789965,
  },
  {
    id: "d2", authorId: "u2", title: "Live jazz + a Manhattan",
    venueName: "Musiikki Cafe", neighborhood: "Downtown", category: "Drinks",
    vibe: "Buzzy, romantic", when: "Fri 8pm", budget: "$$",
    description: "Two cocktails, low light, see who plays the upstairs room.",
    address: "73 Brock St, Kingston",
    lat: 44.230725, lng: -76.482222,
  },
  {
    id: "d3", authorId: "u3", title: "Used bookshop crawl",
    venueName: "Novel Idea Bookstore", neighborhood: "Princess St", category: "Culture",
    vibe: "Curious, low-key", when: "Sun afternoon", budget: "$",
    description: "We each pick a book for the other. Coffee after to debate.",
    address: "156 Princess St, Kingston",
    lat: 44.2317452, lng: -76.48441,
  },
  {
    id: "d4", authorId: "u4", title: "Bouldering for beginners",
    venueName: "Boiler Room Climbing Gym", neighborhood: "Williamsville", category: "Active",
    vibe: "Playful, sweaty", when: "Weekday eve", budget: "$$",
    description: "I'll teach the basics. Snacks at the Tea Store after.",
    address: "993 Princess St, Kingston",
    lat: 44.2441537, lng: -76.5141917,
  },
  {
    id: "d5", authorId: "u5", title: "Patio pints by the water",
    venueName: "The Toucan", neighborhood: "Market Square", category: "Drinks",
    vibe: "Easy, golden hour", when: "Thu 7pm", budget: "$$",
    description: "Tucked-away patio, a couple pints, no pressure.",
    address: "76 Princess St, Kingston",
    lat: 44.2312823, lng: -76.481633,
  },
  {
    id: "d6", authorId: "u6", title: "Sunset walk along the lake",
    venueName: "Breakwater Park", neighborhood: "Lake Ontario", category: "Outdoors",
    vibe: "Golden hour glow", when: "Any sunny eve", budget: "$",
    description: "Loop the path, watch the lake change colour, ice cream after.",
    address: "King St W, Kingston",
    lat: 44.2216876, lng: -76.5017423,
  },
  {
    id: "d7", authorId: "u7", title: "Market coffee + riverside stroll",
    venueName: "Kingston Public Market", neighborhood: "Market Square", category: "Coffee",
    vibe: "Light, social", when: "Sat 10am", budget: "$",
    description: "Grab coffee and pastries, then wander toward Confederation Basin.",
    address: "216 Ontario St, Kingston",
    lat: 44.230303, lng: -76.480169,
  },
  {
    id: "d8", authorId: "u8", title: "Golden-hour picnic setup",
    venueName: "City Park", neighborhood: "Sydenham", category: "Outdoors",
    vibe: "Soft, playful", when: "Weeknight 6:30pm", budget: "$$",
    description: "Blanket, fruit, and low-key conversation by the trees.",
    address: "Bagot St & Barrie St, Kingston",
    lat: 44.224765, lng: -76.493108,
  },
  {
    id: "d9", authorId: "u9", title: "Ramen + arcade rematch",
    venueName: "Sapporo Sushi", neighborhood: "Downtown", category: "Food",
    vibe: "Goofy, high-energy", when: "Fri 7pm", budget: "$$",
    description: "Comfort food first, then a winner-takes-dessert rematch nearby.",
    address: "277 Princess St, Kingston",
    lat: 44.232878, lng: -76.488239,
  },
  {
    id: "d10", authorId: "me", title: "Waterfront boardwalk and gelato",
    venueName: "Confederation Park", neighborhood: "Downtown Waterfront", category: "Outdoors",
    vibe: "Easygoing, scenic", when: "Sun 5pm", budget: "$",
    description: "Boardwalk loop, then gelato if the vibe is right.",
    address: "Ontario St, Kingston",
    lat: 44.229684, lng: -76.480975,
  },
];

const SHOULD_SEED_DATES =
  import.meta.env.DEV || import.meta.env.VITE_SEED_MOCK_DATES === "true";
const SEEDED_DATES_VERSION = 3;

const INITIAL_MATCHES: MatchRequest[] = [
  // One sent interest
  {
    id: "m-sent-1",
    dateId: "d2",
    fromUserId: CURRENT_USER_ID,
    toUserId: "u2",
    status: "interested",
    note: "Musiikki sounds perfect for Friday.",
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  // One received interest
  {
    id: "m-received-1",
    dateId: "d10",
    fromUserId: "u8",
    toUserId: CURRENT_USER_ID,
    status: "interested",
    note: "This waterfront plan is exactly my pace.",
    createdAt: Date.now() - 1000 * 60 * 40,
  },
  // Open chats to power chat list
  {
    id: "m-accepted-1",
    dateId: "d1",
    fromUserId: CURRENT_USER_ID,
    toUserId: "u1",
    status: "chat_opened",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "m-accepted-2",
    dateId: "d6",
    fromUserId: "u6",
    toUserId: CURRENT_USER_ID,
    status: "chat_opened",
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: "m-accepted-3",
    dateId: "d7",
    fromUserId: CURRENT_USER_ID,
    toUserId: "u7",
    status: "chat_opened",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "msg-1", matchId: "m-accepted-1", fromUserId: "u1", text: "Still good for Sipps tomorrow?", at: Date.now() - 1000 * 60 * 80 },
  { id: "msg-2", matchId: "m-accepted-1", fromUserId: CURRENT_USER_ID, text: "Yes, 10:30 works for me.", at: Date.now() - 1000 * 60 * 75 },
  { id: "msg-3", matchId: "m-accepted-2", fromUserId: CURRENT_USER_ID, text: "Sunset walk + ice cream still the plan?", at: Date.now() - 1000 * 60 * 140 },
  { id: "msg-4", matchId: "m-accepted-2", fromUserId: "u6", text: "Absolutely. Meet at the entrance at 7?", at: Date.now() - 1000 * 60 * 135 },
  { id: "msg-5", matchId: "m-accepted-3", fromUserId: "u7", text: "Public market espresso challenge?", at: Date.now() - 1000 * 60 * 20 },
];

const KEY = "plotted_state_v2";
type State = {
  dates: DatePost[];
  matches: MatchRequest[];
  messages: ChatMessage[];
  profile: Person;
  signedIn: boolean;
  pendingLimit: number;
  seededDatesVersion?: number;
};

const DEFAULT_STATE: State = {
  dates: SHOULD_SEED_DATES ? INITIAL_DATES : [],
  matches: SHOULD_SEED_DATES ? INITIAL_MATCHES : [],
  messages: SHOULD_SEED_DATES ? INITIAL_MESSAGES : [],
  profile: PEOPLE.me,
  signedIn: false,
  pendingLimit: 5,
  seededDatesVersion: SHOULD_SEED_DATES ? SEEDED_DATES_VERSION : undefined,
};

function read(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (SHOULD_SEED_DATES && parsed.seededDatesVersion !== SEEDED_DATES_VERSION) {
      return DEFAULT_STATE;
    }
    const merged = { ...DEFAULT_STATE, ...parsed };
    const profile = { ...PEOPLE.me, ...merged.profile };
    return {
      ...merged,
      profile: {
        ...profile,
        interests: profile.interests?.length ? profile.interests : PEOPLE.me.interests,
        openTo: profile.openTo?.length ? profile.openTo : PEOPLE.me.openTo,
        photos: (profile.photos?.length ? profile.photos : PEOPLE.me.photos).map((photo, idx) => ({
          ...photo,
          layout: photo.layout ?? (idx % 3 === 1 ? "square" : idx % 3 === 2 ? "landscape" : "portrait"),
        })),
        clearFacePhotoId: profile.clearFacePhotoId || PEOPLE.me.clearFacePhotoId,
      },
    };
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
  if (id === CURRENT_USER_ID) return read().profile;
  return (
    PEOPLE[id] ?? {
      id,
      name: "Someone",
      age: 0,
      bio: "",
      avatar: "🙂",
      interests: ["Coffee", "Travel"],
      openTo: ["New friends"],
      photos: [{ id: `${id}-p1`, url: "https://i.pravatar.cc/600?img=1", soloFace: true, layout: "portrait" }],
      clearFacePhotoId: `${id}-p1`,
    }
  );
}

import { useEffect, useRef, useState } from "react";
export function useStore<T>(selector: (s: State) => T): T {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const [value, setValue] = useState(() => selector(read()));

  useEffect(() => {
    const updateSelected = () => {
      const next = selectorRef.current(read());
      setValue((current) => (Object.is(current, next) ? current : next));
    };

    updateSelected();
    return store.subscribe(updateSelected);
  }, []);

  return value;
}
