import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class BaseDeDatos {
  constructor() {
    this.esWeb = false;
    this.db = null;
    this.prefix = 'ahorraplus_';
    this.inicializada = false;
    
    // Verificar si SQLite está disponible
    this.sqliteDisponible = typeof SQLite.openDatabase === 'function';
    console.log('DEBUG: SQLite disponible:', this.sqliteDisponible);
    
    this.inicializar();
  }

  async inicializar() {
    if (this.sqliteDisponible) {
      try {
        this.db = SQLite.openDatabase('ahorraplus.db');
        console.log('DEBUG: SQLite database opened');
        await this.inicializarSQLite();
        console.log('DEBUG: Usando SQLite');
      } catch (error) {
        console.error('Error SQLite:', error);
        this.sqliteDisponible = false;
        this.esWeb = true;
        console.log('DEBUG: Cambiando a AsyncStorage debido a error SQLite');
      }
    } else {
      console.log('DEBUG: SQLite no disponible, usando AsyncStorage');
      this.esWeb = true;
      this.inicializada = true;
    }
  }

  inicializarSQLite() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not available'));
        return;
      }

      this.db.transaction(
        tx => {
          // Tabla de usuarios
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS usuarios (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              usuario TEXT UNIQUE NOT NULL,
              correo TEXT UNIQUE NOT NULL,
              contraseña TEXT NOT NULL,
              creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
          );

          // Tabla de tokens de recuperación
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

          // Tabla de transacciones
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

          // Tabla de presupuestos
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

          // Tabla de presupuesto mensual
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
        },
        error => {
          console.error('Error en transacción de inicialización:', error);
          reject(error);
        },
        () => {
          console.log('DEBUG: Todas las tablas creadas/verificadas correctamente');
          this.inicializada = true;
          resolve();
        }
      );
    });
  }

  async ejecutarConsulta(sql, parametros = []) {
    // Si no está inicializada y debería usar SQLite, esperar
    if (!this.inicializada && this.sqliteDisponible) {
      console.log('DEBUG: Esperando inicialización de BD...');
      await this.inicializar();
    }

    // Si es web o SQLite no está disponible, usar AsyncStorage
    if (this.esWeb || !this.sqliteDisponible) {
      return this.ejecutarConsultaWeb(sql, parametros);
    }

    // Usar SQLite real
    return new Promise((resolver, rechazar) => {
      if (!this.db) {
        rechazar(new Error('Base de datos no disponible'));
        return;
      }

      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          parametros,
          (_, resultado) => {
            console.log('DEBUG SQLite Success:', sql);
            resolver(resultado);
          },
          (_, error) => {
            console.error('DEBUG SQLite Error:', error, 'SQL:', sql);
            rechazar(error);
          }
        );
      });
    });
  }

  async ejecutarConsultaWeb(sql, parametros = []) {
    console.log('DEBUG: Ejecutando consulta web:', sql, parametros);
    
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
    
    // Para otras operaciones, retornar resultado simulado
    return { 
      rows: { 
        length: 0, 
        item: () => null,
        _array: [] 
      }, 
      insertId: null,
      rowsAffected: 0 
    };
  }

  async insertarWeb(sql, parametros) {
    const tablaMatch = sql.match(/INSERT INTO\s+(\w+)/i);
    if (!tablaMatch) return { insertId: null };
    
    const tabla = tablaMatch[1];
    const id = Date.now().toString();
    const clave = `${this.prefix}${tabla}_${id}`;
    
    const datos = this.crearObjetoDatos(sql, parametros);
    datos.id = id;
    datos._tabla = tabla;
    datos._clave = clave;
    
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(datos));
      console.log('DEBUG: Insertado en AsyncStorage:', clave, datos);
      return { insertId: id, rowsAffected: 1 };
    } catch (error) {
      console.error('Error insertando en AsyncStorage:', error);
      return { insertId: null, rowsAffected: 0 };
    }
  }

  async seleccionarWeb(sql, parametros = []) {
    try {
      const claves = await AsyncStorage.getAllKeys();
      const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
      const items = await AsyncStorage.multiGet(clavesFiltradas);
      
      let resultados = items.map(([key, value]) => {
        try {
          const datos = JSON.parse(value);
          const tabla = key.replace(this.prefix, '').split('_')[0];
          datos._tabla = tabla;
          datos._clave = key;
          
          // Asegurar que tenga ID
          if (!datos.id) {
            const idMatch = key.match(/_(\d+)$/);
            if (idMatch) {
              datos.id = idMatch[1];
            } else {
              datos.id = key;
            }
          }
          
          return datos;
        } catch (error) {
          console.error('Error parseando item:', key, error);
          return null;
        }
      }).filter(Boolean);

      // Filtrar por tabla
      const tablaMatch = sql.match(/FROM\s+(\w+)/i);
      if (tablaMatch) {
        const tablaBuscada = tablaMatch[1];
        resultados = resultados.filter(item => item._tabla === tablaBuscada);
      }

      // Aplicar condiciones WHERE
      const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s*ORDER BY|\s*LIMIT|$)/i);
      if (whereMatch && parametros.length > 0) {
        const whereCondition = whereMatch[1].toLowerCase();
        resultados = this.aplicarCondicionesWhere(resultados, whereCondition, parametros);
      }

      console.log('DEBUG: Resultados selección:', resultados.length, 'elementos');
      
      return {
        rows: {
          length: resultados.length,
          item: (index) => resultados[index],
          _array: resultados
        }
      };
    } catch (error) {
      console.error('Error en seleccionarWeb:', error);
      return { rows: { length: 0, item: () => null, _array: [] } };
    }
  }

  aplicarCondicionesWhere(resultados, whereCondition, parametros) {
    return resultados.filter(item => {
      // usuario_id = ?
      if (whereCondition.includes('usuario_id = ?')) {
        const index = whereCondition.split('?').indexOf('') - 1;
        return item.usuario_id && item.usuario_id.toString() === parametros[index]?.toString();
      }
      
      // mes = ? AND año = ?
      if (whereCondition.includes('mes = ?') && whereCondition.includes('año = ?')) {
        const mesIndex = whereCondition.split('?').indexOf('') - 1;
        const añoIndex = mesIndex + 1;
        return item.mes === parametros[mesIndex] && item.año === parametros[añoIndex];
      }
      
      // tipo = ?
      if (whereCondition.includes('tipo = ?')) {
        const index = whereCondition.split('?').indexOf('') - 1;
        return item.tipo === parametros[index];
      }
      
      // categoria = ?
      if (whereCondition.includes('categoria = ?')) {
        const index = whereCondition.split('?').indexOf('') - 1;
        return item.categoria === parametros[index];
      }
      
      // fecha = ?
      if (whereCondition.includes('fecha = ?')) {
        const index = whereCondition.split('?').indexOf('') - 1;
        return item.fecha === parametros[index];
      }
      
      // usuario = ? o correo = ?
      if (whereCondition.includes('usuario = ?')) {
        return item.usuario === parametros[0];
      }
      if (whereCondition.includes('correo = ?')) {
        return item.correo === parametros[0];
      }
      
      // id = ?
      if (whereCondition.includes('id = ?')) {
        return item.id === parametros[0]?.toString();
      }
      
      return true;
    });
  }

  async actualizarWeb(sql, parametros) {
    try {
      const idMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
      if (!idMatch) {
        return { rowsAffected: 0 };
      }

      const id = parametros[parametros.length - 1]?.toString();

      const claves = await AsyncStorage.getAllKeys();
      const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
      const items = await AsyncStorage.multiGet(clavesFiltradas);
      
      for (const [clave, valor] of items) {
        try {
          const datos = JSON.parse(valor);
          if (datos.id === id || clave.includes(id)) {
            const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
            if (setMatch) {
              const setClause = setMatch[1];
              const updates = setClause.split(',').map(part => part.trim());
              
              updates.forEach((update, index) => {
                const [campo] = update.split('=').map(part => part.trim());
                if (parametros[index] !== undefined) {
                  datos[campo] = parametros[index];
                }
              });

              await AsyncStorage.setItem(clave, JSON.stringify(datos));
              console.log('DEBUG: Actualizado en AsyncStorage:', clave);
              return { rowsAffected: 1 };
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      return { rowsAffected: 0 };
    } catch (error) {
      console.error('Error en actualizarWeb:', error);
      return { rowsAffected: 0 };
    }
  }

  async eliminarWeb(sql, parametros) {
    try {
      const idMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
      if (!idMatch) {
        return { rowsAffected: 0 };
      }

      const id = parametros[0]?.toString();

      const claves = await AsyncStorage.getAllKeys();
      const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
      const items = await AsyncStorage.multiGet(clavesFiltradas);
      
      for (const [clave, valor] of items) {
        try {
          const datos = JSON.parse(valor);
          if (datos.id === id || clave.includes(id)) {
            await AsyncStorage.removeItem(clave);
            console.log('DEBUG: Eliminado de AsyncStorage:', clave);
            return { rowsAffected: 1 };
          }
        } catch (error) {
          continue;
        }
      }
      
      return { rowsAffected: 0 };
    } catch (error) {
      console.error('Error en eliminarWeb:', error);
      return { rowsAffected: 0 };
    }
  }

  crearObjetoDatos(sql, parametros) {
    let columnas = [];
    const columnasMatch = sql.match(/INSERT INTO\s+\w+\s*\(([^)]+)\)/i);
    
    if (columnasMatch) {
      columnas = columnasMatch[1].split(',').map(col => col.trim());
    } else {
      return { id: Date.now().toString() };
    }
    
    const datos = {};
    
    columnas.forEach((col, index) => {
      if (parametros[index] !== undefined) {
        datos[col] = parametros[index];
      }
    });
    
    // Convertir tipos numéricos
    if (datos.usuario_id) datos.usuario_id = parseInt(datos.usuario_id) || 0;
    if (datos.monto) datos.monto = parseFloat(datos.monto) || 0;
    if (datos.mes) datos.mes = parseInt(datos.mes) || 0;
    if (datos.año) datos.año = parseInt(datos.año) || 0;
    
    return datos;
  }

  async obtenerMultiples(sql, parametros = []) {
    try {
      console.log('DEBUG: Ejecutando obtenerMultiples:', sql, parametros);
      const resultado = await this.ejecutarConsulta(sql, parametros);
      const elementos = [];
      
      for (let i = 0; i < resultado.rows.length; i++) {
        elementos.push(resultado.rows.item(i));
      }
      
      console.log('DEBUG: Resultado obtenerMultiples:', elementos.length, 'elementos');
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

  async verificarTablas() {
    try {
      if (this.esWeb) {
        const claves = await AsyncStorage.getAllKeys();
        const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
        console.log('DEBUG: Claves en AsyncStorage:', clavesFiltradas);
        
        const items = await AsyncStorage.multiGet(clavesFiltradas);
        const datos = items.map(([key, value]) => {
          try {
            return { clave: key, datos: JSON.parse(value) };
          } catch (error) {
            return null;
          }
        }).filter(Boolean);
        
        return { 
          tablas: [...new Set(datos.map(item => item.datos._tabla))],
          datos: datos 
        };
      } else {
        const tablas = await this.obtenerMultiples(
          "SELECT name FROM sqlite_master WHERE type='table'"
        );
        
        const presupuestosMensuales = await this.obtenerMultiples(
          "SELECT * FROM presupuesto_mensual"
        );
        
        const presupuestos = await this.obtenerMultiples(
          "SELECT * FROM presupuestos"
        );
        
        return { tablas, presupuestosMensuales, presupuestos };
      }
    } catch (error) {
      console.error('Error verificando tablas:', error);
      return null;
    }
  }

  estaDisponible() {
    return true;
  }

  // Método para obtener el tipo de base de datos actual
  obtenerTipoBD() {
    return this.sqliteDisponible ? 'SQLite' : 'AsyncStorage';
  }
}

export default new BaseDeDatos();