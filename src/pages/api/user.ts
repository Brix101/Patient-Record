// src/pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email,
      },
    });
    res.status(200).json({ user });
  }
};

export default user;
