import BaseDeDatos from '../database/BaseDeDatos';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Presupuesto {
  async crear(datosPresupuesto) {
    const { usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha } = datosPresupuesto;
    
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        `INSERT INTO presupuestos 
        (usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [parseInt(usuario_id), servicio_nombre, empresa, tipo_monto, monto, fecha]
      );
      return { exito: true, idInsertado: resultado.insertId };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }

  async obtenerPorUsuarioId(usuarioId, filtros = {}) {
    try {
      let sql = 'SELECT * FROM presupuestos WHERE usuario_id = ?';
      let parametros = [parseInt(usuarioId)];

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

  async establecerPresupuestoMensual(usuarioId, monto, mes, año) {
    try {
      console.log('DEBUG Presupuesto.establecerPresupuestoMensual:', { usuarioId, monto, mes, año });
      
      const presupuestoMensual = {
        id: `${usuarioId}_${mes}_${año}`,
        usuario_id: parseInt(usuarioId),
        monto: parseFloat(monto),
        mes: parseInt(mes),
        año: parseInt(año),
        creado_en: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(
        `ahorraplus_presupuesto_mensual_${presupuestoMensual.id}`,
        JSON.stringify(presupuestoMensual)
      );
      
      console.log('DEBUG Presupuesto.establecerPresupuestoMensual - guardado en AsyncStorage:', presupuestoMensual);
      return { exito: true };
    } catch (error) {
      console.error('DEBUG Presupuesto.establecerPresupuestoMensual - error:', error);
      return { exito: false, error: error.message };
    }
  }

  async obtenerPresupuestoMensual(usuarioId, mes, año) {
    try {
      console.log('DEBUG Presupuesto.obtenerPresupuestoMensual:', { usuarioId, mes, año });
      
      const clave = `ahorraplus_presupuesto_mensual_${usuarioId}_${mes}_${año}`;
      const presupuestoData = await AsyncStorage.getItem(clave);
      
      if (presupuestoData) {
        const presupuesto = JSON.parse(presupuestoData);
        console.log('DEBUG Presupuesto.obtenerPresupuestoMensual - encontrado en AsyncStorage:', presupuesto);
        return presupuesto;
      }
      
      console.log('DEBUG Presupuesto.obtenerPresupuestoMensual - no encontrado');
      return null;
    } catch (error) {
      console.error('DEBUG Presupuesto.obtenerPresupuestoMensual - error:', error);
      throw error;
    }
  }

  async obtenerPresupuestoMensualActual(usuarioId) {
    try {
      const fechaActual = new Date();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear();

      console.log('DEBUG Presupuesto.obtenerPresupuestoMensualActual:', { usuarioId, mes, año });
      
      const presupuesto = await this.obtenerPresupuestoMensual(usuarioId, mes, año);
      
      console.log('DEBUG Presupuesto.obtenerPresupuestoMensualActual - resultado:', presupuesto);
      return presupuesto;
    } catch (error) {
      console.error('DEBUG Presupuesto.obtenerPresupuestoMensualActual - error:', error);
      throw error;
    }
  }

  async obtenerTotalGastosMensual(usuarioId) {
    try {
      const fechaActual = new Date();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear();

      console.log('DEBUG Presupuesto.obtenerTotalGastosMensual:', { usuarioId, mes, año });
      
      const resultado = await BaseDeDatos.obtenerMultiples(
        `SELECT * FROM presupuestos 
         WHERE usuario_id = ?`,
        [parseInt(usuarioId)]
      );

      console.log('DEBUG Presupuesto.obtenerTotalGastosMensual - todos los registros:', resultado);
      
      let totalGastos = 0;
      resultado.forEach(item => {
        if (item.fecha) {
          const fechaItem = new Date(item.fecha);
          if (fechaItem.getMonth() + 1 === mes && fechaItem.getFullYear() === año) {
            totalGastos += parseFloat(item.monto) || 0;
          }
        }
      });
      
      console.log('DEBUG Presupuesto.obtenerTotalGastosMensual - total calculado:', totalGastos);
      return totalGastos;
    } catch (error) {
      console.error('DEBUG Presupuesto.obtenerTotalGastosMensual - error:', error);
      return 0;
    }
  }
}

export default new Presupuesto();