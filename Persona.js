const DatabaseConnection = require('./DatabaseConnection');

class Persona {
  constructor(id = null, primerNombre = '', primerApellido = '', edad = 0, telefono = '', correo = '') {
    this._id = id;
    this._primerNombre = primerNombre;
    this._primerApellido = primerApellido;
    this._edad = edad;
    this._telefono = telefono;
    this._correo = correo;
    this._db = new DatabaseConnection();
  }

  // Getters
  get id() {
    return this._id;
  }

  get primerNombre() {
    return this._primerNombre;
  }

  get primerApellido() {
    return this._primerApellido;
  }

  get edad() {
    return this._edad;
  }

  get telefono() {
    return this._telefono;
  }

  get correo() {
    return this._correo;
  }

  // Setters
  set id(id) {
    this._id = id;
  }

  set primerNombre(primerNombre) {
    this._primerNombre = primerNombre;
  }

  set primerApellido(primerApellido) {
    this._primerApellido = primerApellido;
  }

  set edad(edad) {
    if (edad >= 0) {
      this._edad = edad;
    } else {
      throw new Error('La edad debe ser un número positivo');
    }
  }

  set telefono(telefono) {
    this._telefono = telefono;
  }

  set correo(correo) {
    this._correo = correo;
  }

  // Método para mostrar información completa de la persona
  toString() {
    return `Persona [ID: ${this._id}, Nombre: ${this._primerNombre} ${this._primerApellido}, Edad: ${this._edad}, Teléfono: ${this._telefono}, Correo: ${this._correo}]`;
  }

  // Método para obtener el nombre completo
  getNombreCompleto() {
    return `${this._primerNombre} ${this._primerApellido}`;
  }

  // Método para validar si el correo tiene formato válido (básico)
  validarCorreo() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this._correo);
  }

  // ================== MÉTODOS DE BASE DE DATOS ==================

  // Método para guardar la persona en la base de datos
  async guardar() {
    try {
      const sql = 'INSERT INTO usuario (primerNombre, primerApellido, edad, telefono, correo) VALUES (?, ?, ?, ?, ?)';
      const params = [this._primerNombre, this._primerApellido, this._edad, this._telefono, this._correo];
      
      const result = await this._db.executeQuery(sql, params);
      
      // Actualizar el ID de la persona con el ID generado
      this._id = result.results.insertId;
      
      await this._db.close();
      
      return {
        success: true,
        insertId: this._id,
        message: 'Persona guardada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error guardando persona: ${error.message}`);
    }
  }

  // Método para actualizar la persona en la base de datos
  async actualizar() {
    try {
      if (!this._id) {
        throw new Error('No se puede actualizar una persona sin ID');
      }

      const sql = 'UPDATE usuario SET primerNombre = ?, primerApellido = ?, edad = ?, telefono = ?, correo = ? WHERE id = ?';
      const params = [this._primerNombre, this._primerApellido, this._edad, this._telefono, this._correo, this._id];
      
      const result = await this._db.executeQuery(sql, params);
      await this._db.close();
      
      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Persona actualizada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error actualizando persona: ${error.message}`);
    }
  }

  // Método para eliminar la persona de la base de datos
  async eliminar() {
    try {
      if (!this._id) {
        throw new Error('No se puede eliminar una persona sin ID');
      }

      const result = await this._db.executeQuery('DELETE FROM usuario WHERE id = ?', [this._id]);
      await this._db.close();
      
      return {
        success: true,
        affectedRows: result.results.affectedRows,
        message: 'Persona eliminada exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error eliminando persona: ${error.message}`);
    }
  }

  // Método estático para obtener una persona por ID
  static async obtenerPorId(id) {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM usuario WHERE id = ?', [id]);
      await db.close();
      
      if (result.results.length === 0) {
        return null;
      }
      
      const userData = result.results[0];
      return new Persona(
        userData.id,
        userData.primerNombre,
        userData.primerApellido,
        userData.edad,
        userData.telefono,
        userData.correo
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo persona por ID: ${error.message}`);
    }
  }

  // Método estático para obtener todas las personas
  static async obtenerTodas() {
    const db = new DatabaseConnection();
    try {
      const result = await db.executeQuery('SELECT * FROM usuario');
      await db.close();
      
      return result.results.map(userData => 
        new Persona(
          userData.id,
          userData.primerNombre,
          userData.primerApellido,
          userData.edad,
          userData.telefono,
          userData.correo
        )
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error obteniendo todas las personas: ${error.message}`);
    }
  }

  // Método estático para buscar personas por nombre
  static async buscarPorNombre(nombre) {
    const db = new DatabaseConnection();
    try {
      const sql = 'SELECT * FROM usuario WHERE primerNombre LIKE ? OR primerApellido LIKE ?';
      const params = [`%${nombre}%`, `%${nombre}%`];
      
      const result = await db.executeQuery(sql, params);
      await db.close();
      
      return result.results.map(userData => 
        new Persona(
          userData.id,
          userData.primerNombre,
          userData.primerApellido,
          userData.edad,
          userData.telefono,
          userData.correo
        )
      );
    } catch (error) {
      await db.close();
      throw new Error(`Error buscando personas por nombre: ${error.message}`);
    }
  }

  // Método estático para mostrar resultados formateados
  static mostrarResultados(personas, titulo = 'RESULTADOS') {
    console.log(`\n=== ${titulo} ===`);
    console.log('Número de personas encontradas:', personas.length);
    console.log('\nDatos:');
    
    personas.forEach((persona, index) => {
      console.log(`\nPersona ${index + 1}:`);
      console.log(persona.toString());
    });
  }

  // Método para cargar datos desde la base de datos
  async cargarDesdeBD() {
    try {
      if (!this._id) {
        throw new Error('No se puede cargar una persona sin ID');
      }

      const result = await this._db.executeQuery('SELECT * FROM usuario WHERE id = ?', [this._id]);
      await this._db.close();
      
      if (result.results.length === 0) {
        throw new Error('Persona no encontrada en la base de datos');
      }
      
      const userData = result.results[0];
      this._primerNombre = userData.primerNombre;
      this._primerApellido = userData.primerApellido;
      this._edad = userData.edad;
      this._telefono = userData.telefono;
      this._correo = userData.correo;
      
      return {
        success: true,
        message: 'Datos cargados exitosamente'
      };
    } catch (error) {
      await this._db.close();
      throw new Error(`Error cargando datos: ${error.message}`);
    }
  }
}

// Exportar la clase para uso en otros archivos
module.exports = Persona; 