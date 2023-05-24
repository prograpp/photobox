import { getThumb } from "@/lib/thumb-tools";
import { withSessionRoute } from "@/lib/with-session";
import { createReadStream, statSync } from "fs";

export default withSessionRoute({
  get: async (req, res) => {
    let relPath = req.query.path as string[];
    let thumb = await getThumb(...relPath);

    if (thumb === false) {
      return res.status(404).end();
    }

    let stat = statSync(thumb);
    res.writeHead(200, {
      "Content-Length": stat.size,
    });
    createReadStream(thumb).pipe(res);
  },
});
