"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// One post card in three looks: a photo feed, a short-text timeline and a news feed. Same data in,
// different skin out. Like, repost and save really toggle (the counts follow), and they answer with
// a small pop and a ring of dots. Double-click the photo of the photo-feed card to like it.
// Every icon is drawn here as a plain stroke shape, so there are no logos and no icon package.

export type SocialCardVariant = "instagram" | "x" | "facebook";

export type SocialCardAuthor = {
  /** The display name, e.g. "Mira". */
  name: string;
  /** The handle without the @, e.g. "mira.photo". */
  handle: string;
  /** Address of the profile picture. When it is missing, the initials are shown. */
  avatar?: string;
  /** Shows the verified badge. */
  verified?: boolean;
};

export type SocialCardProps = {
  /** Which look to draw: a photo feed, a short-text timeline or a news feed. */
  variant?: SocialCardVariant;
  /** Who posted it: name, handle, profile picture and the verified badge. */
  author?: SocialCardAuthor;
  /** The post text. #hashtags and @mentions are coloured. */
  content?: string;
  /** Address of the photo under the text. Leave it out for a text-only post. */
  image?: string;
  /** Alt text of the photo. */
  imageAlt?: string;
  /** Shape of the photo as width divided by height, e.g. 1.6. 0 uses the look's own shape. */
  imageRatio?: number;
  /** Number of likes before the visitor touches the heart. */
  likes?: number;
  /** Shows the like count. When false, the count is hidden but the heart still works. */
  showLikes?: boolean;
  /** Number of comments. */
  comments?: number;
  /** Number of shares (reposts on the timeline look). */
  shares?: number;
  /** The age of the post, as text: "2h", "Mar 4". */
  timestamp?: string;
  /** Starts the post as already liked by the visitor. */
  liked?: boolean;
  /** Colours of the card: follow the page's dark mode, or force light or dark. */
  scheme?: "auto" | "light" | "dark";
  /** Called whenever the visitor likes or unlikes the post. */
  onLikedChange?: (liked: boolean) => void;
  /** Extra classes for the card. It is as wide as its parent, up to a limit per look. */
  className?: string;
};

// The colours of the card as CSS variables, so the three looks share one set of rules.
// "auto" uses the dark: variant of the project's Tailwind setup.
const lightScheme = "[--sc-bg:#ffffff] [--sc-fg:#0f1419] [--sc-muted:#5d6872] [--sc-line:rgba(15,20,25,0.11)] [--sc-hover:rgba(15,20,25,0.06)] [--sc-shadow:rgba(30,40,60,0.28)]";
const darkScheme = "[--sc-bg:#16181b] [--sc-fg:#eef0f2] [--sc-muted:#8d97a1] [--sc-line:rgba(255,255,255,0.11)] [--sc-hover:rgba(255,255,255,0.07)] [--sc-shadow:rgba(0,0,0,0.7)]";
const autoScheme = `${lightScheme} dark:[--sc-bg:#16181b] dark:[--sc-fg:#eef0f2] dark:[--sc-muted:#8d97a1] dark:[--sc-line:rgba(255,255,255,0.11)] dark:[--sc-hover:rgba(255,255,255,0.07)] dark:[--sc-shadow:rgba(0,0,0,0.7)]`;
const schemes = { auto: autoScheme, light: lightScheme, dark: darkScheme };

// Per look: the widest the card gets, the colour of the verified badge and of the like pop,
// and the shape of the photo
const looks = {
  instagram: { width: "max-w-[380px]", badge: "#0095f6", pop: "#ff3b5c", ratio: 4 / 5 },
  x: { width: "max-w-[560px]", badge: "#1d9bf0", pop: "#f91880", ratio: 16 / 10 },
  facebook: { width: "max-w-[560px]", badge: "#1877f2", pop: "#1877f2", ratio: 16 / 10 },
} as const;

const defaultAuthor: SocialCardAuthor = { name: "Alex", handle: "alex", verified: false };

