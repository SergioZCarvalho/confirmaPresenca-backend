export const constants = {
  jwtConstants: {
    secret: process.env.JWT || 'd903hdwwdssj13u9dj1hd391yu2198e',
  },
  dbUrl:
    process.env.DBURL ||
    'postgres://xszgtqnd:PCL9yZMitQB9Dy5-hK5H3dpLiFsw4W4w@silly.db.elephantsql.com/xszgtqnd',
};
