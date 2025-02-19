import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/Navigation";
import Head from "next/head";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
			<Head>
        <title></title>
      </Head>
      <body className={classNames(
				inter.className, 
				"h-screen w-screen flex flex-col"
			)}>
				<Navigation />
				<main className="grow">
					{children}
				</main>
			</body>
    </html>
  );
}
