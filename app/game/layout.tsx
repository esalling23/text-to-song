import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GameStateCtxProvider } from '@/context/index.jsx'
import DebugPanel from "../../components/debug/DebugPanel";

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
    <section className="relative h-full w-full">
			<GameStateCtxProvider>
				<DebugPanel />
				<div className="layout-container p-24 flex-center">
					{children}
				</div>
			</GameStateCtxProvider>
		</section>
  );
}

export default GameLayout
