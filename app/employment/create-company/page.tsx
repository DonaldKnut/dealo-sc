import Image from "next/image";
import Link from "next/link";
import CreateCompanyPage from "./_components/CreateCompanyPage"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const Page = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        {/* <div className="sub-container flex-1 flex-col">
          <Link href="/">
            <Image
              src="/DEALO_ICON.png"
              height={120}
              width={120}
              alt="Logo"
              className="mb-3"
            />
          </Link>
        </div> */}
        <CreateCompanyPage />
        <p className="copyright py-12">© 2025 Dealo Talent Network</p>
      </section>
      <Image
        src="/abstract-gravity-wave-background.png"
        height={1000}
        width={1000}
        alt="Doctor"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Page;
