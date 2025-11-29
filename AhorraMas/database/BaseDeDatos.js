import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isSQLiteAvailable = () => {
  return SQLite && typeof SQLite.openDatabase === 'function';
};

class BaseDeDatos {
  constructor() {
    this.esWeb = !isSQLiteAvailable();
    this.db = null;
    this.prefix = 'ahorraplus_';
    
    if (!this.esWeb) {
      try {
        this.db = SQLite.openDatabase('ahorraplus.db');
        this.inicializarSQLite();
      } catch (error) {
        console.error('Error SQLite:', error);
        this.esWeb = true;
      }
    } else {
      console.log('Usando AsyncStorage para Web');
    }
  }

  inicializarSQLite() {
    if (!this.db) return;

    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario TEXT UNIQUE NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          contraseña TEXT NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tokens_recuperacion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expiracion DATETIME NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          nombre TEXT NOT NULL,
          categoria TEXT NOT NULL,
          descripcion TEXT,
          monto REAL NOT NULL,
          tipo TEXT NOT NULL CHECK(tipo IN ('ingreso', 'gasto')),
          fecha TEXT NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          servicio_nombre TEXT NOT NULL,
          empresa TEXT NOT NULL,
          tipo_monto TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS presupuesto_mensual (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          monto REAL NOT NULL,
          mes INTEGER NOT NULL,
          año INTEGER NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
          UNIQUE(usuario_id, mes, año)
        );`
      );
    });
  }

  async ejecutarConsulta(sql, parametros = []) {
    if (this.esWeb) {
      return this.ejecutarConsultaWeb(sql, parametros);
    }

    return new Promise((resolver, rechazar) => {
      if (!this.db) {
        rechazar(new Error('Base de datos no disponible'));
        return;
      }

      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          parametros,
          (_, resultado) => resolver(resultado),
          (_, error) => rechazar(error)
        );
      });
    });
  }

  async ejecutarConsultaWeb(sql, parametros = []) {
    const operacion = sql.trim().toUpperCase().split(' ')[0];
    
    if (operacion === 'INSERT') {
      return this.insertarWeb(sql, parametros);
    } else if (operacion === 'SELECT') {
      return this.seleccionarWeb(sql, parametros);
    } else if (operacion === 'UPDATE') {
      return this.actualizarWeb(sql, parametros);
    } else if (operacion === 'DELETE') {
      return this.eliminarWeb(sql, parametros);
    }
    
    return { rows: { length: 0, item: () => null }, insertId: Date.now() };
  }

  async insertarWeb(sql, parametros) {
    const tablaMatch = sql.match(/INSERT INTO\s+(\w+)/i);
    if (!tablaMatch) return { insertId: null };
    
    const tabla = tablaMatch[1];
    const clave = `${this.prefix}${tabla}_${Date.now()}`;
    const datos = this.crearObjetoDatos(sql, parametros);
    
    await AsyncStorage.setItem(clave, JSON.stringify(datos));
    return { insertId: clave };
  }

  async seleccionarWeb(sql, parametros = []) {
    const claves = await AsyncStorage.getAllKeys();
    const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
    const items = await AsyncStorage.multiGet(clavesFiltradas);
    
    let resultados = items.map(([key, value]) => JSON.parse(value));

    const whereMatch = sql.match(/WHERE\s+(.+)/i);
    if (whereMatch && parametros.length > 0) {
      const whereCondition = whereMatch[1].toLowerCase();
      
      resultados = resultados.filter(item => {
        if (whereCondition.includes('usuario = ?')) {
          return item.usuario === parametros[0];
        }
        if (whereCondition.includes('correo = ?')) {
          return item.correo === parametros[0];
        }
        if (whereCondition.includes('id = ?')) {
          return item.id === parametros[0].toString();
        }
        return true;
      });
    }

    return {
      rows: {
        length: resultados.length,
        item: (index) => resultados[index]
      }
    };
  }

  async actualizarWeb(sql, parametros) {
    return { rowsAffected: 1 };
  }

  async eliminarWeb(sql, parametros) {
    return { rowsAffected: 1 };
  }

  crearObjetoDatos(sql, parametros) {
    const columnasMatch = sql.match(/INSERT INTO \w+ \(([^)]+)\)/i);
    if (!columnasMatch) return { id: Date.now().toString() };
    
    const columnas = columnasMatch[1].split(',').map(col => col.trim());
    const datos = {};
    
    columnas.forEach((col, index) => {
      datos[col] = parametros[index] !== undefined ? parametros[index] : '';
    });
    
    datos.id = Date.now().toString();
    return datos;
  }

  async obtenerMultiples(sql, parametros = []) {
    try {
      const resultado = await this.ejecutarConsulta(sql, parametros);
      const elementos = [];
      
      if (this.esWeb) {
        for (let i = 0; i < resultado.rows.length; i++) {
          elementos.push(resultado.rows.item(i));
        }
      } else {
        for (let i = 0; i < resultado.rows.length; i++) {
          elementos.push(resultado.rows.item(i));
        }
      }
      
      return elementos;
    } catch (error) {
      console.error('Error en obtenerMultiples:', error);
      return [];
    }
  }

  async obtenerUno(sql, parametros = []) {
    try {
      const elementos = await this.obtenerMultiples(sql, parametros);
      return elementos.length > 0 ? elementos[0] : null;
    } catch (error) {
      console.error('Error en obtenerUno:', error);
      return null;
    }
  }

  estaDisponible() {
    return true;
  }
}

export default new BaseDeDatos();