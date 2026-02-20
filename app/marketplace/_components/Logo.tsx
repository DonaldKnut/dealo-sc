import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <div>
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/dealo_logo.png"
        alt="Dealo logo"
        width={120}
        height={120}
        className="w-12 h-12 lg:w-16 lg:h-16"
      />
      <span className="text-lg font-bold text-white hidden sm:block">
        Dealo
      </span>
    </Link>
  </div>
);

export default Logo;
