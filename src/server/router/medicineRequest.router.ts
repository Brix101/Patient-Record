import { createMedicineReqSchema } from "@/schema/medicineRequest.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const medicineRequestRouter = createProtectedRouter();
