import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.artist.create({
    data: 
		{
			name: 'Blink 182',
			songs: {
				create: [
					{ 
						title: 'All The Small Things',
						lyricBlocks: [
							`True care, truth brings\n
							I'll take one lift\n
							Your ride, best trip\n
							Always, I know\n
							You'll be at my show\n
							Watching, waiting\n
							Commiserating\n
							Say it ain't so, I will not go\n
							Turn the lights off, carry me home`,
						]
					},
					{ 
						title: 'I Miss You',
						lyricBlocks: [
							`I need somebody and always\n
							This sick, strange darkness\n
							Comes creeping on, so haunting every time\n
							And as I stare, I counted\n
							The webs from all the spiders\n
							Catching things and eating their insides\n
							Like indecision to call you\n
							And hear your voice of treason\n
							Will you come home and stop this pain tonight?\n
							Stop this pain tonight`,
							`Hello, there\n
							The angel from my nightmare\n
							The shadow in the background of the morgue\n
							The unsuspecting victim\n
							Of darkness in the valley\n
							We can live like Jack and Sally if we want\n
							Where you can always find me\n
							And we'll have Halloween on Christmas\n
							And in the night, we'll wish this never ends\n
							We'll wish this never ends
							`
						]
					},
				]
			}
		},
  })
  await prisma.artist.create({
    data: 
		{
			name: 'Ed Sheeran',
			songs: {
				create: [
					{ 
						title: 'Castle On A Hill',
						lyricBlocks: [
							`Fifteen years old and smoking hand-rolled cigarettes\n
							Runnin' from the law through the backfields and gettin' drunk with my friends\n
							Had my first kiss on a Friday night, I don't reckon that I did it right\n
							But I was younger then, take me back to when`,
							`One friend left to sell clothes\n
							One works down by the coast\n
							One had two kids but lives alone\n
							One's brother overdosed\n
							One's already on his second wife\n
							One's just barely gettin' by\n
							But these people raised me\n
							And I can't wait to go home`
						]
					},
					{
						title: 'Shape Of You',
						lyricBlocks: [
							`We push and pull like a magnet do\n
							Although my heart is fallin' too\n
							I'm in love with your body\n
							And last night, you were in my room\n
							And now my bed sheets smell like you\n
							Every day, discoverin' somethin' brand new\n
							Well, I'm in love with your body`,
						]
					}
				]
			}
		},
  })

	const songs = await prisma.song.findMany({ include: { artist: true }})

	console.log(songs)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })