import { knex, knexToObjects } from "@/lib/knex";
import { Box } from "@mantine/core";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const Map = dynamic(() => import("@/components/locations/map"), { ssr: false });

export type MediaLocation = {
  path: string;
  latitude: number;
  longitude: number;
};

type Props = {
  locations: MediaLocation[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      locations: knexToObjects(
        await knex("media").select<MediaLocation[]>("path", "latitude", "longitude").whereNotNull("latitude").whereNotNull("longitude")
      ),
    },
  };
};

const Page: React.FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>Locations @ PhotoBox</title>
        <meta name="description" content="A web-based photo management app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Map locations={props.locations} />
      </Box>
    </>
  );
};

export default Page;
