import Transaccion from '../models/Transaccion';

class ControladorTransacciones {
  async crearTransaccion(datosTransaccion) {
    const { usuario_id, nombre, categoria, descripcion, monto, tipo, fecha } = datosTransaccion;

    if (!nombre || !categoria || !monto || !tipo || !fecha) {
      return { exito: false, mensaje: 'Todos los campos son obligatorios' };
    }

    if (monto <= 0) {
      return { exito: false, mensaje: 'El monto debe ser mayor a 0' };
    }

    if (!['ingreso', 'gasto'].includes(tipo)) {
      return { exito: false, mensaje: 'Tipo de transacción inválido' };
    }

    try {
      const resultado = await Transaccion.crear(datosTransaccion);
      
      if (resultado.exito) {
        return { 
          exito: true, 
          mensaje: 'Transacción creada exitosamente',
          transaccionId: resultado.idInsertado 
        };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async obtenerTransaccionesUsuario(usuarioId, filtros = {}) {
    try {
      const transacciones = await Transaccion.obtenerPorUsuarioId(usuarioId, filtros);
      return { exito: true, datos: transacciones };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: [] };
    }
  }

  async actualizarTransaccion(id, datosTransaccion) {
    const { nombre, categoria, descripcion, monto, tipo } = datosTransaccion;

    if (!nombre || !categoria || !monto) {
      return { exito: false, mensaje: 'Nombre, categoría y monto son obligatorios' };
    }

    if (monto <= 0) {
      return { exito: false, mensaje: 'El monto debe ser mayor a 0' };
    }

    if (!['ingreso', 'gasto'].includes(tipo)) {
      return { exito: false, mensaje: 'Tipo de transacción inválido' };
    }

    try {
      const resultado = await Transaccion.actualizar(id, datosTransaccion);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Transacción actualizada exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async eliminarTransaccion(id) {
    try {
      const resultado = await Transaccion.eliminar(id);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Transacción eliminada exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async obtenerEstadisticasFinancieras(usuarioId, periodo) {
    try {
      const estadisticas = await Transaccion.obtenerEstadisticasPorPeriodo(usuarioId, periodo);
      return { exito: true, datos: estadisticas };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: {} };
    }
  }

  async obtenerCategoriasUsuario(usuarioId) {
    try {
      const categorias = await Transaccion.obtenerCategoriasUnicas(usuarioId);
      return { exito: true, datos: categorias };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: [] };
    }
  }

  async obtenerFechasUsuario(usuarioId) {
    try {
      const fechas = await Transaccion.obtenerFechasUnicas(usuarioId);
      return { exito: true, datos: fechas };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: [] };
    }
  }
}

export default new ControladorTransacciones();