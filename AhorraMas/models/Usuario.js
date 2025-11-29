import BaseDeDatos from '../database/BaseDeDatos';

class Usuario {
  async crear(usuario, correo, contraseña) {
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        'INSERT INTO usuarios (usuario, correo, contraseña) VALUES (?, ?, ?)',
        [usuario, correo, contraseña]
      );
      return { exito: true, idInsertado: resultado.insertId };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return { exito: false, error: error.message };
    }
  }

  async buscarPorUsuario(usuario) {
    try {
      const usuarioEncontrado = await BaseDeDatos.obtenerUno(
        'SELECT * FROM usuarios WHERE usuario = ?',
        [usuario]
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error('Error al buscar por usuario:', error);
      return null;
    }
  }

  async buscarPorCorreo(correo) {
    try {
      const usuarioEncontrado = await BaseDeDatos.obtenerUno(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error('Error al buscar por correo:', error);
      return null;
    }
  }

  async buscarPorId(id) {
    try {
      const usuarioEncontrado = await BaseDeDatos.obtenerUno(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error('Error al buscar por ID:', error);
      return null;
    }
  }

  async actualizarContraseña(id, nuevaContraseña) {
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        'UPDATE usuarios SET contraseña = ? WHERE id = ?',
        [nuevaContraseña, id]
      );
      return { 
        exito: true, 
        filasAfectadas: resultado.rowsAffected 
      };
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      return { exito: false, error: error.message };
    }
  }

  async crearTokenRecuperacion(usuarioId, token) {
    try {
      const expiracion = new Date();
      expiracion.setHours(expiracion.getHours() + 1);
      
      await BaseDeDatos.ejecutarConsulta(
        'INSERT OR REPLACE INTO tokens_recuperacion (usuario_id, token, expiracion) VALUES (?, ?, ?)',
        [usuarioId, token, expiracion.toISOString()]
      );
      return { exito: true };
    } catch (error) {
      console.error('Error al crear token de recuperación:', error);
      return { exito: false, error: error.message };
    }
  }

  async buscarPorToken(token) {
    try {
      const resultado = await BaseDeDatos.obtenerUno(
        `SELECT u.* FROM usuarios u 
         JOIN tokens_recuperacion tr ON u.id = tr.usuario_id 
         WHERE tr.token = ? AND tr.expiracion > datetime('now')`,
        [token]
      );
      return resultado;
    } catch (error) {
      console.error('Error al buscar por token:', error);
      return null;
    }
  }

  async eliminarToken(token) {
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        'DELETE FROM tokens_recuperacion WHERE token = ?',
        [token]
      );
      return { 
        exito: true, 
        filasEliminadas: resultado.rowsAffected 
      };
    } catch (error) {
      console.error('Error al eliminar token:', error);
      return { exito: false, error: error.message };
    }
  }

  async eliminarTokensExpirados() {
    try {
      const resultado = await BaseDeDatos.ejecutarConsulta(
        'DELETE FROM tokens_recuperacion WHERE expiracion <= datetime("now")'
      );
      return { 
        exito: true, 
        tokensEliminados: resultado.rowsAffected 
      };
    } catch (error) {
      console.error('Error al eliminar tokens expirados:', error);
      return { exito: false, error: error.message };
    }
  }

  async usuarioExiste(usuario, correo) {
    try {
      const [porUsuario, porCorreo] = await Promise.all([
        this.buscarPorUsuario(usuario),
        this.buscarPorCorreo(correo)
      ]);
      
      return {
        usuarioExiste: !!porUsuario,
        correoExiste: !!porCorreo
      };
    } catch (error) {
      console.error('Error al verificar existencia:', error);
      return { usuarioExiste: false, correoExiste: false };
    }
  }

  async obtenerTodos() {
    try {
      const usuarios = await BaseDeDatos.obtenerMultiples(
        'SELECT id, usuario, correo, creado_en FROM usuarios ORDER BY creado_en DESC'
      );
      return usuarios;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return [];
    }
  }

  async eliminarUsuario(id) {
    try {
      await BaseDeDatos.ejecutarConsulta(
        'DELETE FROM tokens_recuperacion WHERE usuario_id = ?',
        [id]
      );
      
      const resultado = await BaseDeDatos.ejecutarConsulta(
        'DELETE FROM usuarios WHERE id = ?',
        [id]
      );
      
      return { 
        exito: true, 
        filasEliminadas: resultado.rowsAffected 
      };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { exito: false, error: error.message };
    }
  }
}

export default new Usuario();