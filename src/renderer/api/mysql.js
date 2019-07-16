import mysql from 'mysql'

export async function connect(params) {
  const { host, user, port, database, password } = params
  const connection = mysql.createConnection({
    host,
    port,
    database,
    user,
    password
  })
  return await new Promise((resolve, reject) => {
    connection.connect(function(err) {
      if (err) {
        reject(err.stack)
      }
      resolve(connection)
    })
  }).then((connection) => {
    return { connection, err: null }
  }).catch((err) => {
    return { connection, err }
  })
}
