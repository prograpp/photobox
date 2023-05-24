import fs from "fs";
import mime from "mime";
import path from "path";
import sharp from "sharp";

type AbsolutePaths = {
  full: string;
  thumb: string;
};

export const getAbsolutePaths = (...paths: string[]): AbsolutePaths => {
  const IMAGES_FULL = process.env.IMAGES_FULL ?? "/photobox/images";
  const IMAGES_THUMBS = process.env.IMAGES_THUMBS ?? "/photobox/thumbs";

  const fullPath = path.join(IMAGES_FULL, ...paths);

  const filename = path.basename(fullPath, path.extname(fullPath));
  const dirname = path.dirname(path.join(...paths));

  const thumbPath = path.join(IMAGES_THUMBS, dirname, filename + ".jpg");

  return {
    full: fullPath,
    thumb: thumbPath,
  };
};

export const createThumb = async (paths: AbsolutePaths): Promise<boolean> => {
  if (!fs.existsSync(paths.full)) {
    return false;
  }

  // if output directory does not exist, create it
  if (!fs.existsSync(path.dirname(paths.thumb))) {
    fs.mkdirSync(path.dirname(paths.thumb), { recursive: true });
  }

  let mimeType = mime.getType(paths.full);
  if (mimeType && mimeType.startsWith("image/")) {
    // create thumbsnail by cropping a 200x200 square from the center of the image
    await sharp(paths.full).resize(200, 200, { fit: "cover" }).toFile(paths.thumb);
    return true;
  } else if (mimeType && mimeType.startsWith("video/")) {
    // create thumbsnail by taking a frame from the middle of the video
    // TODO
  }

  return false;
};

export const getThumb = async (...parts: string[]): Promise<false | string> => {
  let paths = getAbsolutePaths(...parts);

  if (fs.existsSync(paths.thumb) || (await createThumb(paths))) {
    return paths.thumb;
  }
  return false;
};
