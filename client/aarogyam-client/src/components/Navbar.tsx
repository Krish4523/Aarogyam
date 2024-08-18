import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Navbar() {
  const navItems = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Explore", path: "/explore" },
    { id: 3, name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex items-center justify-between w-full p-4 shadow-sm">
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" alt="Aarogyam Logo" width={180} height={50} />
        <nav>
          <ul className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link href={item.path} key={item.id}>
                <li className="hover:text-primary hover:cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <Button>Login</Button>
    </div>
  );
}

export default Navbar;
