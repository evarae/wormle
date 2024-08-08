import React from "react";
import { Link, Typography } from "@mui/material";

export const KOFI_LINK = "https://ko-fi.com/raemclean";

export default function DonationLink() {
  return (
    <Typography>
      Having fun? <Link href={KOFI_LINK}>Support wormle here</Link>
    </Typography>
  );
}
