module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a0d3f2c14f7aaae55653571fcd15feb6'),
  },
});
