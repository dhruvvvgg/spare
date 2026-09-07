# Spare

**Generosity on your own terms.**

Most charity apps start with the same question: how much money can you give? If the honest answer is "not much," you feel a bit guilty and close the tab.

Spare asks a different question. Instead of "how much can you donate," it asks "what do you have spare right now?" Money, time, a skill, a language you speak, an object gathering dust, access to something like a car or a quiet room. You type it in plain language, and Spare turns it into three specific, real things you can do this week, each with a ready-to-send message so you're not left staring at a blank box wondering what to say.

Built for dev.to's [Weekend Challenge: Generosity Edition](https://dev.to/challenges/weekend-2026-09-03), for International Day of Charity.

## Why

Most people don't skip giving because they're selfish. They skip it because the usual ask never fits what they actually have on hand, and whatever they could offer feels too small to matter. This is an attempt to close that gap, and to actually get someone from "I should do something" to "I just sent that message," in one sitting.

## How it works

Spare works in three layers, so it never has to guess or make something up:

1. **Live search.** Gemini looks for real, currently operating opportunities near you, matched to what you typed. It only shows a result if it can attach a real, working source link to it.
2. **Hand-checked fallback.** If live search comes up short, Spare falls back to a list of organizations I personally verified beforehand, checking every link and every claim by hand before it went into the app.
3. **Search fallback.** If neither of those has a good match, Spare hands you off to a live search on Idealist instead of pretending it found something.

Every result is labeled with exactly which of these three it came from, so you always know how much to trust it.

Once you pick a result, a second Gemini call drafts an outreach message in your own voice, based on how you phrased your original input.

## Try it

Live app: [spare](https://spareapp.ai.studio)

There are three demo personas on the first screen if you'd rather tap through than type.

## Built with

- Google AI Studio
- Gemini, for extracting structured intent from free text, live grounded search, and drafting outreach messages
- A hand-verified dataset of real organizations across India and globally, spanning money, time, skills, objects, language, and access

## Prize category

Submitted for Best Use of Google AI.

## A note on the data

I checked every organization in the fallback list myself before including it: what it does, whether it's still active, and whether the link actually works. For a project about charity, pointing someone toward a fake or defunct organization felt worse than not having a result at all.