// "12,480" for exact counts, "12.5K" for the compact ones on the timeline and news feed
const exact = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function SocialCard({
  variant = "instagram",
  author = defaultAuthor,
  content = "",
  image,
  imageAlt = "",
  imageRatio = 0,
  likes = 0,
  showLikes = true,
  comments = 0,
  shares = 0,
  timestamp = "now",
  liked: startsLiked = false,
  scheme = "auto",
  onLikedChange,
  className = "",
}: SocialCardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [likedState, setLikedState] = useStateWithReset(startsLiked);
  const [repostedState, setRepostedState] = useStateWithReset(false);
  const [savedState, setSavedState] = useStateWithReset(false);
  const look = looks[variant];

  // The entrance: the parts of the card settle in one after another. It plays again when the look
  // changes, because the markup underneath is new.
  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 14, duration: 0.7, ease: "power3.out", stagger: 0.07, clearProps: "opacity,transform" });
    },
    { scope: rootRef, dependencies: [variant], revertOnUpdate: true },
  );

  // The small pop of an icon, and for a like also a ring of dots flying out
  const pop = contextSafe((name: "like" | "repost" | "save") => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const icon = root.querySelector(`[data-pop="${name}"]`);
    if (icon) gsap.fromTo(icon, { scale: 0.5, rotate: variant === "facebook" && name === "like" ? -24 : 0 }, { scale: 1, rotate: 0, duration: 0.75, ease: "elastic.out(1.1, 0.4)", overwrite: true });
    if (name !== "like") return;
    const dots = root.querySelectorAll("[data-dot]");
    gsap.fromTo(
      dots,
      { x: 0, y: 0, scale: 0.9, opacity: 1 },
      { x: (i) => Math.cos((i / dots.length) * Math.PI * 2) * 17, y: (i) => Math.sin((i / dots.length) * Math.PI * 2) * 17, scale: 0, opacity: 0, duration: 0.6, ease: "power2.out", overwrite: true },
    );
  });

  const setLiked = (next: boolean) => {
    setLikedState(next);
    onLikedChange?.(next);
    if (next) pop("like");
  };
  const toggleLike = () => setLiked(!likedState);
  const toggleRepost = () => {
    setRepostedState(!repostedState);
    if (!repostedState) pop("repost");
  };
  const toggleSave = () => {
    setSavedState(!savedState);
    if (!savedState) pop("save");
  };

  // Double-click on the photo: like it (never un-like) and show a big heart over it
  const likeFromPhoto = contextSafe(() => {
    const root = rootRef.current;
    const heart = root?.querySelector("[data-bigheart]");
    if (heart && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap
        .timeline({ overwrite: true })
        .fromTo(heart, { scale: 0.3, opacity: 0, y: 0 }, { scale: 1.1, opacity: 1, duration: 0.35, ease: "back.out(2.2)" })
        .to(heart, { scale: 1, duration: 0.12 })
        .to(heart, { opacity: 0, y: -26, scale: 1.2, duration: 0.45, ease: "power2.in" }, "+=0.18");
    }
    if (!likedState) setLiked(true);
  });

  // The visitor's own like and repost add one to the numbers they were given
  const view: View = {
    author,
    content,
    image,
    imageAlt,
    ratio: imageRatio > 0 ? imageRatio : look.ratio,
    likes: likes + (likedState ? 1 : 0) - (startsLiked ? 1 : 0),
    showLikes,
    comments,
    shares: shares + (repostedState ? 1 : 0),
    timestamp,
    liked: likedState,
    reposted: repostedState,
    saved: savedState,
    badge: look.badge,
    toggleLike,
    toggleRepost,
    toggleSave,
    likeFromPhoto,
  };

  const rootStyle = { "--sc-pop": look.pop, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" } as CSSProperties;

  return (
    <article
      ref={rootRef}
      data-variant={variant}
      className={`${schemes[scheme]} ${look.width} w-full overflow-hidden rounded-[20px] border border-[var(--sc-line)] bg-[var(--sc-bg)] text-[var(--sc-fg)] shadow-[0_40px_70px_-40px_var(--sc-shadow)] ${className}`}
      style={rootStyle}
    >
      {variant === "instagram" && <PhotoFeed {...view} />}
      {variant === "x" && <Timeline {...view} />}
      {variant === "facebook" && <NewsFeed {...view} />}
    </article>
  );
}

// ---------------------------------------------------------------------------------------------
// State that starts from a prop and follows it when the prop changes (the playground flips it)
// ---------------------------------------------------------------------------------------------

function useStateWithReset(value: boolean) {
  const [state, setState] = useState(value);
  useEffect(() => setState(value), [value]);
  return [state, setState] as const;
}

// ---------------------------------------------------------------------------------------------
// The three looks
// ---------------------------------------------------------------------------------------------

type View = {
  author: SocialCardAuthor;
  content: string;
  image?: string;
  imageAlt: string;
  ratio: number;
  likes: number;
  showLikes: boolean;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
  reposted: boolean;
  saved: boolean;
  badge: string;
  toggleLike: () => void;
  toggleRepost: () => void;
  toggleSave: () => void;
  likeFromPhoto: () => void;
};

