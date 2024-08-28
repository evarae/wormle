import React, { useEffect } from "react";
import ReactGA from "react-ga4";

export default function GoogleAnalytics() {
  useEffect(() => {
    const analyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;

    if (analyticsId) {
      ReactGA.initialize(analyticsId);
      ReactGA.send({ hitType: "pageview", page: "index", title: "Wormle" });
    }
  }, []);

  return <></>;
}
