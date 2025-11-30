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
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();

    console.log('DEBUG ControladorPresupuestos.establecerPresupuestoMensual:', { usuarioId, monto, mes, año });

    if (monto <= 0) {
      return { exito: false, mensaje: 'El presupuesto debe ser mayor a 0' };
    }

    try {
      const resultado = await Presupuesto.establecerPresupuestoMensual(usuarioId, monto, mes, año);
      
      console.log('DEBUG ControladorPresupuestos.establecerPresupuestoMensual - resultado:', resultado);
      
      if (resultado.exito) {
        return { exito: true, mensaje: 'Presupuesto mensual guardado exitosamente' };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
    } catch (error) {
      console.error('DEBUG ControladorPresupuestos.establecerPresupuestoMensual - error:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async obtenerPresupuestoMensual(usuarioId) {
    try {
      console.log('DEBUG ControladorPresupuestos.obtenerPresupuestoMensual:', usuarioId);
      
      const presupuesto = await Presupuesto.obtenerPresupuestoMensualActual(usuarioId);
      
      console.log('DEBUG ControladorPresupuestos.obtenerPresupuestoMensual - resultado:', presupuesto);
      
      return { exito: true, datos: presupuesto };
    } catch (error) {
      console.error('DEBUG ControladorPresupuestos.obtenerPresupuestoMensual - error:', error);
      return { exito: false, mensaje: error.message, datos: null };
    }
  }

  async obtenerResumenMensual(usuarioId) {
    try {
      console.log('DEBUG ControladorPresupuestos.obtenerResumenMensual:', usuarioId);
      
      const presupuesto = await Presupuesto.obtenerPresupuestoMensualActual(usuarioId);
      const gastosTotales = await Presupuesto.obtenerTotalGastosMensual(usuarioId);
      
      console.log('DEBUG ControladorPresupuestos.obtenerResumenMensual - datos:', {
        presupuesto: presupuesto?.monto || 0,
        gastosTotales,
        restante: (presupuesto?.monto || 0) - gastosTotales
      });
      
      return {
        exito: true,
        datos: {
          presupuesto: presupuesto?.monto || 0,
          gastosTotales: gastosTotales,
          restante: (presupuesto?.monto || 0) - gastosTotales,
          porcentajeUsado: presupuesto?.monto ? (gastosTotales / presupuesto.monto) * 100 : 0
        }
      };
    } catch (error) {
      console.error('DEBUG ControladorPresupuestos.obtenerResumenMensual - error:', error);
      
      return {
        exito: true,
        datos: {
          presupuesto: 0,
          gastosTotales: 0,
          restante: 0,
          porcentajeUsado: 0
        }
      };
    }
  }
}

export default new ControladorPresupuestos();