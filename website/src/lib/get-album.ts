import { DatabaseAlbums, DatabasePhotos } from "@/types/database";
import { knex, knexToObject, knexToObjects } from "./knex";

export type Album = {
  album: DatabaseAlbums | null;
  children: {
    albums: DatabaseAlbums[];
    photos: DatabasePhotos[];
  };
};

export namespace Lib_GetAlbum {
  export type byId = (id: number | null) => Promise<Album | null>;
  export type byPath = (names: string[]) => Promise<Album | null>;

  export const Id: byId = async (id) => {
    return {
      album: knexToObject(await knex("albums").where("id", id).first<DatabaseAlbums>()) ?? null,
      children: {
        albums: knexToObjects(await knex("albums").select<DatabaseAlbums[]>().where("parent", id)),
        photos: knexToObjects(await knex("photos").select<DatabasePhotos[]>().where("album", id)),
      },
    };
  };

  export const Path: byPath = async (names) => {
    return Id(null);
  };
}
