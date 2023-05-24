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
    let range = req.headers.range;

    if (range) {
      let parts = range.replace(/bytes=/, "").split("-");
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      let chunksize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
      });
      createReadStream(fullPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
      });
      createReadStream(fullPath).pipe(res);
    }
  },
});
