import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GameStateCtxProvider } from '@/context/index'
import DebugPanel from "../../components/debug/DebugPanel";
import ActionsBar from "../../components/game/ActionsBar";

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
		<section className="relative h-full w-full flex flex-col justify-center">
			<GameStateCtxProvider>
				<ActionsBar />
				<div className="layout-container flex-center relative pt-12">
					{children}
				</div>
			</GameStateCtxProvider>
		</section>
  );
}

export default GameLayout