function PhotoFeed(v: View) {
  return (
    <>
      <header data-in className="flex items-center gap-3 px-3.5 py-3">
        <span className="rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #ffc53d, #ff5a5f 45%, #c13ad6)" }}>
          <span className="block rounded-full bg-[var(--sc-bg)] p-[2px]">
            <Avatar author={v.author} size={34} />
          </span>
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1 text-[14px] leading-none">
          <span className="truncate font-semibold">{v.author.handle}</span>
          {v.author.verified && <Seal color={v.badge} size={14} />}
          <span className="text-[var(--sc-muted)]">·</span>
          <span className="text-[var(--sc-muted)]">{v.timestamp}</span>
        </div>
        <IconButton label="More options" className="-mr-1.5">
          <Icon name="more" size={20} />
        </IconButton>
      </header>

      {v.image && (
        <div data-in className="relative overflow-hidden bg-[var(--sc-line)]" style={{ aspectRatio: v.ratio }} onDoubleClick={v.likeFromPhoto}>
          <img src={v.image} alt={v.imageAlt} className="block h-full w-full object-cover" draggable={false} decoding="async" />
          <svg data-bigheart viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -mt-14 -ml-14 h-28 w-28 opacity-0 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" fill="#fff">
            <path d={heartPath} />
          </svg>
        </div>
      )}

      <div data-in className="flex items-center gap-1 px-2.5 pt-2.5">
        <LikeButton v={v} size={26} className="p-1.5" />
        <IconButton label="Comment" className="p-1.5 hover:opacity-60">
          <Icon name="comment" size={25} />
        </IconButton>
        <IconButton label="Share" className="p-1.5 hover:opacity-60">
          <Icon name="send" size={25} />
        </IconButton>
        <button type="button" onClick={v.toggleSave} aria-pressed={v.saved} aria-label={v.saved ? "Remove from saved" : "Save"} className="ml-auto cursor-pointer rounded-md p-1.5 transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-1">
          <span data-pop="save" className="block">
            <Icon name="bookmark" size={25} fill={v.saved} />
          </span>
        </button>
      </div>

      <div data-in className="px-3.5 pt-1 pb-4 text-[14px] leading-[1.45]">
        {v.showLikes && <p className="font-semibold">{exact.format(v.likes)} likes</p>}
        {v.content && (
          <p className="mt-1 break-words whitespace-pre-wrap">
            <span className="mr-1.5 font-semibold">{v.author.handle}</span>
            <RichText text={v.content} color={v.badge} />
          </p>
        )}
        {v.comments > 0 && <p className="mt-1.5 text-[var(--sc-muted)]">View all {exact.format(v.comments)} comments</p>}
      </div>
    </>
  );
}

