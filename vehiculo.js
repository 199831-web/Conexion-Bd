const DatabaseConnection = require('./DatabaseConnection');

class Vehiculo {
  constructor(placa = '', color = '', modelo = '', marca = '', tipo = '', usuarioId = null) {
    this._placa = placa;
    this._color = color;
    this._modelo = modelo;
    this._marca = marca;
    this._tipo = tipo;
    this._usuarioId = usuarioId;
    this._db = new DatabaseConnection();
  }


  get placa() {
    return this._placa;
  }

  get color() {
    return this._color;
  }

  get modelo() {
    return this._modelo;
  }

  get marca() {
    return this._marca;
  }

  get tipo() {
    return this._tipo;
  }

  get usuarioId() {
    return this._usuarioId;
  }

 
  set placa(placa) {
    this._placa = placa;
  }

  set color(color) {
    this._color = color;
  }

  set modelo(modelo) {
    this._modelo = modelo;
  }

  set marca(marca) {
    this._marca = marca;
  }

  set tipo(tipo) {
    this._tipo = tipo;
  }

  set usuarioId(usuarioId) {
    this._usuarioId = usuarioId;
  }

  
  toString() {
    return `Vehiculo [Placa: ${this._placa}, Color: ${this._color}, Modelo: ${this._modelo}, Marca: ${this._marca}, Tipo: ${this._tipo}, ID Usuario: ${this._usuarioId}]`;
  }


  async guardar() {
    try {
      const sql = 'INSERT INTO VEHICULO (placa, color, modelo, marca, tipo, USUARIO_id_usuario) VALUES (?, ?, ?, ?, ?, ?)';
      const params = [this._placa, this._color, this._modelo, this._marca, this._tipo, this._usuarioId];

      const result = await this._db.executeQuery(sql, params);
      await this._db.close();

      return {
        success: true,
        insertId: result.results.insertId,
        message: 'Vehiculo guardado exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error guardando vehiculo: ${error.message}`);
    }
  }

  
  async actualizar() {
    try {
      if (!this._placa) {
        throw new Error('No se puede actualizar un vehiculo sin placa');
      }

      const sql = 'UPDATE VEHICULO SET color = ?, modelo = ?, marca = ?, tipo = ?, USUARIO_id_usuario = ? WHERE placa = ?';
      const params = [this._color, this._modelo, this._marca, this._tipo, this._usuarioId, this._placa];

      const result = await this._db.executeQuery(sql, params);
      await this._db.close();

      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Vehiculo actualizado exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error actualizando vehiculo: ${error.message}`);
    }
  }

 
  async eliminar() {
    try {
      if (!this._placa) {
        throw new Error('No se puede eliminar un vehiculo sin placa');
      }

      const result = await this._db.executeQuery('DELETE FROM VEHICULO WHERE placa = ?', [this._placa]);
      await this._db.close();

      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Vehiculo eliminado exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error eliminando vehiculo: ${error.message}`);
    }
  }


  static async obtenerPorPlaca(placa) {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM VEHICULO WHERE placa = ?', [placa]);
      await db.close();

      if (result.results.length === 0) {
        return null;
      }

      const vehiculoData = result.results[0];
      return new Vehiculo(
        vehiculoData.placa,
        vehiculoData.color,
        vehiculoData.modelo,
        vehiculoData.marca,
        vehiculoData.tipo,
        vehiculoData.USUARIO_id_usuario
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo vehiculo por placa: ${error.message}`);
    }
  }

  
  static async obtenerTodos() {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM VEHICULO');
      await db.close();

      return result.results.map(vehiculoData =>
        new Vehiculo(
          vehiculoData.placa,
          vehiculoData.color,
          vehiculoData.modelo,
          vehiculoData.marca,
          vehiculoData.tipo,
          vehiculoData.USUARIO_id_usuario
        )
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo todos los vehiculos: ${error.message}`);
    }
  }

  static async buscarVehiculo(query) {
    const db = new DatabaseConnection();
    try {
      const sql = 'SELECT * FROM VEHICULO WHERE placa LIKE ? OR marca LIKE ? OR modelo LIKE ?';
      const params = [`%${query}%`, `%${query}%`, `%${query}%`];

      const result = await db.executeQuery(sql, params);
      await db.close();

      return result.results.map(vehiculoData =>
        new Vehiculo(
          vehiculoData.placa,
          vehiculoData.color,
          vehiculoData.modelo,
          vehiculoData.marca,
          vehiculoData.tipo,
          vehiculoData.USUARIO_id_usuario
        )
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error buscando vehiculos: ${error.message}`);
    }
  }

  static mostrarResultados(vehiculos, titulo = 'RESULTADOS DE VEHÍCULOS') {
    console.log(`\n=== ${titulo} ===`);
    console.log('Número de vehículos encontrados:', vehiculos.length);
    console.log('\nDatos:');

    vehiculos.forEach((vehiculo, index) => {
      console.log(`\nVehículo ${index + 1}:`);
      console.log(vehiculo.toString());
    });
  }
}

module.exports = Vehiculo;