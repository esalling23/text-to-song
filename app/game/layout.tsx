import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GameStateCtxProvider } from '@/context/index.jsx'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playtime",
  description: "Play our games",
};
const GameLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section>
			<GameStateCtxProvider>
				{children}
			</GameStateCtxProvider>
		</section>
  );
}

export default GameLayout
