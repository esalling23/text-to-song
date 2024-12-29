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

### Prisma 

Prisma is used for db management with Postgresql

- Run the prisma studio: `npx prisma studio`
- Migrate: `npx prisma migrate <env>`
- Format: `npx prisma format`

## To dos

### General Feature Work

- [ ] Replace console logs from requests with alert notification
- [ ] Group screen layout/styling
- [x] Add debug data to toggle-able panel
- [x] Hide "Start Game" button until MIN players join
- [ ] Refactor routes into individual files
- [ ] Automated socket testing coverage
- [ ] Update navigation links based on window location

### Bugs

- [ ] Debug text-to-speech synth
- [ ] 

### NextJS

- [ ] Assess & update current Redux/Context API implementation to align with [NextJS best practices](https://redux.js.org/usage/nextjs)
  - [ ] Q: Can we refactor to not need to define routes in `server.ts`

### Security

#### WebSockets

- [ ] Require POW at points in game (create, ...)
  - Note: Make better notes. What does this mean? ^
- [ ] Assess need for rate limiting
- [ ] Review https://brightsec.com/blog/websocket-security-top-vulnerabilities 

### Accessibility 

https://medium.com/@ignatovich.dm/accessibility-in-react-best-practices-for-building-inclusive-web-apps-906d1cbedd27

- [ ] Use `htmlFor` and `id`s for labels/inputs
- [ ] Implement keyboard tab control, etc.
- [ ] 