# vue-shop

1. [Crear proyecto con Vue UI](#init)
2. [Instalación y configuración de los plugins](#dependencies)
3. [Iniciar un módulo con Vuex para manejar los productos de la aplicación](#prodruct-manage)

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

~~~
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
~~~

- vue-paginate

~~~
import Vue from 'vue'
import VuePaginate from 'vue-paginate'

Vue.use(VuePaginate)
~~~

Crearemos también en la carpeta *plugins* un *index.js* donde requeriremos los dos ficheros que acabamos de crear.

~~~
require ('./bootstrap-vue');
require ('./vue-paginate');
~~~

Finalmente en *main.js* requerimos el *index.js* de *plugins* después de las importaciones.

~~~
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
~~~
export default {
  products: []
}
~~~

- mutations.js
~~~
export function setProducts (state, products) {
  state.products = products;
}
~~~

- actions.js (por ahora vacío)

- index.js
~~~
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

~~~
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



