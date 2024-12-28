# Question types

We could have multiple questions types, and ways of managing questions in the database. 

Types: 
- Artist
- Title
- Both/Full

DB Organization: 

A. Question model that contains a type & an array of options 
	- If a question has no array of options, then the question is open-ended text entry instead of multiple choice

B. Each artist has similar artists & each song has similar songs
	1. Questions are generated at runtime by combining a song w/ a type & if it should be multiple choice or write-in
   	- If question will be multiple choice, we combine 3 similar artists w/ 3 similar songs to create the other choices
	2. Questions are created in a model that references the similar songs/artists
	3. We build a question generator that uses the similar songs/artists