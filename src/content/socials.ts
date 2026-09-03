import { siGithub, siInstagram } from "simple-icons";

export type Social = {
  name: string;
  href: string;
  /** SVG path data for the brand mark. */
  path: string;
  /** Defaults to simple-icons' 24×24 grid. */
  viewBox?: string;
};

// LinkedIn has no simple-icons mark (pulled over trademark restrictions,
// same as Adobe), so its glyph is inlined here from Bootstrap Icons (MIT)
// — hence the 16×16 viewBox on that one.
const LINKEDIN_PATH =
  "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z";

// TODO: replace the GitHub and Instagram handles with the real ones.
export const socials: Social[] = [
  { name: "GitHub", href: "https://github.com/your-handle", path: siGithub.path },
  { name: "Instagram", href: "https://instagram.com/your-handle", path: siInstagram.path },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/your-profile",
    path: LINKEDIN_PATH,
    viewBox: "0 0 16 16",
  },
];

// Booking link — the low-friction path for anyone who'd rather grab time
// than compose an email.
export const CALENDLY_URL = "https://calendly.com/alvagalv/30min";
