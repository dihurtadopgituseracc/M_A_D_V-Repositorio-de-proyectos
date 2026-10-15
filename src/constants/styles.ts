export const semi =
  "font-[var(--font-heading)] font-semibold not-italic leading-[normal]"
export const reg = "font-[var(--font-body)] font-normal not-italic leading-[normal]"
export const instr = "font-[var(--font-ui)] font-bold leading-[normal]"
export const wdth = { fontVariationSettings: '"wdth" 100' }

/** Kit de marca alineado con las custom properties de index.css. */
export const colors = {
  ink: "#363636",
  inkSoft: "#555555",
  inkMuted: "#777777",
  inkSubtle: "#B2B2B2",
  mustard: "#D99D45",
  mustardDeep: "#D4A017",
  gold: "#F0CB82",
  goldLight: "#F7E785",
  cream: "#F5EAC7",
  paper: "#FFFDF5",
  orange: "#EF5A36",
  alert: "#F0192D",
  background: "#FFFDF5",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFAF0",
  text: "#363636",
  textSecondary: "#555555",
  textMuted: "#777777",
  border: "#E9DFC9",
  borderStrong: "#D8C9AA",
  primary: "#D99D45",
  primaryHover: "#C88931",
  primaryContrast: "#363636",
  secondary: "#363636",
  accent: "#EF5A36",
  danger: "#F0192D",
  focus: "#B77720",
  success: "#47745A",
  info: "#536F78",
} as const

export const typography = {
  display: '"Bebas Neue", Impact, sans-serif',
  heading: '"Montserrat", Arial, sans-serif',
  body: '"Poppins", Arial, sans-serif',
  ui: '"Quicksand", Arial, sans-serif',
  editorial: '"Liter", Georgia, serif',
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    display: "clamp(2.5rem, 6vw, 4.5rem)",
  },
} as const

export const spacing = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
} as const

export const radii = {
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "999px",
} as const

export const shadows = {
  sm: "0 2px 8px rgb(54 54 54 / 0.06)",
  md: "0 8px 24px rgb(54 54 54 / 0.09)",
  lg: "0 16px 40px rgb(54 54 54 / 0.13)",
} as const

export const motion = {
  fast: "140ms",
  normal: "220ms",
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
} as const
