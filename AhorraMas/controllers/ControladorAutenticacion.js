import Usuario from '../models/Usuario';

class ControladorAutenticacion {
  async registrar(datosUsuario) {
    const { usuario, correo, contraseña } = datosUsuario;

    if (!usuario || !correo || !contraseña) {
      return { exito: false, mensaje: 'Todos los campos son requeridos' };
    }

    if (usuario.length < 3) {
      return { exito: false, mensaje: 'El usuario debe tener al menos 3 caracteres' };
    }

    if (contraseña.length < 6) {
      return { exito: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(correo)) {
      return { exito: false, mensaje: 'Correo electrónico inválido' };
    }

    try {
      const usuarioExistente = await Usuario.buscarPorUsuario(usuario);
      if (usuarioExistente) {
        return { exito: false, mensaje: 'El nombre de usuario ya existe' };
      }

      const correoExistente = await Usuario.buscarPorCorreo(correo);
      if (correoExistente) {
        return { exito: false, mensaje: 'El correo electrónico ya está registrado' };
      }

      const resultado = await Usuario.crear(usuario, correo, contraseña);
      
      if (resultado.exito) {
        return { 
          exito: true, 
          mensaje: 'Usuario registrado exitosamente',
          usuarioId: resultado.idInsertado 
        };
      } else {
        if (resultado.error && resultado.error.includes('UNIQUE')) {
          if (resultado.error.includes('usuario')) {
            return { exito: false, mensaje: 'El nombre de usuario ya existe' };
          } else if (resultado.error.includes('correo')) {
            return { exito: false, mensaje: 'El correo electrónico ya está registrado' };
          }
        }
        return { exito: false, mensaje: 'Error al crear el usuario: ' + resultado.error };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async iniciarSesion(credenciales) {
    const { usuario, contraseña } = credenciales;

    if (!usuario || !contraseña) {
      return { exito: false, mensaje: 'Usuario y contraseña son requeridos' };
    }

    try {
      const usuarioEncontrado = await Usuario.buscarPorUsuario(usuario);
      
      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'Usuario no encontrado' };
      }

      const contraseñaValida = contraseña === usuarioEncontrado.contraseña;
      
      if (!contraseñaValida) {
        return { exito: false, mensaje: 'Contraseña incorrecta' };
      }

      return { 
        exito: true, 
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuarioEncontrado.id,
          usuario: usuarioEncontrado.usuario,
          correo: usuarioEncontrado.correo
        }
      };
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async recuperarContraseña(datos) {
    const { usuarioOCorreo } = datos;

    if (!usuarioOCorreo) {
      return { exito: false, mensaje: 'Ingresa tu usuario o correo electrónico' };
    }

    try {
      let usuarioEncontrado = await Usuario.buscarPorUsuario(usuarioOCorreo);
      
      if (!usuarioEncontrado) {
        usuarioEncontrado = await Usuario.buscarPorCorreo(usuarioOCorreo);
      }

      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'No se encontró ningún usuario con ese nombre o correo electrónico' };
      }

      return { 
        exito: true, 
        mensaje: `Tu contraseña es: ${usuarioEncontrado.contraseña}`,
        contraseña: usuarioEncontrado.contraseña,
        usuario: usuarioEncontrado.usuario
      };
      
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async restablecerContraseña(datos) {
    const { usuarioOCorreo, nuevaContraseña, token } = datos;

    if (!usuarioOCorreo || !nuevaContraseña) {
      return { exito: false, mensaje: 'Todos los campos son requeridos' };
    }

    if (nuevaContraseña.length < 6) {
      return { exito: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
    }

    try {
      let usuarioEncontrado = await Usuario.buscarPorUsuario(usuarioOCorreo);
      
      if (!usuarioEncontrado) {
        usuarioEncontrado = await Usuario.buscarPorCorreo(usuarioOCorreo);
      }

      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'Usuario o correo electrónico no encontrado' };
      }

      if (token) {
        const usuarioPorToken = await Usuario.buscarPorToken(token);
        if (!usuarioPorToken || usuarioPorToken.id !== usuarioEncontrado.id) {
          return { exito: false, mensaje: 'Token de recuperación inválido o expirado' };
        }
        
        await Usuario.eliminarToken(token);
      }

      const resultado = await Usuario.actualizarContraseña(usuarioEncontrado.id, nuevaContraseña);
      
      if (resultado.exito) {
        return { 
          exito: true, 
          mensaje: 'Contraseña restablecida exitosamente'
        };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
      
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async validarTokenRecuperacion(token) {
    if (!token) {
      return { exito: false, mensaje: 'Token no proporcionado' };
    }

    try {
      const usuarioEncontrado = await Usuario.buscarPorToken(token);
      
      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'Token inválido o expirado' };
      }

      return { 
        exito: true, 
        mensaje: 'Token válido',
        usuario: {
          id: usuarioEncontrado.id,
          usuario: usuarioEncontrado.usuario,
          correo: usuarioEncontrado.correo
        }
      };
    } catch (error) {
      console.error('Error al validar token:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async cambiarContraseña(datos) {
    const { usuarioId, contraseñaActual, nuevaContraseña } = datos;

    if (!usuarioId || !contraseñaActual || !nuevaContraseña) {
      return { exito: false, mensaje: 'Todos los campos son requeridos' };
    }

    if (nuevaContraseña.length < 6) {
      return { exito: false, mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    try {
      const usuarioEncontrado = await Usuario.buscarPorId(usuarioId);
      
      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'Usuario no encontrado' };
      }

      const contraseñaValida = contraseñaActual === usuarioEncontrado.contraseña;
      
      if (!contraseñaValida) {
        return { exito: false, mensaje: 'Contraseña actual incorrecta' };
      }

      const resultado = await Usuario.actualizarContraseña(usuarioId, nuevaContraseña);
      
      if (resultado.exito) {
        return { 
          exito: true, 
          mensaje: 'Contraseña cambiada exitosamente'
        };
      } else {
        return { exito: false, mensaje: resultado.error };
      }
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { exito: false, mensaje: 'Error del servidor: ' + error.message };
    }
  }

  async limpiarTokensExpirados() {
    try {
      const resultado = await Usuario.eliminarTokensExpirados();
      return { 
        exito: true, 
        mensaje: `Tokens expirados eliminados: ${resultado.tokensEliminados || 0}`
      };
    } catch (error) {
      console.error('Error al limpiar tokens expirados:', error);
      return { exito: false, mensaje: 'Error al limpiar tokens expirados' };
    }
  }
}

export default new ControladorAutenticacion();