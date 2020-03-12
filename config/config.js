const { env } = process;
console.log(env.NODE_ENV);

const config = {
  env: env.NODE_ENV || 'development'
};

const devConfig = {
  db: 'mongodb://localhost:27017/data-remgika',
  jwt_key: 'remgika'
};  

const prodConfig = {
  db:
    'mongodb+srv://prince:6WwnujYhMW22HRxU@cluster0-3o6jr.mongodb.net/test?retryWrites=true&w=majority',
  jwt_key: 'remgika'
};

const currentConfig = config.env === 'production' ? prodConfig : devConfig;
module.exports = Object.assign({}, config, currentConfig);
