# Text-To-Song Game

## Prereqs

## Setup

1. Install packages: `npm install`
2. Setup `.env` with `DATABASE_URL` for local db connection
3. Migrate db with prisma: `npx prisma migrate dev`
4. Run dev server: `npm run dev`

Empty DB & Re-seed during testing: 
```
npx prisma db push --force-reset && npm run seed
```

## To dos

### NextJS

- Assess & update current Redux/Context API implementation to align with [NextJS best practices](https://redux.js.org/usage/nextjs)

### Security

#### WebSockets

- Require POW at points in game (create, ...)
- Rate limiting?

### Database

Prisma for db management with Postgresql

- Run the prisma studio: `npx prisma studio`
- Migrate: `npx prisma migrate <env>`
- Format: `npx prisma format`