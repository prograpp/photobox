import { withSessionRoute } from "@/lib/with-session";
import { createReadStream, existsSync, statSync } from "fs";
import { join as joinPath } from "path";

const IMAGES_FULL = process.env.IMAGES_FULL ?? "/photobox/images";

export default withSessionRoute({
  get: async (req, res) => {
    let path = req.query.path as string[];
    let fullPath = joinPath(IMAGES_FULL, ...path);

    if (!existsSync(fullPath)) {
      return res.status(404).end();
    }

    let stat = statSync(fullPath);
    res.writeHead(200, {
      "Content-Length": stat.size,
    });
    createReadStream(fullPath).pipe(res);
  },
});
