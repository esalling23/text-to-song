# Text-To-Song Game

## Prereqs

## Setup

1. Install packages: `yarn install`
2. Setup `.env` with `DATABASE_URL` for local db connection
3. Migrate db with prisma: `npx prisma migrate dev`
4. Run dev server: `yarn run dev`
5. Empty DB & Re-seed during testing: `yarn run empty-seed`

### Prisma 

Prisma is used for db management with Postgresql

- Run the prisma studio: `npx prisma studio`
- Migrate: `npx prisma migrate <env>`
- Format: `npx prisma format`