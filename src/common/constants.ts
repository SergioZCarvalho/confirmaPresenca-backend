export const constants = {
  jwtConstants: {
    secret: process.env.JWT,
  },
  dbUrl: process.env.DBURL,
  r2: {
    accountId: process.env.ACCOUNT_ID,
    accessKey: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    googleMapsKey: process.env.GOOGLE_MAPS_KEY,
  },
};
