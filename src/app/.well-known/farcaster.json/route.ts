import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      "header": "eyJmaWQiOiA4Njk5OTksICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      "payload": "eyJkb21haW4iOiAibGV2ZXJ0ei1iZWFuYnV6ei52ZXJjZWwuYXBwIn0",
      "signature": "cP7lg7KkNds_RNzNGIGu_ag_r2jJEoguj_RdOa4FtCcF15rVOusbF7GXkRBwahN1uG-qT3z_X81r9oKts_JKxBw"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
