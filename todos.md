## To dos

### General Feature Work

- [ ] Replace console logs from requests with alert notification
- [ ] Group screen layout/styling
  - [x] Improve player icon layout
- [x] Add debug data to toggle-able panel
- [x] Hide "Start Game" button until MIN players join
- [x] Refactor routes into individual files
- [ ] Update navigation links based on window location
- [x] Move debug, kill, other group game actions to ActionsBar
- [x] Player icon selection

### Testing

- [ ] Automated socket testing coverage

### Bugs

- [ ] Debug text-to-speech synth
- [ ] Add Prisma error handling
- [ ] Debug Socket rooms
- [ ] Debug Socket random disconnects

### NextJS

- [ ] Assess & update current Redux/Context API implementation to align with [NextJS best practices](https://redux.js.org/usage/nextjs)
  - [ ] Q: Can we refactor to not need to define routes in `server.ts`

### Security

#### WebSockets

- [ ] Require proof of work/websocket at points in game (create, ...)
- [ ] Assess need for rate limiting
- [ ] Review https://brightsec.com/blog/websocket-security-top-vulnerabilities 

### Accessibility 

- [ ] Use `htmlFor` and `id`s for labels/inputs
  - [ ] Use `useId` hook to handle `id`s 
- [ ] Implement keyboard tab control, etc.
