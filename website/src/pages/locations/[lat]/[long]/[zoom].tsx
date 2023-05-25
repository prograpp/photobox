import { Component_Previews_Media } from "@/components/previews/media";
import { LatLong, getLocationsAround } from "@/lib/geo-tools";
import { knex, knexToObjects } from "@/lib/knex";
import { DatabaseMedia } from "@/types/database";
import { Anchor, Box, Breadcrumbs, Divider, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React, { useEffect, useMemo, useState } from "react";

type LatLongMedia = Omit<DatabaseMedia, "latitude" | "longitude"> & {
  latitude: number;
  longitude: number;
};

type AggregatedLatLongMedia = {
  dirname: string;
  items: LatLongMedia[];
};

type Props = {
  center: LatLong;
  zoom: number;
  media: LatLongMedia[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  let center: LatLong = {
    latitude: parseFloat(query.lat as string),
    longitude: parseFloat(query.long as string),
  };
  let zoom = parseInt(query.zoom as string);

  if (isNaN(center.latitude) || isNaN(center.longitude) || isNaN(zoom)) {
    return {
      notFound: true,
    };
  }

  let locations = knexToObjects(await knex("media").select<LatLongMedia[]>().whereNotNull("latitude").whereNotNull("longitude"));
  let aggregated = getLocationsAround(locations, center, zoom);

  return {
    props: {
      center: center,
      zoom: zoom,
      media: aggregated,
    },
  };
};

const Page: React.FC<Props> = (props) => {
  const [locationName, setLocationName] = useState<string | null>(null);

  const byDirectory = useMemo<AggregatedLatLongMedia[]>(() => {
    let directories = new Set<string>(props.media.map((item) => path.dirname(item.path)));

    return Array.from(directories).map((dirname) => ({
      dirname,
      items: props.media.filter((item) => path.dirname(item.path) === dirname),
    }));
  }, [props.media]);

  const getLocationName = (): void => {
    let url = new URL("reverse", "https://nominatim.openstreetmap.org/");
    url.searchParams.set("lat", props.center.latitude.toString());
    url.searchParams.set("lon", props.center.longitude.toString());
    url.searchParams.set("zoom", props.zoom.toString());
    url.searchParams.set("format", "jsonv2");

    axios
      .get(url.toString())
      .then((res) => {
        setLocationName(res.data.display_name);
      })
      .catch(() => {
        console.log("error fetching address");
      });
  };
  useEffect(getLocationName, [props.center]);

  return (
    <>
      <Head>
        <title>Locations @ PhotoBox</title>
        <meta name="description" content="A web-based photo management app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Stack>
          <Breadcrumbs>
            <Anchor component={Link} href="/locations">
              Locations
            </Anchor>

            <Text>{locationName ?? "Unknown Location"}</Text>
          </Breadcrumbs>

          <Divider />

          {byDirectory.map((item) => (
            <Stack key={item.dirname}>
              <Group>
                <Text size="lg">{item.dirname}</Text>
                <Text color="dimmed">{item.items.length} Bilder</Text>
              </Group>

              <Group pl="lg">
                {item.items.map((media) => (
                  <Component_Previews_Media key={media.path} path={[]} name={media.path} />
                ))}
              </Group>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Page;
