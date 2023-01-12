import { RoomCat, RoomStatus } from "@prisma/client";
import z from "zod";

export const createRoomSchema = z.object({
  roomNo: z.string(),
  category: z.nativeEnum(RoomCat),
  station: z.string(),
  status: z.nativeEnum(RoomStatus),
  floor: z.string(),
  price: z.number(),
});

export const updateRoomSchema = z.object({
  id: z.number(),
  roomNo: z.string().nullish(),
  category: z.nativeEnum(RoomCat),
  station: z.string().nullish(),
  status: z.nativeEnum(RoomStatus),
  floor: z.string().nullish(),
  price: z.number(),
});

export const deleteRoomSchema = z.object({
  id: z.number(),
});

export const searchRoomSchema = z.object({
  searchInput: z.string().optional(),
  category: z.nativeEnum(RoomCat).optional(),
});

export type CreateRoomInput = z.TypeOf<typeof createRoomSchema>;

export type SearchRoomInput = z.TypeOf<typeof searchRoomSchema>;

export type UpdateRoomInput = z.TypeOf<typeof updateRoomSchema>;

export type DeleteRoomInput = z.TypeOf<typeof deleteRoomSchema>;
