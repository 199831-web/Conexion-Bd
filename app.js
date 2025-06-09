const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,        // Cambia por el puerto de tu servidor MySQL
  user: 'oscar',        // Cambia por tu usuario de MySQL
  password: 'Oscar123456', // Cambia por tu contraseña
  database: 'ParkingLot'  // Cambia por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a MySQL como ID:', connection.threadId);
  
  // Ejecutar consulta de selección
  ejecutarConsulta();
});

function ejecutarConsulta() {
  // Ejemplo de consulta SELECT
  const query = 'select * from usuario'; // Cambia por tu consulta
  
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err.message);
      return;
    }
    
    console.log('\n=== RESULTADOS DE LA CONSULTA ===');
    console.log('Número de registros encontrados:', results.length);
    console.log('\nDatos:');
    
    // Mostrar cada resultado
    results.forEach((row, index) => {
      console.log(`\nRegistro ${index + 1}:`);
      console.log(row);
    });
    
    // Cerrar la conexión
    connection.end((err) => {
      if (err) {
        console.error('Error cerrando la conexión:', err.message);
      } else {
        console.log('\nConexión cerrada correctamente.');
      }
    });
  });
}

// Manejar errores de conexión
connection.on('error', (err) => {
  console.error('Error de conexión:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Conexión perdida, reconectando...');
  }
});