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
# 📖 Documentación de Uso – Editor/Viewer de Mangas
## 🏠 Página Principal

Al ingresar a la aplicación se presentan dos opciones:

    🔧 Editor: Accede al editor de mangas.

    👁️ Viewer: Visualiza los mangas disponibles.

## ✏️ Editor de Mangas

El editor está dividido en 6 secciones principales que te permiten modificar y personalizar tus mangas:
1. 🧭 Navbar

Contiene las herramientas principales de edición:

    Menú: Cambia el manga a editar o selecciona los test disponibles.

    Separador de viñetas: Activa opciones para agregar o eliminar viñetas.

    Música: Muestra las categorías de música disponibles para agregar a la línea de tiempo.

2. 📜 Selección de Páginas

Una barra lateral con scroll que muestra todas las páginas del manga. Al seleccionar una, se carga para su edición.

3. 🛠️ Opciones del Navbar

Aquí se despliegan las herramientas actualmente seleccionadas desde el navbar.

4. 📚 Manga

Se visualiza la página actual del manga. Puedes hacer clic en diferentes partes de la imagen para crear figuras que representen viñetas separadas.

5. 🎵 Línea de Tiempo

Representa una línea para sincronizar el orden de visualización de viñetas con la música a reproducir:

    🎵 Cada nodo representa una pista musical.

    🖱️ Dentro de cada nodo hay bullets (círculos) que pueden moverse para reordenar las viñetas.

    🔄 Asigna la música a reproducir para las viñetas que estimes convenientes.
      
6. ✂️ Separador de Viñetas

Trabaja junto a la sección del manga. Incluye los siguientes botones:

    ✅ Finalizar forma: Cierra la figura actual.

    ❌ Eliminar último punto: Borra el último punto agregado a la figura.

    🗑️ Eliminar última forma: Elimina la última figura completa.

    📤 Exportar cómic: Guarda la página editada cuando esté lista.
