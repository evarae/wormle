import React from "react";
import { Link, Typography } from "@mui/material";

export const KOFI_LINK = "https://ko-fi.com/raemclean";

export default function DonationLink() {
  return (
    <Typography paddingTop={"24px"}>
      Having fun? <Link href={KOFI_LINK}>Support wormle here</Link>
    </Typography>
  );
}
