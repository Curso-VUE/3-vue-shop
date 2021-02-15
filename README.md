# vue-shop

1. [Crear proyecto con Vue UI](#init)
2. [Instalación y configuración de los plugins](#dependencies)
3. [Iniciar un módulo con Vuex para manejar los productos de la aplicación](#prodruct-manage)
4. [Acciones del módulo *products* haciendo petición HTTP con *async* y *await*](#actions)
5. [Definir la lógica del listado de productos](#product-list)
6. [Primera versión del sitado de productos paginados](#pagination)
7. [Componente que representa un producto](#productItem)
8. [Componente con slots para definir un layout](#slots)
9. [Módulo del carrito de compras](#cart-module)
10. [Añadir productos al carrito desde el listado de productos](#add-product)
11. [Componente carrito](#cart-component)
12. [Persistir Vuex en LocalStorage](#local-storage)
13. [Persistir Vuex en IndexedDB, ideal para PWAs](#indexedDB)

<hr>

<a name="init"></a>

## 1. Crear proyecto con Vue UI

Creamos el nuevo proyecto a través de ```vue ui```

Vamos a utilizar los siguientes plugins:

- [vue-paginate](https://github.com/TahaSh/vue-paginate)
- [bootstrap-vue](https://bootstrap-vue.org/)

<hr>

<a name="dependencies"></a>

## 2. Instalación y configuración de los plugins

Instalamos ambos plugins mediante el comando ```npm i bootstrap-vue vue-paginate```

Para cargar los plugins en la aplicación es buena práctica crear un directorio *plugins* en *src* donde incluiremos un archivo .js por cada plugin que vayamos a utilizar.

- bootstrap-vue.js

~~~javascript
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
~~~

- vue-paginate

~~~javascript
import Vue from 'vue'
import VuePaginate from 'vue-paginate'

Vue.use(VuePaginate)
~~~

Crearemos también en la carpeta *plugins* un *index.js* donde requeriremos los dos ficheros que acabamos de crear.

~~~javascript
require ('./bootstrap-vue');
require ('./vue-paginate');
~~~

Finalmente en *main.js* requerimos el *index.js* de *plugins* después de las importaciones.

~~~javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store'

require('./plugins');
...
~~~

<hr>

<a name="product-manage"></a>

## 3. Iniciar un módulo con Vuex para manejar los productos de la aplicación

Para generar el dataset utilizamos [https://www.mockaroo.com/](https://www.mockaroo.com/) que es un generador de datos aleatorios.

Vamos a generar un dataset con elementos que tengan los parámetros siguientes:
- id
- name
- picture
- price
- stock

Guardamos su contenido en un nuevo archivo *public/fixtures/products.json*.

En este proyecto vamos a trabajar con el **store** mediante módulos, así que dentro de *src* creamos una carpeta *modules* y tantas carpetas como módulos necesitemos. En este caso, por ahora únicamente necesitaremos una carpeta *products*.

Dentro de la carpeta *products* creamos un archivo para las actions, otro para los mutations, otro para el state y finalmente un index que importe los anteriores.
- state.js
~~~javascript
export default {
  products: []
}
~~~

- mutations.js
~~~javascript
export function setProducts (state, products) {
  state.products = products;
}
~~~

- actions.js (por ahora vacío)

- index.js
~~~javascript
import state from './state';
import * as mutations from './mutations';
import * as actions from './actions';

const namespaced = true;

export default {
  namespaced,
  state,
  mutations,
  actions
}
~~~

Finalmente importamos el módulo en el **store**.

~~~javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import products from '../modules/products';

export default new Vuex.Store({
  modules: {
    products
  }
})
~~~

<hr>

<a name="actions"></a>

## 4. Acciones del módulo *products* haciendo petición HTTP con *async* y *await*

Vamos a utilizar las acciones para realizar peticiones asíncronas y actualizar el **store**.

Configuramos la acción en */src/modules/products/actions.js*:

~~~javascript
export async function fetchProducts({ commit }) {
  const data = await fetch('/fixtures/products.json');
  const products = await data.json();
  commit('products/setProducts', products, { root: true });
}
~~~

```En el commit hay que especificar la ruta del mutation que vamos a utilizar, el nuevo valor y { root: true} para indicar que el estado se encuentra en la raiz.```

<hr>

<a name="product-list"></a>

## 5. Definir la lógica del listado de productos

Eliminamos el componente *HelloWorld.vue* así como su importación, declaración y renderizado de *app.vue*. Eliminamos también los estilos, de forma que nos quede el componente limpio.

En generamos un nuevo componente *ProductList*. En él configuramos el mapState y el mapActions para acceder al estado y a las acciones del módulo **products**.

Configuramos el hook **mounted** para obtener los productos una vez el componente se haya cargado.

En el template, visualizamos la cantidad de productos que se han cargado para comprobar que funciona correctamente.

~~~html
<template>
  <div>{{products.length}}</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  mounted () {
    this.fetchProducts()
  },
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts'])
  }
}
</script>
~~~

Configuramos la paginación en los datos de *ProductList*:

~~~javascript
data() {
  return {
    paginate: ['products'],
    perPage: 3
  }
},
~~~

<hr>

<a name="pagination"></a>

## 6. Primera versión del sitado de productos paginados

Creamos una primera aproximación del template de componente *ProductList*.

Primero establecemos que se visualice un alert cuando no haya datos de productos:

~~~html
<template>
  <div v-if="products.length">
    
  </div>
  <b-alert v-else show variant="info">No hay productos para mostar</b-alert>

</template>
~~~

Para la lista de productos paginados utilizamos la etiqueta **paginate** en el **div**:

~~~html
<paginate 
  name="products"
  :list="products"
  :per="perPage"
>
  <p v-for="product in paginated('products')" :key="product.id">{{product.name}}</p>
</paginate>
~~~

Al mismo nivel que paginate renderizamos los links de las siguientes páginas mediante la etiqueta **paginate-links**:

~~~html
<paginate-links
  for="products"
  :limit="10"
  :classes="{
    'ul': 'pagination',
    'li': 'page-item',
    'li > a': 'page-link'
  }"
></paginate-links>
~~~

El límite indica la cantidad máxima de paginate-links que se muestran. Con la configuración de clases podemos añadir una clase a los elementos que decidamos.

<hr>

<a name="ProductItem"></a>

## 7. Componente que representa un producto

Creamos el template del nuevo componente *ProductItem*:

~~~html
<template>
  <b-card
    :title="product.name"
    :img-src="product.picture"
    :img-alt="product.name"
    img-top
    style="max-width: 30rem;"
    class="mb-2"
  >
    <b-button
      block
      variant="warning"
      @click="$emit('addToCart', product)"
    >
      Añadir al carrito
    </b-button>
  </b-card>
</template>
~~~

Definimos en el script las props que nos llegarán del componente padre (en este caso product):

~~~html
<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    }
  }
}
</script>
~~~

En *ProductList* renderizamos el nuevo componente sustityyendo lo que teníamos dentro de las etiquetas **paginate**:

~~~html
<b-card-group columns>
  <product-item
    v-for="product in paginated('products')" 
    :key="product.id" 
    :product="product"
    @addTOCart="addProductToCart"
  ></product-item>
</b-card-group>
~~~

Creamos un método para manejar el evento que se genera la hacer click en el botón del componente hijo:

~~~javascript
methods: {
  ...mapActions('products', ['fetchProducts']),
  addProductToCart (product) {
    console.log(product)
  }
}
~~~

<hr>

<a name="slots"></a>

## 8. Componente con slots para definir un layout

Vamos a utilizar slots para definir un layout en donde mostrar los productos y el carrito.

Generamos un nuevo componente ShopLayout en el que renderizaremos a 9 columnas la lista de productos y a 3 columnas el carrito:

~~~html
<template>
  <b-container>
    <b-row>
      <b-col cols="9">
        <slot name="product-list"></slot>
      </b-col>
      <b-col cols="3">
        <slot name="cart"></slot>
      </b-col>
    <b-row>
  </b-container>
</template>
~~~

Utilizamos el nuevo componente en *app.vue*:

- En el template:

~~~html
<template>
  <div id="app">
    <shop-layout>
      <template slot="product-list">
        <product-list></product-list>
      </template>
      <template slot="cart">
        Carrito
      </template>
    </shop-layout>
  </div>
</template>
~~~

- En el script:

~~~html
<script>
import ProductList from "./components/ProductList.vue";
import ShopLayout from "./components/ShopLayout.vue";

export default {
  name: "App",
  components: {
    ShopLayout,
    ProductList
  },
};
</script>
~~~

<hr>

<a name="cart-module"></a>

## 9. Módulo del carrito

Creamos una nuevo módulo *cart* que tendrá **state**, **mutations** y **getters**.

- *index.js*: Al igual que en el módulo *products* exportamos los elementos del módulo:

~~~js
import state from './state';
import * as mutations from './mutations';
import * as getters from './getters';

const namespaced = true;

export default {
  namespaced,
  state,
  mutations,
  getters
}
~~~

- *state.js*: El estado del módulo contentrá el carrito de la compra
~~~js
export default {
  cart: []
}
~~~

- *mutations.js*: Exsportamos una funciones para añadir un producto a la lista y otra para eliminar un producto.

~~~js
import { find, filter } from 'lodash';

export function addProduct (state, product) {
  const productInCart = find(state.cart, { id: product.id });
  if (!productInCart) {
    const copy = Object.assign({}, product);
    copy.qty = 1;
    state.cart.push(copy);
  } else {
    productInCart.qty += 1;
  }
}

export function removeProductFromCart(state, product) {
  state.cart = filter(state.cart, ({id}) => id !== product.id);
}
~~~

- *getters.js*: Los **getters** permiten obtener los datos del state filtrados o calculados. 

~~~js
export function totalCost(state) {
  return state.cart.reduce((acc, product) => {
    return acc + parseFloat(product.price) * product.qty
  }, 0);
}
~~~


<hr>

<a name="add-product"></a>

## 10. Añadir productos al carrito desde el listado de productos

Vamos a definir el método **addProductToCart** del componente *ProductList* mapeando la mutación del módulo *cart*:

~~~js
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapMutations('cart', ['addProduct']),
    addProductToCart (product) {
      this.addProduct(product);
    }
  }
~~~

<hr>

<a name="cart-component"></a>

## 11. Componente carrito

Generamos el componente *cart* y en el script definimos los siguientes elementos:

- ***data***: array con los nombres de los campos de cada producto que utilizaremos en una tabla de bootstrap.
- ***computed***: **state** y **getters** de *cart*
- ***methods***: **mutations** de *cart*.

~~~html
<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      fields: ['name', 'qty', 'price', 'actions']
    }
  },
  computed: {
    ...mapState('cart', ['cart']),
    ...mapGetters('cart', ['totalCost'])
  },
  methods: {
    ...mapMutations('cart', ['removeProductFromCart'])
  }
}
</script>
~~~

El template quedaría de la siguiente forma:

~~~html
<template>
  <div v-if="cart.length">
    <b-table striped hover :items="cart" :fields="fields">
      <template v-slot:cell(actions)="cell">
        <b-button
          size="sm"
          variant="danger"
          @click.stop="removeProductFromCart(cell.item)"
        >
          Eliminar
        </b-button>
      </template>
    </b-table>
    <b-alert show variant="success" class="text-center">
      Coste total: {{ totalCost }}€
    </b-alert>
  </div>
  <b-alert v-else show variant="info">
    No hay productos en el carrito
  </b-alert>
</template>
~~~

Importamos el componente *cart* al componente principal, *app*:

~~~html
...
  <template slot="cart">
    <cart></cart>
  </template>
...
~~~

~~~js
...
import Cart from "./components/Cart.vue";

  components: {
    ShopLayout,
    ProductList,
    Cart
  },
};
...
~~~


<hr>

<a name="local-storage"></a>

## 12. Persistir Vuex en LocalStorage

Vamos a instalar la dependencia [vuex-persist](https://github.com/championswimmer/vuex-persist) en el proyecto.

Realizamos la modificaciones necesarias en el **store**:

~~~js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import products from '../modules/products';
import cart from '../modules/cart';

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  modules: {
    products,
    cart
  },
  plugins: [vuexLocal.plugin]
})
~~~

De esta forma se guardarán en LocalStorage el estado de todos los módulos de nuestra aplicación. Si decidimosalmacenar el estado de sólo algunos módulos, debemos indicarlo en la configuración del plugin:

~~~js
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['cart']
})
~~~


<hr>

<a name="indexedDB"></a>

## 13. Persistir Vuex en IndexedDB, ideal para PWAs

Vamos a utilizar el plugin [localForage](https://github.com/localForage/localForage)

Únicamente debemos modificar la configuración del storage en VuexPersistance...

~~~js
import localForage from 'localforage'

const vuexLocal = new VuexPersistence({
  storage: localForage,
  asyncStorage: true,
  modules: ['cart']
})
~~~