import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { CURRENT_USER_ID, getPerson } from "@/lib/mock";

export const Route = createFileRoute("/profile/$id")({ component: ProfileDetails });

function ProfileDetails() {
  const { id } = Route.useParams();
  const profile = getPerson(id);
  const isMe = id === CURRENT_USER_ID;

  return (
    <div className="min-h-dvh pb-8">
      <TopBar back title={isMe ? "Your profile" : profile.name} />
      <main className="px-4 pt-4 space-y-4">
        <section className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-1">
          {profile.photos.map((photo) => (
            <div key={photo.id} className="relative shrink-0 w-[84%] max-w-sm snap-center rounded-3xl overflow-hidden shadow-card bg-card">
              <img src={photo.url} alt={`${profile.name} photo`} className="w-full aspect-[4/5] object-cover" />
              {photo.id === profile.clearFacePhotoId && (
                <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-card/85 backdrop-blur">
                  Clear face photo
                </span>
              )}
            </div>
          ))}
        </section>

        <section className="bg-card rounded-3xl border border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold leading-tight">
                {profile.name}, {profile.age}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {[profile.gender, profile.hometown].filter(Boolean).join(" · ")}
              </p>
            </div>
            {isMe && (
              <Link to="/profile/edit" className="h-10 px-4 rounded-xl border border-border text-sm font-semibold grid place-items-center">
                Edit
              </Link>
            )}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed">{profile.bio}</p>
        </section>

        <section className="bg-card rounded-3xl border border-border p-5">
          <h2 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Interests</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 rounded-full bg-accent text-sm">
                {interest}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-3xl border border-border p-5">
          <h2 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Open to</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.openTo.map((intent) => (
              <span key={intent} className="px-3 py-1.5 rounded-full bg-coral-soft text-sm">
                {intent}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
