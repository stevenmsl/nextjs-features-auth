import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { GetServerSideProps } from "next";
import UserProfile from "../components/profile/user-profile";

interface ProfilePageProps {
  session: Session;
}

const ProfilePage = () => {
  return <UserProfile />;
};

/* #TA06 */
export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (
  context
) => {
  const session = await getSession({ req: context.req });

  /* #REF03 */
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProfilePage;
