import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import {
  CURRENT_USER_ID,
  INTEREST_OPTIONS,
  OPEN_TO_OPTIONS,
  type ProfileIntent,
  type ProfileInterest,
  store,
  useStore,
} from "@/lib/mock";

const fieldClass = "w-full bg-card border border-input rounded-xl px-4 h-11 outline-none focus:ring-2 focus:ring-ring";

export const Route = createFileRoute("/profile/edit")({ component: EditProfile });

function EditProfile() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [gender, setGender] = useState(profile.gender ?? "");
  const [hometown, setHometown] = useState(profile.hometown ?? "");
  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState<ProfileInterest[]>(profile.interests);
  const [openTo, setOpenTo] = useState<ProfileIntent[]>(profile.openTo);
  const [photos, setPhotos] = useState(profile.photos.map((p) => ({ ...p })));
  const [clearFacePhotoId, setClearFacePhotoId] = useState(profile.clearFacePhotoId);
  const [error, setError] = useState<string | null>(null);

  const nonEmptyPhotos = useMemo(
    () => photos.map((p) => ({ ...p, url: p.url.trim() })).filter((p) => p.url.length > 0),
    [photos],
  );

  function toggleInterest(interest: ProfileInterest) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((x) => x !== interest) : current.length < 5 ? [...current, interest] : current,
    );
  }

  function toggleIntent(intent: ProfileIntent) {
    setOpenTo((current) =>
      current.includes(intent) ? current.filter((x) => x !== intent) : current.length < 3 ? [...current, intent] : current,
    );
  }

  function addPhotoField() {
    if (photos.length >= 10) return;
    setPhotos((current) => [...current, { id: crypto.randomUUID(), url: "", soloFace: false, layout: "portrait" }]);
  }

  function save() {
    if (nonEmptyPhotos.length < 1 || nonEmptyPhotos.length > 10) {
      setError("Add between 1 and 10 profile photos.");
      return;
    }
    if (interests.length < 2 || interests.length > 5) {
      setError("Pick 2 to 5 interests.");
      return;
    }
    if (openTo.length < 1) {
      setError("Pick at least one Open to option.");
      return;
    }
    const clearFace = nonEmptyPhotos.find((p) => p.id === clearFacePhotoId);
    if (!clearFace || !clearFace.soloFace) {
      setError("Mark one clear solo face photo before saving.");
      return;
    }

    const updatedProfile = {
      ...profile,
      id: CURRENT_USER_ID,
      name: name.trim() || "You",
      age: Math.max(18, Number(age) || profile.age),
      gender: gender.trim(),
      hometown: hometown.trim(),
      bio: bio.trim(),
      interests,
      openTo,
      photos: nonEmptyPhotos,
      clearFacePhotoId,
      avatarUrl: clearFace.url,
    };
    store.set({ profile: updatedProfile });
    setError(null);
    navigate({ to: "/profile/$id", params: { id: CURRENT_USER_ID } });
  }

  return (
    <div className="min-h-dvh pb-8">
      <TopBar back title="Edit profile" />
      <main className="px-4 pt-4 space-y-4">
        <section className="bg-card border border-border rounded-3xl p-4 space-y-3">
          <h2 className="font-semibold">Basics</h2>
          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input className={fieldClass} value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" placeholder="Age" />
          <input className={fieldClass} value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" />
          <input className={fieldClass} value={hometown} onChange={(e) => setHometown(e.target.value)} placeholder="Hometown" />
          <textarea
            className="w-full bg-card border border-input rounded-xl px-4 py-3 min-h-24 outline-none focus:ring-2 focus:ring-ring resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={240}
            placeholder="Short bio"
          />
        </section>

        <section className="bg-card border border-border rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Photos</h2>
            <button type="button" onClick={addPhotoField} className="text-sm font-semibold text-primary disabled:opacity-50" disabled={photos.length >= 10}>
              Add photo
            </button>
          </div>
          {photos.map((photo, idx) => (
            <div key={photo.id} className="border border-border rounded-2xl p-3 space-y-2">
              <input
                className={fieldClass}
                value={photo.url}
                onChange={(e) =>
                  setPhotos((current) => current.map((x) => (x.id === photo.id ? { ...x, url: e.target.value } : x)))
                }
                placeholder={`Photo URL ${idx + 1}`}
              />
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={photo.soloFace}
                    onChange={(e) =>
                      setPhotos((current) => current.map((x) => (x.id === photo.id ? { ...x, soloFace: e.target.checked } : x)))
                    }
                  />
                  Solo face visible
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="clear-face" checked={clearFacePhotoId === photo.id} onChange={() => setClearFacePhotoId(photo.id)} />
                  Required clear-face photo
                </label>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Use 1-10 photos. One must be a clear solo face photo.</p>
        </section>

        <section className="bg-card border border-border rounded-3xl p-4 space-y-3">
          <h2 className="font-semibold">Interests (2-5)</h2>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-card border border-border rounded-3xl p-4 space-y-3">
          <h2 className="font-semibold">Open to</h2>
          <div className="flex flex-wrap gap-2">
            {OPEN_TO_OPTIONS.map((intent) => {
              const selected = openTo.includes(intent);
              return (
                <button
                  type="button"
                  key={intent}
                  onClick={() => toggleIntent(intent)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                >
                  {intent}
                </button>
              );
            })}
          </div>
        </section>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => navigate({ to: "/profile/$id", params: { id: CURRENT_USER_ID } })} className="h-12 rounded-xl border border-border font-semibold">
            Cancel
          </button>
          <button type="button" onClick={save} className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-bubble">
            Save profile
          </button>
        </div>
      </main>
    </div>
  );
}
