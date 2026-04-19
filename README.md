# Rhythm Run

Built by Jared Hettinger

![Tests](https://github.com/kafkaesc/rhythm-run/actions/workflows/test.yml/badge.svg)
[![Coverage](https://codecov.io/gh/kafkaesc/rhythm-run/branch/main/graph/badge.svg)](https://codecov.io/gh/kafkaesc/rhythm-run)
![Lint](https://github.com/kafkaesc/rhythm-run/actions/workflows/lint.yml/badge.svg)
![Typecheck](https://github.com/kafkaesc/rhythm-run/actions/workflows/typecheck.yml/badge.svg)

Rhythm Run is a Next.js app for finding tracks to match your pace.

## 📋 Prerequisites

- Node 18+
- pnpm

## 📦 Installation & Operation

After first downloading this project, run `pnpm install` to install the node modules.

Once the project is installed, running it just takes two steps:

1. Run `pnpm dev`
1. Open [http://localhost:3000](http://localhost:3000) in your browser of choice

## 🛠️ Tech Stack

- Next 16
- TypeScript 5
- React 19
- Tailwind 4

## 🔌 APIs

- [Spotify](https://developer.spotify.com/documentation/web-api)
- [GetSongBpm](https://getsongbpm.com)

## 🎯 Testing

This project uses Jest for unit testing.

- `pnpm test` - Runs tests and displays the test names and pass/fail results
- `pnpm test:ci` - Runs tests and displays coverage across the project
- `pnpm test:watch` - Runs tests in watch mode, re-running affected tests automatically as files change

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.md).
