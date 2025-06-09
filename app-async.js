const mysql = require('mysql2/promise');

async function conectarYConsultar() {
  let connection;
  
  try {
    // Crear conexión
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 8889,
      user: 'root',        // Cambia por tu usuario
      password: 'root', // Cambia por tu contraseña
      database: 'ParkingLot'  // Cambia por tu base de datos
    });
    
    console.log('Conectado a MySQL exitosamente');
    
    // Ejecutar consulta
    const query = 'SELECT * FROM USUARIO LIMIT 10'; // Cambia por tu consulta
    const [results, fields] = await connection.execute(query);
    
    // Mostrar resultados
    console.log('\n=== RESULTADOS DE LA CONSULTA ===');
    console.log('Número de registros encontrados:', results.length);
    console.log('\nDatos:');
    
    results.forEach((row, index) => {
      console.log(`\nRegistro ${index + 1}:`);
      console.log(row);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Cerrar conexión
    if (connection) {
      await connection.end();
      console.log('\nConexión cerrada correctamente.');
    }
  }
}

// Ejecutar la función
conectarYConsultar();