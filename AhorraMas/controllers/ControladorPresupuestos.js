import Presupuesto from '../models/Presupuesto';

class ControladorPresupuestos {
  async crearPresupuesto(datosPresupuesto) {
    const { usuario_id, servicio_nombre, empresa, tipo_monto, monto, fecha } = datosPresupuesto;

    if (!servicio_nombre || !empresa || !tipo_monto || !monto || !fecha) {
      return { exito: false, mensaje: 'Todos los campos son obligatorios' };
    }

    if (monto <= 0) {
      return { exito: false, mensaje: 'El monto debe ser mayor a 0' };
    }

    try {
      const resultado = await Presupuesto.crear(datosPresupuesto);
      
      if (resultado.exito) {
        return { 
          exito: true, 
          mensaje: 'Presupuesto creado exitosamente',
          presupuestoId: resultado.idInsertado 
        };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async obtenerPresupuestosUsuario(usuarioId, filtros = {}) {
    try {
      const presupuestos = await Presupuesto.obtenerPorUsuarioId(usuarioId, filtros);
      return { exito: true, datos: presupuestos };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: [] };
    }
  }

  async actualizarPresupuesto(id, datosPresupuesto) {
    try {
      const resultado = await Presupuesto.actualizar(id, datosPresupuesto);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Presupuesto actualizado exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async eliminarPresupuesto(id) {
    try {
      const resultado = await Presupuesto.eliminar(id);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Presupuesto eliminado exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async establecerPresupuestoMensual(usuarioId, monto) {
    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1; // 1-12
    const año = fechaActual.getFullYear();

    if (monto <= 0) {
      return { exito: false, mensaje: 'El presupuesto debe ser mayor a 0' };
    }

    try {
      const resultado = await Presupuesto.establecerPresupuestoMensual(usuarioId, monto, mes, año);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Presupuesto mensual guardado exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async obtenerPresupuestoMensual(usuarioId) {
    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();

    try {
      const presupuesto = await Presupuesto.obtenerPresupuestoMensual(usuarioId, mes, año);
      return { exito: true, datos: presupuesto };
    } catch (error) {
      return { exito: false, mensaje: error.message, datos: null };
    }
  }
}

export default new ControladorPresupuestos();