function Timeline(v: View) {
  const actionClass = "group flex cursor-pointer items-center gap-0.5 text-[var(--sc-muted)] transition-colors focus-visible:outline-2";
  // The round tint that blooms behind an icon on hover
  const bloom = "grid h-[34px] w-[34px] place-items-center rounded-full transition-colors";
  return (
    <div className="flex gap-3 px-4 pt-4 pb-2">
      <div data-in className="shrink-0">
        <Avatar author={v.author} size={44} />
      </div>
      <div className="min-w-0 flex-1">
        <div data-in className="flex items-center gap-1 text-[15px] leading-5">
          <span className="truncate font-bold">{v.author.name}</span>
          {v.author.verified && <Seal color={v.badge} size={18} />}
          <span className="truncate text-[var(--sc-muted)]">@{v.author.handle}</span>
          <span className="text-[var(--sc-muted)]">·</span>
          <span className="shrink-0 text-[var(--sc-muted)]">{v.timestamp}</span>
          <IconButton label="More options" className="-mr-2 ml-auto text-[var(--sc-muted)]">
            <Icon name="more" size={18} />
          </IconButton>
        </div>

        {v.content && (
          <p data-in className="mt-0.5 text-[15px] leading-5 break-words whitespace-pre-wrap">
            <RichText text={v.content} color={v.badge} />
          </p>
        )}

        {v.image && (
          <div data-in className="mt-3 overflow-hidden rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-line)]" style={{ aspectRatio: v.ratio }}>
            <img src={v.image} alt={v.imageAlt} className="block h-full w-full object-cover" draggable={false} decoding="async" />
          </div>
        )}

        <div data-in className="-ml-2 mt-1.5 flex items-center justify-between pr-1 text-[13px]">
          <button type="button" aria-label="Reply" className={`${actionClass} hover:text-[#1d9bf0]`}>
            <span className={`${bloom} group-hover:bg-[#1d9bf0]/10`}>
              <Icon name="comment" size={18} />
            </span>
            <span className="min-w-6">{v.comments > 0 && compact.format(v.comments)}</span>
          </button>
          <button type="button" onClick={v.toggleRepost} aria-pressed={v.reposted} aria-label={v.reposted ? "Undo repost" : "Repost"} className={`${actionClass} hover:text-[#00ba7c] ${v.reposted ? "!text-[#00ba7c]" : ""}`}>
            <span className={`${bloom} group-hover:bg-[#00ba7c]/10`}>
              <span data-pop="repost" className="block">
                <Icon name="repost" size={18} />
              </span>
            </span>
            <span className="min-w-6">{v.shares > 0 && compact.format(v.shares)}</span>
          </button>
          <button type="button" onClick={v.toggleLike} aria-pressed={v.liked} aria-label={v.liked ? "Unlike" : "Like"} className={`${actionClass} hover:text-[#f91880] ${v.liked ? "!text-[#f91880]" : ""}`}>
            <span className={`${bloom} relative group-hover:bg-[#f91880]/10`}>
              <Dots />
              <span data-pop="like" className="block">
                <Icon name="heart" size={18} fill={v.liked} />
              </span>
            </span>
            <span className="min-w-6">{v.showLikes && v.likes > 0 && compact.format(v.likes)}</span>
          </button>
          <button type="button" onClick={v.toggleSave} aria-pressed={v.saved} aria-label={v.saved ? "Remove bookmark" : "Bookmark"} className={`${actionClass} hover:text-[#1d9bf0] ${v.saved ? "!text-[#1d9bf0]" : ""}`}>
            <span className={`${bloom} group-hover:bg-[#1d9bf0]/10`}>
              <span data-pop="save" className="block">
                <Icon name="bookmark" size={18} fill={v.saved} />
              </span>
            </span>
          </button>
          <button type="button" aria-label="Share" className={`${actionClass} hover:text-[#1d9bf0]`}>
            <span className={`${bloom} group-hover:bg-[#1d9bf0]/10`}>
              <Icon name="share" size={18} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NewsFeed(v: View) {
  const action = "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-[14px] font-semibold text-[var(--sc-muted)] transition-colors hover:bg-[var(--sc-hover)] focus-visible:outline-2";
  return (
    <>
      <header data-in className="flex items-center gap-2.5 px-4 pt-3.5 pb-2.5">
        <Avatar author={v.author} size={42} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-1 text-[15px] font-semibold">
            <span className="truncate">{v.author.name}</span>
            {v.author.verified && <Seal color={v.badge} size={15} />}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-[var(--sc-muted)]">
            {v.timestamp}
            <span>·</span>
            <Icon name="globe" size={12} />
          </p>
        </div>
        <IconButton label="More options" className="-mr-1.5 text-[var(--sc-muted)]">
          <Icon name="more" size={20} />
        </IconButton>
      </header>

      {v.content && (
        <p data-in className="px-4 pb-3 text-[15px] leading-[1.4] break-words whitespace-pre-wrap">
          <RichText text={v.content} color={v.badge} />
        </p>
      )}

      {v.image && (
        <div data-in className="overflow-hidden bg-[var(--sc-line)]" style={{ aspectRatio: v.ratio }}>
          <img src={v.image} alt={v.imageAlt} className="block h-full w-full object-cover" draggable={false} decoding="async" />
        </div>
      )}

      <div data-in className="flex items-center gap-1.5 px-4 pt-2.5 pb-2.5 text-[14px] text-[var(--sc-muted)]">
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full text-white" style={{ background: v.badge }}>
          <Icon name="thumb" size={11} fill />
        </span>
        {v.showLikes && <span>{compact.format(v.likes)}</span>}
        <span className="ml-auto">
          {compact.format(v.comments)} comments · {compact.format(v.shares)} shares
        </span>
      </div>

      <div data-in className="mx-4 mb-1 flex gap-1 border-t border-[var(--sc-line)] py-1">
        <button type="button" onClick={v.toggleLike} aria-pressed={v.liked} aria-label={v.liked ? "Unlike" : "Like"} className={action} style={v.liked ? { color: v.badge } : undefined}>
          <span data-pop="like" className="relative block">
            <Dots />
            <Icon name="thumb" size={20} fill={v.liked} />
          </span>
          Like
        </button>
        <button type="button" aria-label="Comment" className={action}>
          <Icon name="comment" size={20} />
          Comment
        </button>
        <button type="button" aria-label="Share" className={action}>
          <Icon name="send" size={20} />
          Share
        </button>
      </div>
      <div className="h-1.5" />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Small parts
// ---------------------------------------------------------------------------------------------

function LikeButton({ v, size, className = "" }: { v: View; size: number; className?: string }) {
  return (
    <button type="button" onClick={v.toggleLike} aria-pressed={v.liked} aria-label={v.liked ? "Unlike" : "Like"} className={`relative cursor-pointer rounded-md transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-1 ${className}`}>
      <Dots />
      <span data-pop="like" className="block" style={v.liked ? { color: "var(--sc-pop)" } : undefined}>
        <Icon name="heart" size={size} fill={v.liked} />
      </span>
    </button>
  );
}

/** Eight dots in the middle of a button. The like pop flies them outwards. */
function Dots() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} data-dot className="absolute -mt-[2px] -ml-[2px] h-1 w-1 rounded-full bg-[var(--sc-pop)] opacity-0" />
      ))}
    </span>
  );
}

