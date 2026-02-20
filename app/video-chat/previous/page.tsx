import CallList from "../_components/CallList"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous Calls</h1>

      <CallList type="ended" />
    </section>
  );
};

export default PreviousPage;
