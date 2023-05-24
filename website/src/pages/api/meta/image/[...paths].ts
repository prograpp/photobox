import { knex } from "@/lib/knex";
import { withSessionRoute } from "@/lib/with-session";
import { DatabaseMedia } from "@/types/database";
import { join as joinPath } from "path";

export type Api_Meta_Image_$Paths_Get_200 = DatabaseMedia;

export default withSessionRoute({
  get: async (req, res) => {
    let path = joinPath(...(req.query.paths as string[]));
    console.log(path);

    let meta = await knex("media").select<DatabaseMedia>().where("path", path).first();
    if (meta === undefined) {
      return res.status(404).end();
    }

    res.status(200).json(meta);
  },
});
