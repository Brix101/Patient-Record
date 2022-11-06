// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { prisma } from "@server/db/client";
import { NextApiRequest, NextApiResponse } from "next";

const patient = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const patient_id = req.query["patient"] as unknown as string;
    const data = await prisma.patient.findUnique({
      where: { id: parseInt(patient_id) },
    });
    res.send(data);
  }
};

export default patient;
