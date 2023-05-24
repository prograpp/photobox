import { Component_Previews_Directory, PreviewDirectory } from "@/components/previews/directory";
import { Component_Previews_Media } from "@/components/previews/media";
import { getDirectoryContent, traverseFiles } from "@/lib/fs-tools";
import { Box, Breadcrumbs, Divider, Group, Stack, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

type Props = {
  directories: PreviewDirectory[];
  files: string[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const BASE = process.env.IMAGES_FULL ?? "/photobox/images";

  let content = getDirectoryContent(BASE);

  return {
    props: {
      directories: content.directories.map((directory) => ({
        name: directory,
        previews: traverseFiles(BASE, directory, 4),
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
            <Text>Photos</Text>
          </Breadcrumbs>

          <Divider />

          <Group>
            {props.directories.map((directory) => (
              <Component_Previews_Directory key={directory.name} path={[]} directory={directory} />
            ))}

            {props.files.map((file) => (
              <Component_Previews_Media key={file} path={[]} name={file} />
            ))}
          </Group>
        </Stack>
      </Box>
    </>
  );
};

export default Page;
