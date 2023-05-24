import { createThumb, getAbsolutePaths } from "@/lib/thumb-tools";
import { NextApiHandler } from "next";
import fs from "fs";
import path from "path";
import { lstat } from "@/lib/fs-tools";

const IMAGES_FULL = process.env.IMAGES_FULL ?? "/photobox/full";

const createThumbs = async (relPath: string) => {
  let files = fs.readdirSync(path.join(IMAGES_FULL, relPath));

  for (let file of files) {
    let filePath = path.join(IMAGES_FULL, relPath, file);
    let fileStat = lstat(filePath);

    if (fileStat.isDirectory()) {
      // create thumbs for directory
      await createThumbs(path.join(relPath, file));
    } else if (fileStat.isFile()) {
      // create thumb for file
      await createThumb(getAbsolutePaths(relPath, file));
    }
  }
};

const handler: NextApiHandler = async (req, res) => {
  await createThumbs("/");
  res.status(204).end();
};

export default handler;
