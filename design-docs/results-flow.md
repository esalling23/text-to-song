# Results Flow

1. Player guesses -> /round/guess
   1. Calculate if guess is correct, and how many points the player should get
      1. V1: all correct answers get the same points
   2. Scores & correctness are stored on Guess objects
      1. V1: points for correct title OR artist - 50 each, up to 100 points total
2. After all guesses are in, results flow should start automatically
   1. Recap the song 
      1. V1: Display lyrics
      2. V2: Display lyrics, highlighted along with audio of actual song
   2. Reveal correct title & artist
   3. Reveal player guesses 
      1. Reveal title guess & points if correct
      2. Reveal artist guess & points if correct
3. Display accumulated scoreboard
   1. Show previous scores & placements (1st, 2nd, etc)
   2. After a moment, show round points as additions (+50, +100, etc)
   3. Show scores increasing based on point additions
   4. Re-order the rows to show new placements 
4. Move on to next round OR End game
   1. End game: should highlight the top player and display a "winner" message