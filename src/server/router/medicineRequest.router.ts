import {
  createMedicineReqSchema,
  deleteMedicineReqSchema,
} from "@/schema/medicineRequest.schema";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const medicineRequestRouter = createProtectedRouter()
  .mutation("add-medicineReq", {
    input: createMedicineReqSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const { quantity, medicalRecordId, medicineId } = input;
        const newReq = await ctx.prisma.medicineRequest.create({
          data: {
            quantity,
            MedicalRecord: {
              connect: {
                id: medicalRecordId,
              },
            },
            medicine: {
              connect: {
                id: medicineId,
              },
            },
          },
          include: {
            medicine: true,
          },
        });

        return newReq;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-medicineReq", {
    input: deleteMedicineReqSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const { id } = input;
        const deletedReq = await ctx.prisma.medicineRequest.delete({
          where: {
            id,
          },
        });

        return deletedReq;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  });
