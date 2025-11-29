import Usuario from '../models/Usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const usuarioCreado = await Usuario.buscarPorId(resultado.idInsertado);
        await this.guardarSesion(usuarioCreado);
        
        return { 
          exito: true, 
          mensaje: 'Usuario registrado exitosamente',
          usuario: {
            id: usuarioCreado.id,
            usuario: usuarioCreado.usuario,
            correo: usuarioCreado.correo
          }
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
      let usuarioEncontrado = await Usuario.buscarPorUsuario(usuario);
      
      if (!usuarioEncontrado) {
        usuarioEncontrado = await Usuario.buscarPorCorreo(usuario);
      }

      if (!usuarioEncontrado) {
        return { exito: false, mensaje: 'Usuario no encontrado' };
      }

      const contraseñaValida = contraseña === usuarioEncontrado.contraseña;
      
      if (!contraseñaValida) {
        return { exito: false, mensaje: 'Contraseña incorrecta' };
      }

      await this.guardarSesion(usuarioEncontrado);

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

  async guardarSesion(usuario) {
    try {
      const usuarioData = {
        id: usuario.id,
        usuario: usuario.usuario,
        correo: usuario.correo,
        loggedIn: true
      };
      
      await AsyncStorage.setItem('usuario_actual', JSON.stringify(usuarioData));
      return true;
    } catch (error) {
      console.error('Error guardando sesión:', error);
      return false;
    }
  }

  async obtenerUsuarioActual() {
    try {
      const usuarioData = await AsyncStorage.getItem('usuario_actual');
      if (usuarioData) {
        return JSON.parse(usuarioData);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  async cerrarSesion() {
    try {
      await AsyncStorage.removeItem('usuario_actual');
      return { exito: true, mensaje: 'Sesión cerrada exitosamente' };
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return { exito: false, mensaje: 'Error al cerrar sesión' };
    }
  }

  async verificarAutenticacion() {
    try {
      const usuario = await this.obtenerUsuarioActual();
      return usuario !== null && usuario.loggedIn === true;
    } catch (error) {
      return false;
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
}

export default new ControladorAutenticacion();