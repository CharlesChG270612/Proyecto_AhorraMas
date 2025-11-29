import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BaseDeDatos {
  constructor() {
    this.esWeb = false;
    this.db = null;
    this.prefix = 'ahorraplus_';
    this.inicializada = false;
    
    this.inicializar();
  }

  async inicializar() {
    if (!this.esWeb) {
      try {
        this.db = SQLite.openDatabase('ahorraplus.db');
        console.log('DEBUG: SQLite database opened');
        await this.inicializarSQLite();
        console.log('DEBUG: Usando SQLite');
      } catch (error) {
        console.error('Error SQLite:', error);
        this.esWeb = true;
      }
    } else {
      console.log('Usando AsyncStorage para Web');
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
    if (!this.inicializada && !this.esWeb) {
      console.log('DEBUG: Esperando inicialización de BD...');
      await this.inicializarSQLite();
    }

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
          (_, error) => {
            console.error('DEBUG SQLite Error:', error);
            rechazar(error);
          }
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
    
    datos._tabla = tabla;
    
    await AsyncStorage.setItem(clave, JSON.stringify(datos));
    return { insertId: clave };
  }

  async seleccionarWeb(sql, parametros = []) {
    const claves = await AsyncStorage.getAllKeys();
    const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
    const items = await AsyncStorage.multiGet(clavesFiltradas);
    
    let resultados = items.map(([key, value]) => {
      try {
        const datos = JSON.parse(value);
        const tabla = key.replace(this.prefix, '').split('_')[0];
        datos._tabla = tabla;
        datos._clave = key;
        
        if (!datos.id && datos._clave) {
          const idMatch = datos._clave.match(/_(\d+)$/);
          if (idMatch) {
            datos.id = idMatch[1];
          }
        }
        
        return datos;
      } catch (error) {
        return null;
      }
    }).filter(Boolean);

    const tablaMatch = sql.match(/FROM\s+(\w+)/i);
    if (tablaMatch) {
      const tablaBuscada = tablaMatch[1];
      resultados = resultados.filter(item => item._tabla === tablaBuscada);
    }

    const whereMatch = sql.match(/WHERE\s+(.+)/i);
    if (whereMatch && parametros.length > 0) {
      const whereCondition = whereMatch[1].toLowerCase();
      
      resultados = resultados.filter(item => {
        if (whereCondition.includes('usuario_id = ?')) {
          const usuarioIdParam = parametros[0];
          const usuarioIdItem = item.usuario_id;
          
          const coincide = usuarioIdItem && usuarioIdItem.toString() === usuarioIdParam.toString();
          return coincide;
        }
        
        if (whereCondition.includes('mes = ?') && whereCondition.includes('año = ?')) {
          const usuarioIdIndex = whereCondition.includes('usuario_id = ?') ? 1 : 0;
          const mesIndex = usuarioIdIndex;
          const añoIndex = usuarioIdIndex + 1;
          return item.mes === parametros[mesIndex] && item.año === parametros[añoIndex];
        }
        
        if (whereCondition.includes('tipo = ?')) {
          const tipoIndex = parametros.findIndex((p, i) => whereCondition.includes('usuario_id = ?') ? i > 0 : i >= 0);
          return item.tipo === parametros[tipoIndex];
        }
        
        if (whereCondition.includes('categoria = ?')) {
          const categoriaIndex = parametros.findIndex((p, i) => whereCondition.includes('usuario_id = ?') ? i > 0 : i >= 0);
          return item.categoria === parametros[categoriaIndex];
        }
        
        if (whereCondition.includes('fecha = ?')) {
          const fechaIndex = parametros.findIndex((p, i) => whereCondition.includes('usuario_id = ?') ? i > 0 : i >= 0);
          return item.fecha === parametros[fechaIndex];
        }
        
        if (whereCondition.includes('usuario = ?')) {
          return item.usuario === parametros[0];
        }
        if (whereCondition.includes('correo = ?')) {
          return item.correo === parametros[0];
        }
        if (whereCondition.includes('id = ?')) {
          const idBuscado = parametros[0].toString();
          return item.id === idBuscado;
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
    const idMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
    if (!idMatch) {
      return { rowsAffected: 0 };
    }

    const idIndex = parametros.length - 1;
    const id = parametros[idIndex];

    const claves = await AsyncStorage.getAllKeys();
    const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
    const items = await AsyncStorage.multiGet(clavesFiltradas);
    
    let claveEncontrada = null;
    let datosActualizados = null;

    for (const [clave, valor] of items) {
      try {
        const datos = JSON.parse(valor);
        if (datos.id === id.toString() || datos._clave?.includes(id)) {
          claveEncontrada = clave;
          datosActualizados = datos;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!claveEncontrada || !datosActualizados) {
      return { rowsAffected: 0 };
    }

    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    if (!setMatch) {
      return { rowsAffected: 0 };
    }

    const setClause = setMatch[1];
    const updates = setClause.split(',').map(part => part.trim());

    updates.forEach(update => {
      const [campo, valorPlaceholder] = update.split('=').map(part => part.trim());
      if (valorPlaceholder === '?') {
        const campoIndex = updates.indexOf(update);
        if (parametros[campoIndex] !== undefined) {
          datosActualizados[campo] = parametros[campoIndex];
        }
      }
    });

    try {
      await AsyncStorage.setItem(claveEncontrada, JSON.stringify(datosActualizados));
      return { rowsAffected: 1 };
    } catch (error) {
      return { rowsAffected: 0 };
    }
  }

  async eliminarWeb(sql, parametros) {
    const idMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
    if (!idMatch) {
      return { rowsAffected: 0 };
    }

    const id = parametros[0];

    const claves = await AsyncStorage.getAllKeys();
    const clavesFiltradas = claves.filter(key => key.startsWith(this.prefix));
    const items = await AsyncStorage.multiGet(clavesFiltradas);
    
    let claveAEliminar = null;

    for (const [clave, valor] of items) {
      try {
        const datos = JSON.parse(valor);
        if (datos.id === id.toString() || datos._clave?.includes(id)) {
          claveAEliminar = clave;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!claveAEliminar) {
      return { rowsAffected: 0 };
    }

    try {
      await AsyncStorage.removeItem(claveAEliminar);
      return { rowsAffected: 1 };
    } catch (error) {
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
    } else {
      datos[col] = '';
    }
  });
  
  datos.id = Date.now().toString();
  
  // Convertir tipos numéricos
  if (datos.usuario_id) {
    datos.usuario_id = parseInt(datos.usuario_id);
  }
  if (datos.monto) {
    datos.monto = parseFloat(datos.monto);
  }
  if (datos.mes) {
    datos.mes = parseInt(datos.mes);
  }
  if (datos.año) {
    datos.año = parseInt(datos.año);
  }
  
  return datos;
}

  async obtenerMultiples(sql, parametros = []) {
    try {
      console.log('DEBUG SQLite Query:', sql, parametros);
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
      
      console.log('DEBUG SQLite Result:', elementos);
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
      const tablas = await this.obtenerMultiples(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      console.log('DEBUG: Tablas en SQLite:', tablas);
      
      const presupuestosMensuales = await this.obtenerMultiples(
        "SELECT * FROM presupuesto_mensual"
      );
      console.log('DEBUG: Presupuestos mensuales en SQLite:', presupuestosMensuales);
      
      const presupuestos = await this.obtenerMultiples(
        "SELECT * FROM presupuestos"
      );
      console.log('DEBUG: Presupuestos en SQLite:', presupuestos);
      
      return { tablas, presupuestosMensuales, presupuestos };
    } catch (error) {
      console.error('Error verificando tablas:', error);
      return null;
    }
  }

  estaDisponible() {
    return true;
  }
}

export default new BaseDeDatos();