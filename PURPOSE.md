# What this site is for

Three purposes. They are the northstars: when something is proposed for
this site, it earns its place by serving one of them, and the honest answer
to "which one?" is sometimes "none", which is what this file is for.

The same three are stated on the page itself, from `src/content/site.ts`,
as `SITE_PURPOSE` in the footer. Change both — this file and the list —
together. A site whose stated purpose and working purpose differ is worse
than one that states nothing.

---

## 1. To be known

What I've built and how I think, in one place I own.

A CV says where I worked. This says what I made, how it behaves, and what I
think about it. The distinction matters because the work is the argument:
a fire model that runs in the browser makes a case that no bullet point
about "experience with fire modelling" can.

**What this rules in:** anything that lets a stranger form an accurate
impression faster. Live pieces over screenshots. Takeaways over bullets.
The map over a list of campuses.

**What this rules out:** decoration that says nothing about me, and detail
that no reader would get through. The forty-line job history came off this
page twice for exactly that reason.

## 2. To keep the work

Maps, models and experiments live here, named and dated, not lost in a
drive.

This is a storage brief as much as a presentation one, and it is why the
Wall is built the way it is: adding a piece means adding an entry to
`src/components/gallery/data.ts`, not building a page. The attribution rule
follows from the same purpose — every tile carries a `credit`, the type
system will not compile without one, and a piece whose credit is still
`TODO` is filtered off the Wall rather than published uncredited.

**What this rules in:** low-friction ways to add work. One file to edit.
Assets that drop into `public/` and appear. Guardrails that hide a broken
piece rather than showing it half-built.

**What this rules out:** anything that makes publishing a new piece a
project. If adding a photograph takes a component, the design is wrong.

## 3. To start things

If you work on climate or geospatial problems, this is the front door.

Note what this is not: it is not "to get hired". Hiring is one outcome of
this purpose and not the largest one. A collaborator, a commissioner and a
hiring manager all arrive through the same door and want the same thing
first, which is evidence, and the same thing second, which is an obvious
way to make contact.

**What this rules in:** one clear way to make contact, always reachable.
The availability of the work being stated plainly.

**What this rules out:** four calls to action in one screenful, which is
what happened when this purpose was read as "get hired" and every section
grew its own contact button. One primary action, one secondary, and the
secondary can be information rather than a button.

---

## Using this

When something is proposed, ask which of the three it serves and how you
would know if it worked. Three failure modes this catches:

- **Serves none of them.** It is interesting and it does not belong. The
  test is not whether it is good, it is whether it is this site's job.
- **Serves one badly while hurting another.** A permission prompt on page
  load serves (1) by being impressive and destroys (3) by losing the
  reader before they reach the work. The fix is usually placement, not
  deletion.
- **Serves a purpose that is not on this list.** Then either the list is
  wrong and should be edited, deliberately, or the idea is.

A worked example, from the history: "By the numbers" was three stat cards
counting live pieces, fire pieces and countries. It served (1), it was
accurate, and it was deleted — because it summarised in four cards what the
section directly above it said in detail. The purpose was already being
served, better, six inches higher up the page.
