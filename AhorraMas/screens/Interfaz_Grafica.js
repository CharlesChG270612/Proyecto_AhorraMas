import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Svg, Circle, Path, G } from 'react-native-svg';

const screenWidth = Dimensions.get("window").width;

// Componente de gráfica de barras personalizado MEJORADO
const GraficaBarras = ({ datos, altura = 200, colores = [] }) => {
  const maxValor = Math.max(...datos.datasets[0].data);
  
  return (
    <View style={[styles.graficaContainer, { height: altura }]}>
      {/* Líneas de fondo y valores */}
      <View style={styles.ejeY}>
        {[100, 75, 50, 25, 0].map((valor, index) => (
          <View key={index} style={styles.lineaContainer}>
            <Text style={styles.valorEjeY}>${valor}</Text>
            <View style={styles.lineaFondo} />
          </View>
        ))}
      </View>
      
      {/* Barras */}
      <View style={styles.barrasContainer}>
        {datos.datasets[0].data.map((valor, index) => {
          const alturaBarra = (valor / maxValor) * (altura - 60);
          const colorBarra = colores[index] || '#4A90E2'; // Color por categoría
          
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

// Componente de gráfica circular personalizado
const GraficaCircular = ({ datos }) => {
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
  const total = datos.reduce((sum, item) => sum + item.population, 0);
  const size = 200;
  const radius = 80;
  const center = size / 2;

  // Función para calcular coordenadas polares
  const polarToCartesian = (angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  // Función para crear el path de cada segmento
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

  // Calcular segmentos
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

  // Calcular posición de etiquetas
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
          
          {/* Etiquetas de porcentaje */}
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

          {/* Círculo central */}
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

      {/* Leyenda */}
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

// Componente del menú desplegable para seleccionar tipo de gráfica
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

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    parent.setOptions({ tabBarStyle: { display: "none" } });
    return () =>
      parent.setOptions({
        tabBarStyle: {
          height: 90,
          paddingBottom: 50,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      });
  }, []);
  
  const [tipo, setTipo] = useState('ingresos');
  const [periodo, setPeriodo] = useState('mes');
  const [tipoGrafica, setTipoGrafica] = useState('barras');
  const [cargando, setCargando] = useState(true);
  const [datosMovimientos, setDatosMovimientos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0
  });

  // Datos de ejemplo para ingresos y egresos
  const datosEjemplo = [
    { id: '1', tipo: 'gasto', monto: 450, categoria: 'comida', fecha: '2024-01-05' },
    { id: '2', tipo: 'gasto', monto: 380, categoria: 'transporte', fecha: '2024-01-12' },
    { id: '3', tipo: 'ingreso', monto: 1200, categoria: 'nomina', fecha: '2024-01-15' },
    { id: '4', tipo: 'gasto', monto: 520, categoria: 'servicios', fecha: '2024-01-20' },
    { id: '5', tipo: 'gasto', monto: 300, categoria: 'entretenimiento', fecha: '2024-01-25' },
    { id: '6', tipo: 'ingreso', monto: 800, categoria: 'freelance', fecha: '2024-01-28' },
    { id: '7', tipo: 'gasto', monto: 420, categoria: 'transporte', fecha: '2024-02-10' },
    { id: '8', tipo: 'ingreso', monto: 1200, categoria: 'nomina', fecha: '2024-02-15' },
    { id: '9', tipo: 'gasto', monto: 350, categoria: 'servicios', fecha: '2024-02-18' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (datosMovimientos.length > 0) {
      calcularEstadisticas();
    }
  }, [datosMovimientos, periodo]);

  const cargarDatos = () => {
    setCargando(true);
    setTimeout(() => {
      setDatosMovimientos(datosEjemplo);
      setCargando(false);
    }, 1000);
  };

  const calcularEstadisticas = () => {
    const gastos = datosMovimientos.filter(m => m.tipo === 'gasto');
    const ingresos = datosMovimientos.filter(m => m.tipo === 'ingreso');
    
    const totalGastos = gastos.reduce((sum, m) => sum + m.monto, 0);
    const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
    const balance = totalIngresos - totalGastos;

    setEstadisticas({
      totalIngresos,
      totalGastos,
      balance
    });
  };

  const obtenerDatosGrafica = () => {
    if (tipo === 'ingresos') {
      switch (periodo) {
        case 'dia':
          return {
            labels: ['Nómina', 'Freelance', 'Inversiones', 'Bonos', 'Otros'],
            datasets: [{ data: [850, 320, 180, 120, 80] }] // Porcentajes: 55%, 21%, 12%, 8%, 5%
          };
        case 'mes':
          return {
            labels: ['Nómina', 'Freelance', 'Inversiones', 'Bonos', 'Otros'],
            datasets: [{ data: [2200, 950, 650, 350, 150] }] // Porcentajes: 52%, 22%, 15%, 8%, 4%
          };
        case 'año':
          return {
            labels: ['Nómina', 'Freelance', 'Inversiones', 'Bonos', 'Otros'],
            datasets: [{ data: [14500, 7200, 3800, 2200, 800] }] // Porcentajes: 51%, 25%, 13%, 8%, 3%
          };
        default:
          return {
            labels: ['Nómina', 'Freelance', 'Inversiones', 'Bonos', 'Otros'],
            datasets: [{ data: [2200, 950, 650, 350, 150] }]
          };
      }
    } else {
      // Datos para egresos
      switch (periodo) {
        case 'dia':
          return {
            labels: ['Comida', 'Servicios', 'Transporte', 'Entretenimiento', 'Otros'],
            datasets: [{ data: [180, 95, 75, 45, 25] }] // Porcentajes: 43%, 23%, 18%, 11%, 6%
          };
        case 'mes':
          return {
            labels: ['Comida', 'Servicios', 'Transporte', 'Entretenimiento', 'Otros'],
            datasets: [{ data: [1050, 780, 620, 290, 210] }] // Porcentajes: 35%, 26%, 21%, 10%, 7%
          };
        case 'año':
          return {
            labels: ['Comida', 'Servicios', 'Transporte', 'Entretenimiento', 'Otros'],
            datasets: [{ data: [5800, 4200, 3500, 1800, 1200] }] // Porcentajes: 35%, 25%, 21%, 11%, 7%
          };
        default:
          return {
            labels: ['Comida', 'Servicios', 'Transporte', 'Entretenimiento', 'Otros'],
            datasets: [{ data: [1050, 780, 620, 290, 210] }]
          };
      }
    }
  };

  const obtenerDatosCategorias = () => {
    if (tipo === 'ingresos') {
      switch (periodo) {
        case 'dia':
          return [
            { name: 'Nómina', population: 850, color: '#4CAF50' },      // 55%
            { name: 'Freelance', population: 320, color: '#2196F3' },   // 21%
            { name: 'Inversiones', population: 180, color: '#FF9800' }, // 12%
            { name: 'Bonos', population: 120, color: '#9C27B0' },       // 8%
            { name: 'Otros', population: 80, color: '#607D8B' }         // 5%
          ];
        case 'mes':
          return [
            { name: 'Nómina', population: 2200, color: '#4CAF50' },     // 52%
            { name: 'Freelance', population: 950, color: '#2196F3' },   // 22%
            { name: 'Inversiones', population: 650, color: '#FF9800' }, // 15%
            { name: 'Bonos', population: 350, color: '#9C27B0' },       // 8%
            { name: 'Otros', population: 150, color: '#607D8B' }        // 4%
          ];
        case 'año':
          return [
            { name: 'Nómina', population: 14500, color: '#4CAF50' },    // 51%
            { name: 'Freelance', population: 7200, color: '#2196F3' },  // 25%
            { name: 'Inversiones', population: 3800, color: '#FF9800' },// 13%
            { name: 'Bonos', population: 2200, color: '#9C27B0' },      // 8%
            { name: 'Otros', population: 800, color: '#607D8B' }        // 3%
          ];
        default:
          return [
            { name: 'Nómina', population: 2200, color: '#4CAF50' },
            { name: 'Freelance', population: 950, color: '#2196F3' },
            { name: 'Inversiones', population: 650, color: '#FF9800' },
            { name: 'Bonos', population: 350, color: '#9C27B0' },
            { name: 'Otros', population: 150, color: '#607D8B' }
          ];
      }
    } else {
      switch (periodo) {
        case 'dia':
          return [
            { name: 'Comida', population: 180, color: '#FF6B6B' },      // 43%
            { name: 'Servicios', population: 95, color: '#4ECDC4' },    // 23%
            { name: 'Transporte', population: 75, color: '#45B7D1' },   // 18%
            { name: 'Entretenimiento', population: 45, color: '#96CEB4' }, // 11%
            { name: 'Otros', population: 25, color: '#FFBE76' }         // 6%
          ];
        case 'mes':
          return [
            { name: 'Comida', population: 1050, color: '#FF6B6B' },     // 35%
            { name: 'Servicios', population: 780, color: '#4ECDC4' },   // 26%
            { name: 'Transporte', population: 620, color: '#45B7D1' },  // 21%
            { name: 'Entretenimiento', population: 290, color: '#96CEB4' }, // 10%
            { name: 'Otros', population: 210, color: '#FFBE76' }        // 7%
          ];
        case 'año':
          return [
            { name: 'Comida', population: 5800, color: '#FF6B6B' },     // 35%
            { name: 'Servicios', population: 4200, color: '#4ECDC4' },  // 25%
            { name: 'Transporte', population: 3500, color: '#45B7D1' }, // 21%
            { name: 'Entretenimiento', population: 1800, color: '#96CEB4' }, // 11%
            { name: 'Otros', population: 1200, color: '#FFBE76' }       // 7%
          ];
        default:
          return [
            { name: 'Comida', population: 1050, color: '#FF6B6B' },
            { name: 'Servicios', population: 780, color: '#4ECDC4' },
            { name: 'Transporte', population: 620, color: '#45B7D1' },
            { name: 'Entretenimiento', population: 290, color: '#96CEB4' },
            { name: 'Otros', population: 210, color: '#FFBE76' }
          ];
      }
    }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con flecha de regreso */}
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        
        {/* Selector de Tipo (Ingresos/Egresos) */}
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

        {/* Menú desplegable para seleccionar tipo de gráfica */}
        <MenuTipoGrafica 
          tipoSeleccionado={tipoGrafica}
          onSeleccionar={setTipoGrafica}
        />

        {/* Selector de Periodo */}
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

        {/* Resumen Financiero */}
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

        {/* Gráfica Principal */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            {tipoGrafica === 'barras' 
              ? `Distribución de ${titulo} por Categoría`
              : 'Distribución por Categoría'
            }
          </Text>
          
          {renderGraficaPrincipal()}
        </View>

        {/* Gráfica de Categorías (solo se muestra si la principal es de barras) */}
        {tipoGrafica === 'barras' && (
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>
              Resumen de Categorías
            </Text>
            <GraficaCircular datos={obtenerDatosCategorias()} />
          </View>
        )}

        {/* Estadísticas Detalladas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas Detalladas</Text>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{titulo} promedio por {periodo}:</Text>
            <Text style={styles.statValue}>
              ${(total / (periodo === 'dia' ? 7 : periodo === 'mes' ? 6 : 5)).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total de transacciones de {titulo.toLowerCase()}:</Text>
            <Text style={styles.statValue}>
              {datosMovimientos.filter(m => m.tipo === (tipo === 'ingresos' ? 'ingreso' : 'gasto')).length}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Categoría principal:</Text>
            <Text style={styles.statValue}>
              {obtenerDatosCategorias().length > 0 ? obtenerDatosCategorias()[0].name : 'N/A'}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Porcentaje de {titulo.toLowerCase()}:</Text>
            <Text style={styles.statValue}>
              {tipo === 'ingresos' 
                ? `${((estadisticas.totalIngresos / (estadisticas.totalIngresos + estadisticas.totalGastos)) * 100).toFixed(1)}%`
                : `${((estadisticas.totalGastos / (estadisticas.totalIngresos + estadisticas.totalGastos)) * 100).toFixed(1)}%`
              }
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Los estilos se mantienen igual que en el código anterior
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
  // Selector de Tipo
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
  // Menú desplegable para tipo de gráfica
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
  // Selector de Periodo
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
  // Estilos para gráficas personalizadas
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
  // NUEVOS ESTILOS PARA GRAFICA PASTEL CON SVG
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