import { Component_Previews_Directory, PreviewDirectory } from "@/components/previews/directory";
import { Component_Previews_Media } from "@/components/previews/media";
import { getDirectoryContent, traverseFiles } from "@/lib/fs-tools";
import { Alert, Anchor, Box, Breadcrumbs, Center, Divider, Group, Stack, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { join as joinPath } from "path";
import React from "react";

type Props = {
  path: string[];
  directories: PreviewDirectory[];
  files: string[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const BASE = process.env.IMAGES_FULL ?? "/photobox/images";
  let path = query.path as string[];

  let content = getDirectoryContent(BASE, ...path);

  return {
    props: {
      path: path,
      directories: content.directories.map((directory) => ({
        name: directory,
        previews: traverseFiles(BASE, joinPath(...path, directory), 4),
      })),
      files: content.files,
    },
  };
};

const Page: React.FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>Albums @ PhotoBox</title>
        <meta name="description" content="A web-based photo management app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Stack>
          <Breadcrumbs>
            <Anchor component={Link} href="/photos">
              Photos
            </Anchor>

            {props.path.slice(0, -1).map((name, index) => (
              <Anchor component={Link} href={`/photos/${props.path.slice(0, index + 1).join("/")}`} key={name}>
                {name}
              </Anchor>
            ))}

            <Text>{props.path.at(-1)}</Text>
          </Breadcrumbs>

          <Divider />

          {props.directories.length === 0 && props.files.length === 0 && (
            <Center>
              <Alert color="teal">This directory is empty.</Alert>
            </Center>
          )}

          <Group>
            {props.directories.map((directory) => (
              <Component_Previews_Directory key={directory.name} path={props.path} directory={directory} />
            ))}

            {props.files.map((file) => (
              <Component_Previews_Media key={file} path={props.path} name={file} />
            ))}
          </Group>
        </Stack>
      </Box>
    </>
  );
};

export default Page;
