import fs from "fs";
import { join as joinPath } from "path";

export const lstat = (...path: string[]): fs.Stats => {
  let fullPath = joinPath(...path);

  let fileStat = fs.lstatSync(fullPath);
  while (fileStat.isSymbolicLink()) {
    let target = fs.readlinkSync(fullPath);
    fileStat = fs.lstatSync(target);
  }
  return fileStat;
};

export type DirectoryContent = {
  directories: string[];
  files: string[];
};

type FileDirectory = [string, boolean];

export const getDirectoryContent = (...path: string[]): DirectoryContent => {
  let content = fs.readdirSync(joinPath(...path)).map((file) => [file, lstat(...path, file).isDirectory()] as FileDirectory);

  return {
    directories: content.filter(([, isDirectory]) => isDirectory).map(([file]) => file),
    files: content.filter(([, isDirectory]) => !isDirectory).map(([file]) => file),
  };
};

export const traverseFiles = (base: string, path: string, max?: number): string[] => {
  let result: string[] = [];
  let queue: string[] = [path];

  while (queue.length > 0 && (!max || result.length < max)) {
    let head = queue.shift()!;
    let content = getDirectoryContent(base, head);

    result.push(...content.files.map((file) => joinPath(head, file)));
    queue.push(...content.directories.map((dir) => joinPath(head, dir)));
  }

  return result.slice(0, max);
};
