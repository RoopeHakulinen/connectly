# Connectly

## Overview

Connectly helps users remember to stay in touch with their relatives, friends, and tasks by tracking all activities between them. The application monitors when the last interaction occurred and compares it to the desired frequency for each person or task.

## Core Concepts

### Targets
A **Target** represents either a person (friend, family member, colleague) or a task that needs regular attention. Targets are called "targets" because the system works identically for both people and tasks.

- **Types**: `FRIEND` (for people) or `TASK`
- Each target belongs to a **Tier** that defines the desired contact frequency
- Targets have associated **Activities** that track interactions

### Tiers
A **Tier** defines a contact frequency level (e.g., weekly, monthly). Users can create multiple tiers to categorize their targets by priority:
- Higher priority targets (e.g., mom) would be in a tier with more frequent intervals
- Lower priority targets (e.g., ex-colleague) would be in a tier with less frequent intervals

### Activities
An **Activity** records an interaction with a target. Activities have different types with implicit weights:
- `CALL` - Most valuable, represents immersive interaction
- `MESSAGE` - Less valuable than calls (SMS, text messages)
- `OTHER` - Generic activity type

### Dashboard
The application includes a dashboard that shows upcoming deadlines to connect with targets, highlighting those that are due soon based on their tier's frequency and last activity date.

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based (jsonwebtoken)
- **Language**: TypeScript

### Frontend
- **Framework**: Angular 19
- **UI Components**: Angular Material + CDK
- **State Management**: @ngneat/query
- **Language**: TypeScript

## Project Structure

```
connectly/
├── backend/           # NestJS API server
│   ├── prisma/        # Database schema and migrations
│   └── src/           # Application source code
└── ui/                # Angular frontend
    └── src/           # Application source code
```

## Database Schema

Key models in `backend/prisma/schema.prisma`:
- `User` - Application users
- `Target` - People or tasks to stay in touch with
- `Tier` - Frequency levels for contact
- `Activity` - Records of interactions with targets

## Development Commands

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Common Considerations

## UI coding style
1. Add localizations to all i18n files with appropriate languages
2. Always use @ngneat/query to query and mutate data
3. Don't use Angular signals

## Backend coding style
1. Don't use NestJS modules for anything

## General coding style
1. Do not unnecessarily comment things that are obvious (e.g. `// Fetch timeline data from backend`)
2. Don't use abbreviations unless they are very common (e.g. "id" is ok, "usr" is not) and do not use one-letter names for e.g. iteration variables (`let u of users`)
3. Always use Prisma for database access
4. Try to use functional programming where possible (e.g. use `map`, `filter`, `reduce` instead of `for` loops and such)
5. Use `type` over `interface` for consistency
6. Don't write `undefined` in the code but rather pass around `null` where needed (e.g. `const needle = foo.find(...) ?? null`). Always use explicit checks instead of relying on type coercion (e.g. `nullableValue === null` instead of `!nullableValue`).
7. Always use curly brackets for blocks such as if statements, even for single-line blocks.
8. Do not use abbreviated variable names, even in loops like `this.presenters.filter((p) => p !== presenter)`
9. Always make sure the UI works in both mobile and desktop. 
10. Don't create documentation files

