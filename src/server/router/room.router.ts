import {
  createRoomSchema,
  deleteRoomSchema,
  searchRoomSchema,
  updateRoomSchema,
} from "@/schema/room.schema";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const roomRouter = createProtectedRouter()
  .mutation("create-room", {
    input: createRoomSchema,
    resolve: async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.room.create({
          data: {
            ...input,
          },
        });

        return user;
      } catch (e) {
        console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("get-rooms", {
    input: searchRoomSchema,
    async resolve({ ctx, input }) {
      const { searchInput } = input;
      if (ctx.session) {
        const rooms = await ctx.prisma.room.findMany({
          where: {
            OR: [
              { floor: { contains: searchInput ? searchInput : "" } },
              { roomNo: { contains: searchInput ? searchInput : "" } },
            ],
          },
          orderBy: {
            floor: "asc",
          },
        });
        return rooms;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  })
  .mutation("update-user", {
    input: updateRoomSchema,
    resolve: async ({ input, ctx }) => {
      const { category, floor, id, price, roomNo, station, status } = input;

      try {
        const room = await ctx.prisma.room.update({
          where: {
            id: id,
          },
          data: {
            category,
            floor,
            price,
            roomNo,
            station,
            status,
          },
        });
        return room;
      } catch (e) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-room", {
    input: deleteRoomSchema,
    resolve: async ({ ctx, input }) => {
      const { role } = ctx.session.user;

      if (role === Role.ADMIN) {
        const deletedRoom = await ctx.prisma.room.delete({
          where: {
            id: input.id,
          },
        });
        return { detail: "Room Deleted", deletedRoom };
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid Room",
      });
    },
  });