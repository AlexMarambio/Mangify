# Mangify

Este proyecto utiliza **TypeScript**, **React** y **TailwindCSS**.

---

## 📁 Estructura del proyecto

```bash
.
├── src
│   ├── assets        # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components    # Componentes reutilizables de la UI
│   ├── pages         # Vistas de las páginas principales
│   ├── hooks         # Custom Hooks para lógica reutilizable
│   ├── context       # Contextos de React para manejo de estado global
│   └── utils         # Utilidades y funciones auxiliares
├── public            # Archivos públicos
├── package.json      # Dependencias y scripts del proyecto
└── tsconfig.json     # Configuración de TypeScript
Y más...
```

---

## 🛠 Tecnologías utilizadas

- **TypeScript**: Tipado estático para un código más seguro y mantenible.
- **React**: Biblioteca para crear interfaces de usuario con componentes reutilizables.
- **TailwindCSS**: Framework CSS basado en utilidades para un diseño moderno y rápido.

---

## 🚀 Instalación para el desarrollo

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/AlexMarambio/Mangify.git
   cd Mangify
   ```

2. Verifica las ramas existentes:

   Este proyecto trabaja con Git Flow, no inicializar de nuevo.

   ```bash
   git branch -a
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Ejecutar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

---

## 📏 Convenciones y mejores prácticas

1. **Nombres en inglés**: Todas las variables, funciones y componentes deben estar en inglés.
2. **camelCase** para variables y funciones:
   ```javascript
   const userName = "John Doe";
   function fetchUserData() { ... }
   ```
3. **PascalCase** para componentes de React:
   ```javascript
   const UserCard = () => { ... };
   export default UserCard;
   ```
4. **Archivos organizados por componentes**:  
   Cada componente puede tener su propia carpeta:

   ```bash
   src/components/UserCard/
   ├── UserCard.tsx
   └── index.ts
   ```

5. **Uso de TypeScript**: Definir tipos e interfaces para mantener el código seguro.
   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
   }
   ```
6. **TailwindCSS**: Priorizar clases utilitarias sobre CSS personalizado.

---

## 📜 Scripts disponibles

- **`npm run dev`**: Inicia el servidor de desarrollo.
- **`npm run build`**: Genera una versión optimizada para producción.

---

## 🌲 Flujo de trabajo con Git

1. Crear una rama para cada nueva funcionalidad:

   Sin las extensiones de Git Flow

   ```bash
   ggit checkout develop
   git checkout -b feature_namefeature
   ```

   Con la extensión de Git Flow

   ```bash
   git flow feature start feature_namefeature
   ```

   Una vez finalizado el desarrollo de la feature se debe finalizar:

   ```bash
   git checkout develop
   git merge feature_branch
   ```

   Ó

   ```bash
   git flow feature finish feature_branch
   ```

   Esto creará un PR.

   LEER DOCUMENTACIÓN.

---
## Documentación de uso

### Editor/Viewer
- Página principal:
   Al ingresar a esta página se mostrarán dos botones:
   - Editor: Ingresar al editor
   - Viewer: Ingresar al visualizador de mangas
- Editor:
  Aquí estaran las todas las opciones para editar el manga, Estará distribuido en 6 partes principales:
   1. Navbar: Aqui se mostrarán opciones tales como:
      - Menú: Aqui se puede cambiar de manga a editar, además de seleccionar los test.
      - Separador de viñetas: Al seleccionar este botón se modificara la segunda columna y se mostraran dos botones para agregar o eliminar viñetas a editar.
      - Música: Al seleccionar este botón se mostrarán las categorias de música para agregar a la linea de tiempo.
   2. Selección de páginas:
      Scroll-bar donde aparecen todas las páginas y al momento de seleccionar una página se cambiara la página a editar.
   3. Opciones del navbar:
      Se muestran las herramientas seleccionadas en el navbar.
   4.Manga:
      Se muestra el manga seleccionado a editar, en esta sección de la página se estarán dividiendo las viñetas para editar. Al momento dar clic en distintas partes del manga mostrado para empezar a crear formas que representan viñetas separadas.
   5.Linea de tiempo:
      En esta sección se mostraran los nodos los cuales representan una música cada uno y además dentro de estos hay unos circulos llamados bullet los cuales se pueden mover para cambiar el orden de las viñetas.
   6.Separador de viñetas:
      Trabaja en conjunto con la sección de mangas y contiene 4 botones con las siguientes funcionalidades:
      - Finalizar forma: Para cerrar una figura.
      - Eliminar último punto: Para eliminar el ultimo punto creado.
      - Eliminar última forma: Para eliminar la ultima figura creada.
      - Exportar cómic: Cuando se esta lista la página se tiene que exportar.
