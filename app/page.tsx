import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href='/search'>Start Searching</Link>
    </main>
  );
}

export default Home;
