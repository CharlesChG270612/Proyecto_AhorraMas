import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView,TouchableOpacity,Image,Dimensions,ActivityIndicator,RefreshControl} from 'react-native';
import { Svg, Circle, Path, G } from 'react-native-svg';
import ControladorTransacciones from '../controllers/ControladorTransacciones';
import ControladorAutenticacion from '../controllers/ControladorAutenticacion';

const screenWidth = Dimensions.get("window").width;

const GraficaBarras = ({ datos, altura = 200, colores = [] }) => {
  if (!datos || !datos.datasets || !datos.datasets[0] || datos.datasets[0].data.length === 0) {
    return (
      <View style={[styles.graficaContainer, { height: altura, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.textoSinDatos}>No hay datos disponibles</Text>
      </View>
    );
  }

  const maxValor = Math.max(...datos.datasets[0].data);
  
  return (
    <View style={[styles.graficaContainer, { height: altura }]}>
      <View style={styles.ejeY}>
        {[100, 75, 50, 25, 0].map((valor, index) => (
          <View key={index} style={styles.lineaContainer}>
            <Text style={styles.valorEjeY}>${valor}</Text>
            <View style={styles.lineaFondo} />
          </View>
        ))}
      </View>
      
      <View style={styles.barrasContainer}>
        {datos.datasets[0].data.map((valor, index) => {
          const alturaBarra = (valor / maxValor) * (altura - 60);
          const colorBarra = colores[index] || '#4A90E2';
          
          return (
            <View key={index} style={styles.columnaBarra}>
              <Text style={styles.valorBarra}>${valor}</Text>
              <View 
                style={[
                  styles.barra,
                  { 
                    height: Math.max(alturaBarra, 10),
                    backgroundColor: colorBarra
                  }
                ]} 
              />
              <Text style={styles.etiquetaBarra}>{datos.labels[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const GraficaCircular = ({ datos }) => {
  if (!datos || datos.length === 0 || (datos.length === 1 && datos[0].name === 'Sin datos')) {
    return (
      <View style={[styles.graficaCircularContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.textoSinDatos}>No hay datos disponibles</Text>
      </View>
    );
  }

  const total = datos.reduce((sum, item) => sum + item.population, 0);
  
  return (
    <View style={styles.graficaCircularContainer}>
      <View style={styles.leyendaContainer}>
        {datos.map((item, index) => (
          <View key={index} style={styles.itemLeyenda}>
            <View 
              style={[
                styles.colorLeyenda, 
                { backgroundColor: item.color }
              ]} 
            />
            <View style={styles.infoLeyenda}>
              <Text style={styles.nombreLeyenda}>{item.name}</Text>
              <Text style={styles.valorLeyenda}>
                ${item.population} (${((item.population / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// NUEVO COMPONENTE GRAFICA PASTEL CON SVG
const GraficaPastel = ({ datos, titulo }) => {
  // Si no hay datos válidos, mostrar mensaje
  if (!datos || datos.length === 0 || (datos.length === 1 && datos[0].name === 'Sin datos')) {
    return (
      <View style={[styles.graficaPastelContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.tituloGrafica}>{titulo}</Text>
        <Text style={styles.textoSinDatos}>No hay datos disponibles</Text>
      </View>
    );
  }

  const total = datos.reduce((sum, item) => sum + item.population, 0);
  const size = 200;
  const radius = 80;
  const center = size / 2;

  const polarToCartesian = (angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  const createSlice = (startAngle, endAngle) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z"
    ].join(" ");
  };

  const calculateSlices = () => {
    let currentAngle = 0;
    return datos.map((item, index) => {
      const percentage = item.population / total;
      const angle = percentage * 360;
      const slice = {
        ...item,
        percentage: (percentage * 100).toFixed(1),
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        path: createSlice(currentAngle, currentAngle + angle)
      };
      currentAngle += angle;
      return slice;
    });
  };

  const slices = calculateSlices();

  const getLabelPosition = (slice) => {
    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    const labelRadius = radius * 0.7;
    const pos = polarToCartesian(midAngle);
    
    return {
      x: pos.x,
      y: pos.y
    };
  };

  return (
    <View style={styles.graficaPastelContainer}>
      <Text style={styles.tituloGrafica}>{titulo}</Text>
      
      <View style={styles.pastelContainer}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, index) => (
              <Path
                key={index}
                d={slice.path}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </G>
          
          {slices.map((slice, index) => {
            if (slice.percentage > 5) {
              const pos = getLabelPosition(slice);
              return (
                <Text
                  key={index}
                  x={pos.x}
                  y={pos.y}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {slice.percentage}%
                </Text>
              );
            }
            return null;
          })}

          <Circle cx={center} cy={center} r={radius * 0.3} fill="#fff" />
          <Text
            x={center}
            y={center + 5}
            fill="#666"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Total
          </Text>
          <Text
            x={center}
            y={center + 20}
            fill="#333"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            ${total}
          </Text>
        </Svg>
      </View>

      <View style={styles.leyendaPastel}>
        {datos.map((item, index) => (
          <View key={index} style={styles.itemLeyendaPastel}>
            <View 
              style={[
                styles.colorLeyendaPastel, 
                { backgroundColor: item.color }
              ]} 
            />
            <View style={styles.infoLeyendaPastel}>
              <Text style={styles.nombreLeyendaPastel}>{item.name}</Text>
              <Text style={styles.porcentajeLeyenda}>
                ${item.population} ({(item.population / total * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const MenuTipoGrafica = ({ tipoSeleccionado, onSeleccionar }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const opciones = [
    { key: 'barras', label: '📊 Gráfica de Barras' },
    { key: 'pastel', label: '🥧 Gráfica de Pastel' }
  ];

  const opcionSeleccionada = opciones.find(op => op.key === tipoSeleccionado);

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity 
        style={styles.menuBoton}
        onPress={() => setMenuAbierto(!menuAbierto)}
      >
        <Text style={styles.menuBotonTexto}>
          {opcionSeleccionada?.label || 'Seleccionar gráfica'}
        </Text>
        <Text style={styles.menuIcono}>
          {menuAbierto ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {menuAbierto && (
        <View style={styles.menuOpciones}>
          {opciones.map((opcion) => (
            <TouchableOpacity
              key={opcion.key}
              style={[
                styles.menuOpcion,
                tipoSeleccionado === opcion.key && styles.menuOpcionSeleccionada
              ]}
              onPress={() => {
                onSeleccionar(opcion.key);
                setMenuAbierto(false);
              }}
            >
              <Text style={[
                styles.menuOpcionTexto,
                tipoSeleccionado === opcion.key && styles.menuOpcionTextoSeleccionado
              ]}>
                {opcion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function Interfaz_Grafica({ navigation }) {
  const [tipo, setTipo] = useState('ingresos');
  const [periodo, setPeriodo] = useState('mes');
  const [tipoGrafica, setTipoGrafica] = useState('barras');
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [datosMovimientos, setDatosMovimientos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0
  });
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    verificarYcargarUsuario();
  }, []);

  const verificarYcargarUsuario = async () => {
    try {
      console.log('DEBUG: Obteniendo usuario actual...');
      const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
      
      console.log('DEBUG: Usuario obtenido:', usuarioActual);
      
      if (!usuarioActual) {
        console.log('DEBUG: No hay usuario logueado');
        setCargando(false);
        return;
      }
      
      setUsuario(usuarioActual);
      cargarDatos(usuarioActual.id);
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('DEBUG: Pantalla enfocada, recargando datos...');
      if (usuario) {
        cargarDatos(usuario.id);
      } else {
        verificarYcargarUsuario();
      }
    });

    return unsubscribe;
  }, [navigation, usuario]);

  useEffect(() => {
    if (datosMovimientos.length > 0) {
      calcularEstadisticas();
    }
  }, [datosMovimientos, periodo, tipo]);

  const cargarDatos = async (usuarioId = usuario?.id) => {
    console.log('DEBUG: Cargando datos para usuario:', usuarioId);
    
    if (!usuarioId) {
      console.log('DEBUG: No hay usuario ID, no se pueden cargar datos');
      setCargando(false);
      return;
    }
    
    setCargando(true);
    try {
      console.log('DEBUG: Llamando a ControladorTransacciones.obtenerTransaccionesUsuario');
      const resultado = await ControladorTransacciones.obtenerTransaccionesUsuario(usuarioId);
      
      console.log('DEBUG: Resultado del controlador:', resultado);
      console.log('DEBUG: Transacciones obtenidas:', resultado.datos?.length || 0);
      
      if (resultado.exito) {
        setDatosMovimientos(resultado.datos || []);
      } else {
        console.error('Error cargando transacciones:', resultado.mensaje);
        setDatosMovimientos([]);
      }
    } catch (error) {
      console.error('Error en cargarDatos:', error);
      setDatosMovimientos([]);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  const onRefresh = () => {
    console.log('DEBUG: Actualizando datos manualmente...');
    setRefrescando(true);
    if (usuario) {
      cargarDatos(usuario.id);
    } else {
      verificarYcargarUsuario();
    }
  };

  const calcularEstadisticas = () => {
    console.log('DEBUG: Calculando estadísticas...');
    const transaccionesFiltradas = filtrarTransaccionesPorPeriodo(datosMovimientos, periodo);
    console.log('DEBUG: Transacciones filtradas:', transaccionesFiltradas.length);
    
    const gastos = transaccionesFiltradas.filter(m => m.tipo === 'gasto');
    const ingresos = transaccionesFiltradas.filter(m => m.tipo === 'ingreso');
    
    const totalGastos = gastos.reduce((sum, m) => sum + m.monto, 0);
    const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
    const balance = totalIngresos - totalGastos;

    console.log('DEBUG: Estadísticas calculadas - Ingresos:', totalIngresos, 'Gastos:', totalGastos, 'Balance:', balance);

    setEstadisticas({
      totalIngresos,
      totalGastos,
      balance
    });
  };

  const filtrarTransaccionesPorPeriodo = (transacciones, periodoFiltro) => {
    const ahora = new Date();
    
    return transacciones.filter(transaccion => {
      if (!transaccion.fecha) return false;
      
      const fechaTransaccion = new Date(transaccion.fecha);
      
      switch (periodoFiltro) {
        case 'dia':
          return fechaTransaccion.toDateString() === ahora.toDateString();
        case 'mes':
          return fechaTransaccion.getMonth() === ahora.getMonth() && 
                 fechaTransaccion.getFullYear() === ahora.getFullYear();
        case 'año':
          return fechaTransaccion.getFullYear() === ahora.getFullYear();
        default:
          return true;
      }
    });
  };

  const obtenerDatosGrafica = () => {
    const transaccionesFiltradas = filtrarTransaccionesPorPeriodo(datosMovimientos, periodo);
    const transaccionesTipo = transaccionesFiltradas.filter(t => 
      tipo === 'ingresos' ? t.tipo === 'ingreso' : t.tipo === 'gasto'
    );

    console.log('DEBUG: Transacciones para gráfica:', transaccionesTipo.length);

    const categoriasMap = {};
    transaccionesTipo.forEach(transaccion => {
      if (!transaccion.categoria) return;
      
      if (!categoriasMap[transaccion.categoria]) {
        categoriasMap[transaccion.categoria] = 0;
      }
      categoriasMap[transaccion.categoria] += transaccion.monto;
    });

    const categorias = Object.keys(categoriasMap);
    const montos = Object.values(categoriasMap);

    console.log('DEBUG: Datos agrupados - Categorías:', categorias, 'Montos:', montos);

    if (categorias.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [1] }]
      };
    }

    return {
      labels: categorias,
      datasets: [{ data: montos }]
    };
  };

  const obtenerDatosCategorias = () => {
    const transaccionesFiltradas = filtrarTransaccionesPorPeriodo(datosMovimientos, periodo);
    const transaccionesTipo = transaccionesFiltradas.filter(t => 
      tipo === 'ingresos' ? t.tipo === 'ingreso' : t.tipo === 'gasto'
    );

    const categoriasMap = {};
    transaccionesTipo.forEach(transaccion => {
      if (!transaccion.categoria) return;
      
      if (!categoriasMap[transaccion.categoria]) {
        categoriasMap[transaccion.categoria] = 0;
      }
      categoriasMap[transaccion.categoria] += transaccion.monto;
    });

    const categorias = Object.keys(categoriasMap);
    const colores = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFBE76'];

    console.log('DEBUG: Datos para gráfica circular:', categorias);

    if (categorias.length === 0) {
      return [
        { name: 'Sin datos', population: 1, color: '#CCCCCC' }
      ];
    }

    return categorias.map((categoria, index) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      population: categoriasMap[categoria],
      color: colores[index % colores.length]
    }));
  };

  const obtenerColoresBarras = () => {
    const datosCategorias = obtenerDatosCategorias();
    return datosCategorias.map(item => item.color);
  };

  const obtenerTitulo = () => {
    return tipo === 'ingresos' ? 'Ingresos' : 'Egresos';
  };

  const obtenerTotal = () => {
    return tipo === 'ingresos' ? estadisticas.totalIngresos : estadisticas.totalGastos;
  };

  const obtenerTituloGraficaPastel = () => {
    return `${obtenerTitulo()} por ${periodo === 'dia' ? 'Día' : periodo === 'mes' ? 'Mes' : 'Año'} - Distribución por Categoría`;
  };

  const renderGraficaPrincipal = () => {
    const datosGrafica = obtenerDatosGrafica();
    const coloresBarras = obtenerColoresBarras();

    if (tipoGrafica === 'barras') {
      return (
        <GraficaBarras 
          datos={datosGrafica} 
          altura={220} 
          colores={coloresBarras}
        />
      );
    } else {
      return (
        <GraficaPastel 
          datos={obtenerDatosCategorias()}
          titulo={obtenerTituloGraficaPastel()}
        />
      );
    }
  };

  const obtenerTransaccionesCount = () => {
    const transaccionesFiltradas = filtrarTransaccionesPorPeriodo(datosMovimientos, periodo);
    return transaccionesFiltradas.filter(m => m.tipo === (tipo === 'ingresos' ? 'ingreso' : 'gasto')).length;
  };

  const obtenerCategoriaPrincipal = () => {
    const datosCategorias = obtenerDatosCategorias();
    if (datosCategorias.length === 0 || datosCategorias[0].name === 'Sin datos') {
      return 'N/A';
    }
    return datosCategorias[0].name;
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando gráficas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const titulo = obtenerTitulo();
  const total = obtenerTotal();

  console.log('DEBUG: Renderizando interfaz con', datosMovimientos.length, 'transacciones');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.btnAtras}
        >
          <Image
            source={require("../assets/iconos/flecha-izquierda.png")}
            style={styles.iconoAtras}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gráficas Financieras</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        
        <View style={styles.tipoContainer}>
          <TouchableOpacity 
            style={[styles.tipoBoton, tipo === 'ingresos' && styles.tipoBotonActivo]}
            onPress={() => setTipo('ingresos')}
          >
            <Text style={[styles.tipoTexto, tipo === 'ingresos' && styles.tipoTextoActivo]}>
              📈 Ingresos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tipoBoton, tipo === 'egresos' && styles.tipoBotonActivo]}
            onPress={() => setTipo('egresos')}
          >
            <Text style={[styles.tipoTexto, tipo === 'egresos' && styles.tipoTextoActivo]}>
              📉 Egresos
            </Text>
          </TouchableOpacity>
        </View>

        <MenuTipoGrafica 
          tipoSeleccionado={tipoGrafica}
          onSeleccionar={setTipoGrafica}
        />

        <View style={styles.periodoContainer}>
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'dia' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('dia')}
          >
            <Text style={[styles.periodoTexto, periodo === 'dia' && styles.periodoTextoActivo]}>
              Día
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'mes' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('mes')}
          >
            <Text style={[styles.periodoTexto, periodo === 'mes' && styles.periodoTextoActivo]}>
              Mes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'año' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('año')}
          >
            <Text style={[styles.periodoTexto, periodo === 'año' && styles.periodoTextoActivo]}>
              Año
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moneyRow}>
          <View style={styles.moneyCard}>
            <Text style={styles.sectionTitle}>Total de {titulo}</Text>
            <Text style={[styles.moneyAmount, tipo === 'ingresos' ? styles.moneyPositive : styles.moneyNegative]}>
              {tipo === 'ingresos' ? '+' : '-'} ${total.toFixed(2)}
            </Text>
          </View>

          <View style={styles.moneyCard}>
            <Text style={styles.sectionTitle}>Balance</Text>
            <Text style={[styles.moneyAmount, estadisticas.balance >= 0 ? styles.moneyPositive : styles.moneyNegative]}>
              {estadisticas.balance >= 0 ? '+' : ''} ${estadisticas.balance.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            {tipoGrafica === 'barras' 
              ? `Distribución de ${titulo} por Categoría`
              : 'Distribución por Categoría'
            }
          </Text>
          
          {renderGraficaPrincipal()}
        </View>

        {tipoGrafica === 'barras' && (
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>
              Resumen de Categorías
            </Text>
            <GraficaCircular datos={obtenerDatosCategorias()} />
          </View>
        )}

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas Detalladas</Text>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{titulo} promedio por {periodo}:</Text>
            <Text style={styles.statValue}>
              ${(total / Math.max(obtenerTransaccionesCount(), 1)).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total de transacciones de {titulo.toLowerCase()}:</Text>
            <Text style={styles.statValue}>
              {obtenerTransaccionesCount()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Categoría principal:</Text>
            <Text style={styles.statValue}>
              {obtenerCategoriaPrincipal()}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Porcentaje de {titulo.toLowerCase()}:</Text>
            <Text style={styles.statValue}>
              {estadisticas.totalIngresos + estadisticas.totalGastos > 0 
                ? `${((total / (estadisticas.totalIngresos + estadisticas.totalGastos)) * 100).toFixed(1)}%`
                : '0%'
              }
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  textoSinDatos: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    elevation: 8,
    zIndex: 99,
  },
  btnAtras: { 
    position: "absolute", 
    left: 20, 
    padding: 5 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#222", 
    textAlign: "center" 
  },
  iconoAtras: { 
    width: 25, 
    height: 25, 
    resizeMode: "contain" 
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 30,
  },
  tipoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 6,
    marginBottom: 15,
    width: '100%',
  },
  tipoBoton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tipoBotonActivo: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tipoTextoActivo: {
    fontWeight: '700',
  },
  menuContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
    zIndex: 10,
  },
  menuBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuBotonTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  menuIcono: {
    fontSize: 12,
    color: '#666',
  },
  menuOpciones: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  menuOpcion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuOpcionSeleccionada: {
    backgroundColor: '#f8f9fa',
  },
  menuOpcionTexto: {
    fontSize: 14,
    color: '#333',
  },
  menuOpcionTextoSeleccionado: {
    fontWeight: '600',
    color: '#4A90E2',
  },
  periodoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
    width: '100%',
  },
  periodoBoton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodoBotonActivo: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodoTextoActivo: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  moneyCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  moneyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moneyPositive: {
    color: '#4CAF50',
  },
  moneyNegative: {
    color: '#FF6B6B',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficaContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  ejeY: {
    width: 40,
    justifyContent: 'space-between',
    marginRight: 10,
  },
  lineaContainer: {
    height: 1,
    justifyContent: 'center',
  },
  valorEjeY: {
    fontSize: 10,
    color: '#666',
    position: 'absolute',
    left: 0,
    top: -8,
  },
  lineaFondo: {
    height: 1,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  barrasContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  columnaBarra: {
    alignItems: 'center',
    flex: 1,
  },
  valorBarra: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  barra: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  etiquetaBarra: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  graficaCircularContainer: {
    width: '100%',
    padding: 10,
  },
  graficaPastelContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tituloGrafica: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  pastelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  leyendaPastel: {
    width: '100%',
    marginTop: 20,
  },
  itemLeyendaPastel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  colorLeyendaPastel: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  infoLeyendaPastel: {
    flex: 1,
  },
  nombreLeyendaPastel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  porcentajeLeyenda: {
    fontSize: 12,
    color: '#666',
  },
  leyendaContainer: {
    width: '100%',
  },
  itemLeyenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  colorLeyenda: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  infoLeyenda: {
    flex: 1,
  },
  nombreLeyenda: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  valorLeyenda: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});