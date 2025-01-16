import { StaticImageData } from 'next/image'

import volume from '@/assets/music_icons/audio_icon.png'
import cassette from '@/assets/music_icons/cassette.png'
import cd from '@/assets/music_icons/cd.png'
import guitar from '@/assets/music_icons/guitar.png'
import headphones from '@/assets/music_icons/headphones.png'
import ipod from '@/assets/music_icons/ipod.png'
import keyboard from '@/assets/music_icons/keyboard.png'
import levels from '@/assets/music_icons/levels.png'
import microphone from '@/assets/music_icons/microphone.png'
import note from '@/assets/music_icons/note.png'
import podcast from '@/assets/music_icons/podcast.png'
import radio from '@/assets/music_icons/radio.png'
import saxophone from '@/assets/music_icons/saxophone.png'
import speaker from '@/assets/music_icons/speaker.png'

import user from '@/assets/player/user.png'

interface PlayerIconsMap { 
	[key: string]: StaticImageData; 
}
const PlayerIcons: PlayerIconsMap = {
	volume,
	cassette,
	cd,
	guitar,
	headphones,
	ipod,
	keyboard,
	levels,
	microphone,
	note,
	podcast,
	radio,
	saxophone,
	speaker
}

export const EmptyPlayerIcon = user;

export default PlayerIcons