# Rhythm Run

Built by Jared Hettinger

![Tests](https://github.com/kafkaesc/rhythm-run/actions/workflows/test.yml/badge.svg)
[![Coverage](https://codecov.io/gh/kafkaesc/rhythm-run/branch/main/graph/badge.svg)](https://codecov.io/gh/kafkaesc/rhythm-run)
![Lint](https://github.com/kafkaesc/rhythm-run/actions/workflows/lint.yml/badge.svg)
![Typecheck](https://github.com/kafkaesc/rhythm-run/actions/workflows/typecheck.yml/badge.svg)
![CodeQL](https://github.com/kafkaesc/rhythm-run/actions/workflows/codeql.yml/badge.svg)

Rhythm Run is a Next.js app for finding tracks to match your pace.

## 📋 Prerequisites

- [Node 18+](https://nodejs.org)
- [pnpm](https://pnpm.io)

## 📦 Installation & Operation

### Install

After first downloading this project, run `pnpm install` from the root folder to install the node modules.

### Setup

In order to call APIs you will need to create a `.env.local` file.

```
GET_SONG_BPM_KEY=<YOUR_KEY_HERE>
LAST_FM_KEY=<YOUR_KEY_HERE>
SPOTIFY_CLIENT_ID=<YOUR_KEY_HERE>
SPOTIFY_CLIENT_SECRET=<YOUR_KEY_HERE>
```

### Run

Once the project is installed and set up, running it just takes two steps:

1. Run `pnpm dev`
1. Open [http://localhost:3000](http://localhost:3000) in your browser of choice

## 🛠️ Tech Stack

- [Next 16](https://nextjs.org)
- [TypeScript 5](https://www.typescriptlang.org)
- [React 19](https://react.dev)
- [Tailwind 4](https://tailwindcss.com)

## 📚 Libraries

- [clsx](https://github.com/lukeed/clsx)
- [Iconify](https://iconify.design)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## 🔌 APIs

- [GetSongBpm](https://getsongbpm.com/api)
- [Last.fm](https://www.last.fm/api)
- [MusicBrainz](https://musicbrainz.org/doc/MusicBrainz_API)
- [Spotify](https://developer.spotify.com/documentation/web-api)

## 🎯 Testing

Tests are written with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), with coverage tracked using [Codecov](https://codecov.io/).

- `pnpm test` - Runs tests and displays the test names and pass/fail results
- `pnpm test:ci` - Runs tests and displays coverage across the project
- `pnpm test:watch` - Runs tests in watch mode, re-running affected tests automatically as files change

### Coverage Graph

[![Coverage Graph](https://codecov.io/gh/kafkaesc/Rhythm-Run/graphs/sunburst.svg?token=I4SQ74QIAQ)](https://codecov.io/gh/kafkaesc/rhythm-run)

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.md).
