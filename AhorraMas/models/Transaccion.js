import BaseDeDatos from '../database/BaseDeDatos';

class Transaccion {
  async crear(datosTransaccion) {
    const { usuario_id, nombre, categoria, descripcion, monto, tipo, fecha } = datosTransaccion;
    
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        `INSERT INTO transacciones 
        (usuario_id, nombre, categoria, descripcion, monto, tipo, fecha) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id, nombre, categoria, descripcion, monto, tipo, fecha]
      );
      return { exito: true, idInsertado: resultado.insertId };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async obtenerPorUsuarioId(usuarioId, filtros = {}) {
    try {
      let sql = 'SELECT * FROM transacciones WHERE usuario_id = ?';
      let parametros = [usuarioId];

      if (filtros.tipo && filtros.tipo !== 'todos') {
        sql += ' AND tipo = ?';
        parametros.push(filtros.tipo);
      }

      if (filtros.categoria && filtros.categoria !== 'todas') {
        sql += ' AND categoria = ?';
        parametros.push(filtros.categoria);
      }

      if (filtros.fecha && filtros.fecha !== 'todas') {
        sql += ' AND fecha = ?';
        parametros.push(filtros.fecha);
      }

      sql += ' ORDER BY creado_en DESC';

      const transacciones = await BaseDeDatos.obtenerMultiples(sql, parametros);
      return transacciones;
    } catch (error) {
      throw error;
    }
  }

  async actualizar(id, datosTransaccion) {
    const { nombre, categoria, descripcion, monto, tipo } = datosTransaccion;
    
    try {
      await BaseDeDatos.ejecutarConsulta(
        `UPDATE transacciones 
        SET nombre = ?, categoria = ?, descripcion = ?, monto = ?, tipo = ?
        WHERE id = ?`,
        [nombre, categoria, descripcion, monto, tipo, id]
      );
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async eliminar(id) {
    try {
      await BaseDeDatos.ejecutarConsulta('DELETE FROM transacciones WHERE id = ?', [id]);
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async obtenerEstadisticasPorPeriodo(usuarioId, periodo) {
    try {
      let filtroFecha = '';
      switch (periodo) {
        case 'dia':
          filtroFecha = "AND fecha = date('now')";
          break;
        case 'mes':
          filtroFecha = "AND strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now')";
          break;
        case 'año':
          filtroFecha = "AND strftime('%Y', fecha) = strftime('%Y', 'now')";
          break;
      }

      const ingresos = await BaseDeDatos.obtenerMultiples(
        `SELECT categoria, SUM(monto) as total 
         FROM transacciones 
         WHERE usuario_id = ? AND tipo = 'ingreso' ${filtroFecha}
         GROUP BY categoria`,
        [usuarioId]
      );

      const gastos = await BaseDeDatos.obtenerMultiples(
        `SELECT categoria, SUM(monto) as total 
         FROM transacciones 
         WHERE usuario_id = ? AND tipo = 'gasto' ${filtroFecha}
         GROUP BY categoria`,
        [usuarioId]
      );

      return { ingresos, gastos };
    } catch (error) {
      throw error;
    }
  }
}

export default new Transaccion();