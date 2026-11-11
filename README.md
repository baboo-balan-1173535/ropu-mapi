# Rōpū Mapi

**Navigate together — see everyone on the map, for the whole trip.**

Rōpū Mapi (Māori, roughly "map group") is a turn-by-turn navigation app for Android, built around one thing Google Maps and Waze don't really do well: **traveling as a group**. Create a trip, share a join code or QR with the people you're traveling with, and everyone's live position shows up on everyone else's map — for the entire trip, not a one-off "here's my location" ping.

> **About this repository:** this is the app's public build mirror only — it holds the latest compiled Android APK and a small version file, nothing else. The app's source code lives in a separate, private repository while it's still under active development.

---

## The core idea: real convoy navigation

Most map apps treat trip-sharing as an afterthought — a one-way link with no live sync and no awareness of a group. Rōpū Mapi is built the other way around, group-first:

1. **Create a trip** and start navigating, solo or with others.
2. **Share the join code or QR code** with everyone traveling with you — no accounts, no sign-up, nothing to install for them beyond the app itself.
3. **Everyone sees everyone** — every member's live position, on one shared map, for as long as the trip is active.

On top of that shared map:

- **Automatic gap alerts** — get notified if someone in the group falls behind, stops, or takes a wrong turn, so the group doesn't end up scattered without knowing it.
- **Collaborative pit-stop voting** — anyone can propose a stop (fuel, food, a lookout, a rest area); the group votes, and the route updates for everyone once it's agreed.
- Scales from a two-car trip to a full convoy — there's no artificial group-size limit or premium tier gating it.

## Full turn-by-turn navigation

Group features sit on top of genuine, complete turn-by-turn navigation:

- **Driving, cycling, and walking modes** — each with its own real routing, not one mode relabeled as another.
- **Live GPS tracking** with a compass-aligned vehicle marker that follows your real heading.
- **Turn-by-turn voice guidance**, with timing and phrasing that adapt to the type of road you're on.
- **Live posted speed limits**, pulled from real road data rather than estimated from travel speed.
- **Automatic rerouting** the moment you go off the planned route.
- **Google Maps-style route previews**, with alternative route options to choose between before you commit.

## Backcountry-aware, not just roads

Rōpū Mapi is built with genuine backcountry travel in mind, not just city streets:

- Seamless handoff from highway navigation onto marked trails, built on official **New Zealand DOC (Department of Conservation)** and **Herenga ā Nuku (Outdoor Access)** open data.
- **Discover mode** — nearby trails, fuel, food, and rest stops shown directly as pins on the map; tap one to see details and add it as a stop on your route.
- Real trail details where available: difficulty, distance, elevation gain, and loop type.

## Built differently, on purpose

- **No subscription, ever.** No paid tier, no navigation features held back behind a paywall.
- **No paid map APIs.** Built entirely on open data and open-source mapping tools — there's no Google Maps or Mapbox billing behind the scenes, which is exactly why this can stay free.
- **Privacy-first.** Your location is shared with your own trip group, for the duration of your trip — it isn't sold, used for advertising, or retained afterward.
- **Direct installs, no app-store gatekeeping** — for now, you install the APK directly from here, and future updates are delivered the same way, in place, without needing to uninstall first.

## Get the app

The latest build is always available directly from this repository:

📲 **[Download RopuMapi.apk](https://raw.githubusercontent.com/baboo-balan-1173535/ropu-mapi/main/RopuMapi.apk)**

Current build number and commit: see [`manifest.json`](./manifest.json).

Android only, for now. The app checks for new builds itself and can update itself in place — no need to come back here for every update once it's installed.

## Status

Rōpū Mapi is under active, hands-on development and real-world field testing — expect the app to keep improving quickly as real trips turn up rough edges worth smoothing out. This repository only ever holds the current build.
