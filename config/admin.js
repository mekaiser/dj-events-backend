module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '629ad9f24f6feea2568fc3d892ef63fe'),
  },
});
