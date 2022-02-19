export interface Config {
  database: MongoConfig;
}

export interface MongoConfig {
  host: string;
  port: string;
  db: string;
  user: string;
  password: string;
}

export default (): Config => {
  if (process.env.NODE_ENV === 'test') {
    return {
      database: {
        user: 'root',
        password: 'root',
        host: '127.0.0.1',
        port: '27018',
        db: 'admin',
      },
    };
  }
  // process.env.NODE_ENV === 'develop'
  return {
    database: {
      user: 'root',
      password: 'root',
      host: '127.0.0.1',
      port: '27017',
      db: 'admin',
    },
  };
};
