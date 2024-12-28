# Text-To-Song Game

Inspired by TikTok text-to-speech tools & The Goldenrod Inn's Trivia Nights, especially Aaron (and Eric). 

In the style of Jackbox party games. 

## Premise

A party/group guessing game in which you are played audio text-to-speech clips of song lyrics. Then, you must guess the song & the artist. 


Big ideas:
- a party style web app
  - "group" and "individual user" screens like Jackbox
- can play w/ or w/o account
  - w/ account you can connect music apps to personalize experience
- pick from themes like "50s rock" or go totally random

## Versions

### V1: Search Song Lyrics

Song/Lyric API integration. 
First print song matches, then allow user to confirm.
Print confirmed song lyrics to screen.

### V2: Text-To-Speech (TTS) Song Lyrics

Use WebSpeech API to play lyrics found.

### V3: User-Curate Lyric Sections for TTS

Users should be able to highlight or do something to provided lyrics to select lines to be turned into text-to-speech. 
Eventually there could be default lines chosen for the games, and users can update before game starts. 

### V4: Group & Individual Screens

**Group screen**
- Plays TTS lyrics
- Shows timer for guessing
- Shows who has guessed
- Moves on after all guesses are in

**Individual Screen**
- Guessers should see input to guess song name & artist
- Guesseeeeees should be able to trigger TTS replay

## Tech Outline

- nextjs, Typescript, React
- TailwindCSS
- socket.io
- lyric lookup api
  - [lrclib](https://lrclib.net/api/search?q=something)
  - [genius api](https://docs.genius.com/#/getting-started-h1)
- text-to-speech api
  - Web Speech API (browser native)
  
Future:
- connect Spotify, Apple Music, etc. accounts/APIs
- https://capacitorjs.com/ for ~native app release
- daily [dump](https://lrclib.net/db-dumps) script check to update personal DB instead of referencing API
  - reason: enable better search UX currently not supported with API
    - we don't care which album a song was from usually - could combine results
    - pagination

### Models

- User
  - email
  - password
  - last display name (for player display name autofill) (string)
- Player (a user in a game)
  - display name (string)
  - current game id (string)
  - points (int)
- Song
  - generic name (string)
  - lyric DB id (string)
  - lyric blocks (LyricBlock[])
  - music platform names/ids (string)
- LyricBlock
  - start (int)
  - end (int)
- Game
  - Players (Player[])
  - Songs (Song[])
  - startTime (DateTime)
  - endTime? (DateTime) - optional
  - round

Song -|--< LyricBlock
Game -|--< Song
Game -|--< Player

## Problems

### User disconnect/re-join handling

