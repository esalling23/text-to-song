'use client';

import { useRouter } from "next/router"
import { useEffect } from "react";

const SongDetailsPage = () => {
	const router = useRouter();
	const id = router.query.slug;

	useEffect(() => {
		
	}, [])
}