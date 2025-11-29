import BaseDeDatos from '../database/BaseDeDatos';

class Presupuesto {
  async crear(datosPresupuesto) {
    const { usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha } = datosPresupuesto;
    
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        `INSERT INTO presupuestos 
        (usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha]
      );
      return { exito: true, idInsertado: resultado.insertId };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async obtenerPorUsuarioId(usuarioId, filtros = {}) {
    try {
      let sql = 'SELECT * FROM presupuestos WHERE usuario_id = ?';
      let parametros = [usuarioId];

      if (filtros.empresa && filtros.empresa !== 'todas') {
        sql += ' AND empresa = ?';
        parametros.push(filtros.empresa);
      }

      if (filtros.mes && filtros.mes !== 'todas') {
        sql += ' AND strftime("%m", fecha) = ?';
        parametros.push(filtros.mes);
      }

      sql += ' ORDER BY fecha DESC';

      const presupuestos = await BaseDeDatos.obtenerMultiples(sql, parametros);
      return presupuestos;
    } catch (error) {
      throw error;
    }
  }

  async actualizar(id, datosPresupuesto) {
    const { empresa, tipo_monto, monto } = datosPresupuesto;
    
    try {
      await BaseDeDatos.ejecutarConsulta(
        `UPDATE presupuestos 
        SET empresa = ?, tipo_monto = ?, monto = ?
        WHERE id = ?`,
        [empresa, tipo_monto, monto, id]
      );
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async eliminar(id) {
    try {
      await BaseDeDatos.ejecutarConsulta('DELETE FROM presupuestos WHERE id = ?', [id]);
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  // Presupuesto mensual
  async establecerPresupuestoMensual(usuarioId, monto, mes, año) {
    try {
      await BaseDeDatos.ejecutarConsulta(
        `INSERT OR REPLACE INTO presupuesto_mensual (usuario_id, monto, mes, año)
         VALUES (?, ?, ?, ?)`,
        [usuarioId, monto, mes, año]
      );
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async obtenerPresupuestoMensual(usuarioId, mes, año) {
    try {
      const presupuesto = await BaseDeDatos.obtenerUno(
        'SELECT * FROM presupuesto_mensual WHERE usuario_id = ? AND mes = ? AND año = ?',
        [usuarioId, mes, año]
      );
      return presupuesto;
    } catch (error) {
      throw error;
    }
  }
}

export default new Presupuesto();