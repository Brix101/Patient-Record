import { searchnBillingchema } from "@/schema/billing.schema";
import { createRouter } from "@server/router/context";

export const billingRouter = createRouter().query("get-billings", {
  input: searchnBillingchema,
  async resolve({ ctx, input }) {
    const { name } = input;

    return await ctx.prisma.receipt.findMany({
      where: {
        medicalRecord: {
          patient: {
            OR: [
              { firstName: { contains: name ? name : "" } },
              { lastName: { contains: name ? name : "" } },
            ],
          },
        },
      },
      include: {
        medicalRecord: {
          include: {
            patient: true,
          },
        },
      },
    });
  },
});
