import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import JobForm from "../_components/JobForm";
import Spinner from "@/spinner";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { orgId: string };
};

export default async function NewListingForOrgPage(props: PageProps) {
  const session = await getServerSession(authOptions);
  const organizationId = props.params.orgId;

  if (!session?.user) {
    return (
      <p className="flex justify-center items-center">Please log in</p>
    );
  }

  const userId = (session.user as any)?._id ?? (session.user as any)?.id;
  if (!userId) {
    return (
      <p className="flex justify-center items-center">Invalid session</p>
    );
  }

  await connect();
  const userDoc = await UserModel.findById(userId).lean();
  if (!userDoc || Array.isArray(userDoc)) {
    return (
      <p className="flex justify-center items-center">User not found</p>
    );
  }

  const user = userDoc as { role?: string; orgs?: string[] };
  const isAdmin = user.role === "ADMIN";
  const orgs = user.orgs;
  const hasAccess = isAdmin && (orgs?.includes(organizationId) ?? false);

  if (!hasAccess) {
    return <Spinner />;
  }

  return <JobForm organizationId={organizationId} />;
}
