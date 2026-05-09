# PROJECT BRIEF: Motif

## One-line vision
Motif helps people skip endless chatting by matching on real, public date ideas pinned to a map.

## Problem we solve
Most dating apps optimize for swiping and text-first conversations, which often leads to low-effort chats and unclear intentions. People want to quickly find someone who is interested in doing the same thing, in the same place, at the same time.

## Product concept
Users post concrete date ideas ("bubbles") at real public venues. Others browse the map, open a date idea, and express interest in doing that plan. The poster then chooses when to start a chat from interested responses. Motif stays plan-first, not rejection-first.

## Target user
- Adults who prefer plan-first dating over endless text
- People who value low-pressure, real-world meetups
- Users in a local city area (current prototype: Kingston, ON)

## Core experience (MVP)
1. View map with date bubbles at real venues
2. Open bubble preview and full date details
3. Send/receive plan interest responses
4. Start chat from the response queue
5. Create and publish a new date idea at a public venue

## Interest flow model (product rule)
- Step 1: Viewer taps "I'd do this" to send interest.
- Step 2: Poster sees "X people interested" and reviews responses.
- Step 3: Poster taps "Start chat" for someone to open conversation.
- Other responses end quietly via "Not now", plan closure, or expiry.
- Do not send person-level rejection notifications.

## Product principles
- Plan-first, not chat-first
- Public-venue safety by default
- Minimal friction, mobile-first UI
- Warm, playful tone without being gimmicky
- Clear user intent at every step

## Scope boundaries
### In scope now
- Local prototype flows using mock/local state
- Single-city venue experience
- Core map -> match -> chat loop

### Out of scope for now
- Complex recommendation algorithms
- Social feed mechanics
- Video calls, stories, or gamification layers
- Heavy profile customization

## Safety and trust constraints
- Public venues only (no private home meetups)
- Safety/report access is always reachable
- Keep personal data exposure minimal in UI

## UX guardrails for future changes
- Do not replace map-first browsing with swipe-first browsing
- Do not require chat before a concrete date idea exists
- Do not hide venue context (where/when/vibe/budget)
- Keep the primary CTA focused on meaningful intent (interest, start chat)

## Success signals (early)
- % of users who open a date detail after landing on map
- % of sent requests that receive a response
- Time from first app open to first meaningful action (post/request/accept)
- % of opened chats that send at least one message

## Current implementation note
This repo is currently a prototype with local/mock state. Keep product decisions aligned with this brief unless explicitly changed by the project owner.