function IconButton({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} className={`grid cursor-pointer place-items-center rounded-full p-1.5 transition-colors hover:bg-[var(--sc-hover)] focus-visible:outline-2 ${className}`}>
      {children}
    </button>
  );
}

function Avatar({ author, size }: { author: SocialCardAuthor; size: number }) {
  const box = { width: size, height: size } as const;
  if (author.avatar) return <img src={author.avatar} alt={author.name} style={box} className="block shrink-0 rounded-full bg-[var(--sc-line)] object-cover" draggable={false} decoding="async" />;
  const initials = author.name
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span aria-label={author.name} role="img" style={{ ...box, fontSize: size * 0.38 }} className="grid shrink-0 place-items-center rounded-full bg-[var(--sc-hover)] font-semibold text-[var(--sc-muted)]">
      {initials}
    </span>
  );
}

/** The verified badge: a plain scalloped seal with a tick, drawn from two rounded squares */
function Seal({ color, size }: { color: string; size: number }) {
  return (
    <svg role="img" aria-label="Verified" viewBox="0 0 24 24" width={size} height={size} className="shrink-0">
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill={color} />
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill={color} transform="rotate(45 12 12)" />
      <path d="M8.2 12.4l2.5 2.5 5.1-5.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Text with #hashtags and @mentions picked out in the look's accent colour */
function RichText({ text, color }: { text: string; color: string }) {
  return (
    <>
      {text.split(/([#@][\p{L}\p{N}_.]*[\p{L}\p{N}_])/u).map((part, i) =>
        /^[#@]/.test(part) ? (
          <span key={i} style={{ color }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

const heartPath = "M12 21s-7.6-4.7-9.4-9.4C1.4 8.4 3.2 5 6.7 5c2.1 0 3.6 1.1 5.3 3.3C13.7 6.1 15.2 5 17.3 5c3.5 0 5.3 3.4 4.1 6.6C19.6 16.3 12 21 12 21z";

const paths = {
  heart: heartPath,
  comment: "M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.6l1.5-5.1A8.5 8.5 0 1 1 21 11.5z",
  send: "M21.5 3 10.6 13.9M21.5 3l-6.8 18-4.1-7.1L3.5 9.8z",
  bookmark: "M6.5 3.5h11v17.2L12 16.5l-5.5 4.2z",
  repost: "M17 3l4 4-4 4M3 11V9.5A2.5 2.5 0 0 1 5.5 7H21M7 21l-4-4 4-4M21 13v1.5a2.5 2.5 0 0 1-2.5 2.5H3",
  share: "M12 15V3.5M7.5 8 12 3.5 16.5 8M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6",
  thumb: "M7.5 10.5V21H3.5V10.5zM7.5 10.5 11.4 3c1.6 0 2.6 1.3 2.3 2.8L13.1 9H19a2 2 0 0 1 2 2.4l-1.4 7.2a2 2 0 0 1-2 1.6H7.5",
} as const;

type IconName = keyof typeof paths | "more" | "globe";

function Icon({ name, size, fill = false }: { name: IconName; size: number; fill?: boolean }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const, className: "block" };
  if (name === "more") {
    return (
      <svg {...common} fill="currentColor">
        <circle cx="5" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="19" cy="12" r="1.8" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    );
  }
  return (
    <svg {...common} fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}
